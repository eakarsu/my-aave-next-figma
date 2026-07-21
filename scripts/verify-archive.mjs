import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const failures = [];
const fail = (message) => failures.push(message);
const read = (path) => readFileSync(join(root, path), "utf8");
const governance = JSON.parse(read("workspace-governance.json"));
const packageJson = JSON.parse(read("package.json"));

if (governance.disposition !== "archived-read-only-design-reference") fail("archive disposition changed");
for (const key of ["publicDeploymentAllowed", "publicRedistributionAllowed", "dependencyInstallationAllowed", "applicationExecutionAllowed"]) {
  if (governance[key] !== false) fail(`${key} must remain false`);
}

const expectedScripts = {
  preinstall: "node scripts/archived-command.mjs dependency-install",
  dev: "node scripts/archived-command.mjs dev",
  build: "node scripts/archived-command.mjs build",
  start: "node scripts/archived-command.mjs start",
  lint: "node scripts/archived-command.mjs lint",
  test: "node scripts/archived-command.mjs test",
  "archive:verify": "node scripts/verify-archive.mjs",
  "security:scan": "node scripts/scan-secrets.mjs",
};
for (const [name, command] of Object.entries(expectedScripts)) {
  if (packageJson.scripts?.[name] !== command) fail(`package script ${name} is not guarded`);
}

const app = read("src/pages/_app.js");
if (!app.includes("Archived UI mock.")) fail("visible archive warning is missing");
if (!app.includes('name="robots" content="noindex,nofollow"')) fail("search-indexing boundary is missing");
if (existsSync(join(root, "src/pages/api"))) fail("API routes are prohibited in the archive");

function collect(path) {
  const absolute = join(root, path);
  if (!existsSync(absolute)) {
    fail(`protected path is missing: ${path}`);
    return [];
  }
  const stat = lstatSync(absolute);
  if (stat.isSymbolicLink()) {
    fail(`symbolic links are prohibited in protected payload: ${path}`);
    return [];
  }
  if (stat.isFile()) return [path];
  return readdirSync(absolute).sort().flatMap((name) => collect(join(path, name)));
}

const protectedFiles = governance.protectedPayload.paths.flatMap(collect).sort();
const digest = createHash("sha256");
for (const path of protectedFiles) {
  digest.update(path);
  digest.update("\0");
  digest.update(readFileSync(join(root, path)));
  digest.update("\0");
}
const actualDigest = digest.digest("hex");
if (governance.protectedPayload.sha256 !== actualDigest) {
  fail(`protected payload digest mismatch: expected ${governance.protectedPayload.sha256}, got ${actualDigest}`);
}

const codeExtensions = new Set([".js", ".jsx", ".ts", ".tsx"]);
const forbiddenRuntime = [
  ["network request", /\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/],
  ["HTTP client", /\baxios\b/],
  ["browser wallet", /window\s*\.\s*ethereum|walletconnect/i],
  ["chain transaction", /eth_sendTransaction|sendTransaction\s*\(/i],
  ["web3 library", /(?:from\s+["'](?:ethers|web3)|require\s*\(\s*["'](?:ethers|web3))/i],
];
for (const path of protectedFiles.filter((path) => codeExtensions.has(extname(path)))) {
  const content = read(path);
  for (const [label, pattern] of forbiddenRuntime) {
    if (pattern.test(content)) fail(`${label} capability found in ${path}`);
  }
}

const baseline = governance.baseline;
const treeCheck = spawnSync("git", ["rev-parse", `${baseline.commit}^{tree}`], { cwd: root, encoding: "utf8" });
if (treeCheck.status !== 0 || treeCheck.stdout.trim() !== baseline.tree) fail("recorded baseline Git tree cannot be verified");
const diffCheck = spawnSync(
  "git",
  ["diff", "--name-only", baseline.commit, "--", ...governance.protectedPayload.paths],
  { cwd: root, encoding: "utf8" },
);
if (diffCheck.status !== 0) {
  fail("protected payload Git diff could not be verified");
} else {
  const changes = diffCheck.stdout.trim().split("\n").filter(Boolean).sort();
  const allowed = [...governance.protectedPayload.allowedChangesFromBaseline].sort();
  if (JSON.stringify(changes) !== JSON.stringify(allowed)) {
    fail(`unexpected protected payload changes: ${changes.join(", ") || "none"}`);
  }
}

for (const document of ["README.md", "ARCHIVE_STATUS.md", "DEPENDENCY_RISK.md", "HISTORY_SECURITY_FINDINGS.md", "SECURITY.md"]) {
  if (!existsSync(join(root, document))) fail(`required archive document is missing: ${document}`);
}

if (governance.historySecurityFinding?.status !== "open-provider-revocation-and-history-remediation-required") {
  fail("known history security finding is missing or incorrectly closed");
}

if (failures.length) {
  console.error(`Archive verification failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Archive verification passed: ${protectedFiles.length} protected files, digest ${actualDigest}.`);
