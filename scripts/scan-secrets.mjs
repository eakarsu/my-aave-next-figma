import { readFileSync, readdirSync, lstatSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const excludedDirectories = new Set([".git", ".next", "node_modules", "dist", "build"]);
const excludedFiles = new Set(["yarn.lock", "yarn-error.log"]);
const textExtensions = new Set([
  "", ".css", ".html", ".js", ".json", ".jsx", ".md", ".mjs", ".toml", ".txt", ".yaml", ".yml",
]);
const signatures = [
  ["private key block", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["AWS access key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ["GitHub token", /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,255}\b/],
  ["OpenAI-style key", /\bsk-[A-Za-z0-9_-]{32,}\b/],
  ["assigned high-risk secret", /\b(?:api[_-]?key|client[_-]?secret|private[_-]?key|password|token)\s*[:=]\s*["'][^"'\s]{12,}["']/i],
];

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (excludedDirectories.has(entry.name)) return [];
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return files(path);
    if (!entry.isFile() || excludedFiles.has(entry.name) || !textExtensions.has(extname(entry.name))) return [];
    if (lstatSync(path).isSymbolicLink()) return [];
    return [path];
  });
}

const findings = [];
for (const path of files(root)) {
  const content = readFileSync(path, "utf8");
  for (const [label, pattern] of signatures) {
    if (pattern.test(content)) findings.push(`${relative(root, path)}: ${label}`);
  }
}

if (findings.length) {
  console.error(`Secret scan failed:\n${findings.join("\n")}`);
  process.exit(1);
}

console.log("Secret scan passed: no high-confidence credential formats found in the current tree.");
