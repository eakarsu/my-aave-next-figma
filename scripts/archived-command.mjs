const command = process.argv[2] || "application command";

console.error(
  [
    `Blocked archived command: ${command}.`,
    "This repository is a read-only internal design reference, not a finance application.",
    "Run `node scripts/verify-archive.mjs` to verify the archive boundary.",
  ].join("\n"),
);

process.exit(78);
