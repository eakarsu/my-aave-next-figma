# Historical security findings

## Open provider-revocation action

A redacted Gitleaks scan of all 21 commits reachable from local branches and remote-tracking refs found two `generic-api-key` candidates in deleted code:

- reachable ref: `refs/remotes/origin/feature`
- introducing commit: `9fe6838de50924fc1f3e0a26dac07d7ba5961986`
- path: `src/helpers/getWalletBalances.js`
- historical lines: 38 and 130
- context: the same 32-character value was assigned to an API-key-style request header in two request blocks

No candidate value is repeated in this document. The current branch and current worktree do not contain it.

Treat the candidate as exposed. An authorized provider/account owner must revoke or rotate it and retain incident evidence. After revocation, repository owners may coordinate removal of the remote feature ref and/or a history rewrite with every clone owner. This workspace does not perform destructive history rewriting or remote mutation without that explicit coordination.

## Classified false positives

The same history scan reported 341 additional `generic-api-key` findings in three deleted Kovan network constant files. Structural inspection showed that every reported value is a 42-character `0x` public Ethereum contract address under fields such as `address`, `aTokenAddress`, `stableDebtTokenAddress`, and `variableDebtTokenAddress`. These are public identifiers, not credentials, and are recorded as scanner false positives rather than allowlisted globally.

## Verification record

- Current-tree dependency-free scan: pass
- Current-tree Gitleaks scan: pass
- Full reachable-history Gitleaks scan: expected fail, 343 findings total
- Classification: 2 credible repeated API-key candidates; 341 public-address false positives

Public deployment and redistribution remain prohibited independently by the archive disposition and missing license grant.
