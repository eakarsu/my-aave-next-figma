# Archived DeFi UI design reference

This repository is a frozen, read-only snapshot of a 2021 Next.js interface mock. It is **not** an Aave client, wallet, trading application, or production service.

The screens contain hard-coded presentation data. There is no wallet connection, chain RPC, contract integration, licensed market feed, persistence layer, transaction submission, reconciliation, or operational control plane. The repository has no detected license grant, so it is retained for internal provenance and design review only; do not publicly redistribute or deploy it.

## Supported use

The only supported commands use the host's Node.js runtime and install no dependencies:

```sh
node scripts/verify-archive.mjs
node scripts/scan-secrets.mjs
```

Equivalent package commands are `npm run archive:verify` and `npm run security:scan`. Package installation and the former `dev`, `build`, `start`, `lint`, and `test` commands fail closed with exit code 78.

The archived dependency graph is intentionally not installed or executed. See `DEPENDENCY_RISK.md` for the recorded advisory snapshot and `ARCHIVE_STATUS.md` for the boundary and reactivation process.

## Safety boundary

- Never enter a seed phrase, private key, wallet approval, account credential, or real transaction into this interface.
- Do not use the displayed balances, prices, yields, protocol labels, or risk figures for financial decisions.
- A direct framework launch outside the guarded commands is unsupported. A persistent on-screen banner identifies the mock if somebody bypasses the guard.
- Turning this snapshot into a live finance product requires a separately approved project with licensed integrations, deterministic risk controls, human approvals, ledger-grade accounting, custody reconciliation, security review, and independent legal/compliance approval.

See `workspace-governance.json` for the machine-readable disposition.
