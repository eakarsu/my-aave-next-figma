# Archive status

## Disposition

`my-aave-next-figma` is an **unsupported internal design reference**. The original repository is a static visual prototype, not a functioning finance application. Its product-like navigation and labels are retained only to preserve design provenance.

The archived baseline is:

- remote: `https://github.com/eakarsu/my-aave-next-figma`
- commit: `a49d93544ad433ab5e4380d0cc1107d7e3afa2b2`
- tree: `cbdec098e14d455245f721b53d5e041a5c3c8c3b`
- current branch history: 3 commits; all locally reachable refs: 21 commits
- original tracked files: 133
- original detected license grant: none

The safety banner in `src/pages/_app.js` and its style in `src/styles/globals.css` are the only permitted changes inside the protected UI payload. The integrity verifier compares that payload with the digest in `workspace-governance.json` and confirms that no other original UI file drifted from the baseline commit.

## Enforced controls

- Normal dependency installation and application lifecycle scripts fail closed with exit code 78.
- The dependency-free verifier checks the disposition, baseline, protected payload, launch guards, visible warning, and absence of network/wallet/transaction integrations.
- The dependency-free secret scanner checks the current tree for high-confidence credential formats.
- CI runs both checks without installing or executing the archived dependency graph.
- The UI carries `noindex,nofollow` metadata and a persistent warning if somebody bypasses the supported command boundary.

The current tree is clean under both the dependency-free scanner and Gitleaks. A Gitleaks scan of every locally reachable ref found two credible API-key candidates in deleted feature-branch code. Provider revocation and coordinated remote-history remediation remain open; see `HISTORY_SECURITY_FINDINGS.md`. The same scan classified 341 other generic-key findings as public 42-character Kovan contract addresses, not credentials.

## Reactivation gate

Do not reactivate this codebase in place. A separately approved repository must first establish ownership and licensing, current supported dependencies, an explicit product and threat model, authenticated tenant boundaries, licensed external data, deterministic risk and loss limits, human approvals, kill switches, idempotent transaction handling, append-only audit and ledger records, custody reconciliation, correction/corporate-action handling, disaster recovery, and independent security/legal review. Paper-trading failure scenarios must pass before any consideration of live integration.
