# Security policy for the archived snapshot

This repository is not a supported application and must not receive real credentials or financial data. Do not report product availability issues: no product is operated from this code.

If a credential is discovered in the current tree or history, treat it as exposed, rotate it at the provider, preserve evidence, and remove it through the organization's incident process. Never place secrets in issues, screenshots, fixtures, command lines, or commits.

The known history finding in `HISTORY_SECURITY_FINDINGS.md` is open. Do not consider deletion from the current branch sufficient: the candidate remains reachable through a remote-tracking feature branch. An authorized owner must revoke it at the provider before any coordinated remote-history cleanup.

For changes to archive controls, require review of `workspace-governance.json`, the protected-payload digest, the launch guards, the known history finding, and both dependency-free checks. A request to add wallet, chain, market-data, transaction, or deployment behavior is a reactivation request and must follow the gate in `ARCHIVE_STATUS.md`; it is not routine archive maintenance.
