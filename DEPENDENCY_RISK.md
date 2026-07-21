# Archived dependency risk

The dependency graph is frozen evidence and is not an approved runtime. The manifest pins Next.js 12.0.4 and React 17.0.2 alongside other 2021-era packages. `yarn.lock` is retained for provenance; `yarn-error.log` is also part of the original snapshot.

On 2026-07-20, an isolated temporary npm lock resolution using `--legacy-peer-deps` and with lifecycle scripts disabled reported 622 total resolved dependencies and 12 advisories:

| Severity | Count |
| --- | ---: |
| Critical | 4 |
| High | 2 |
| Moderate | 2 |
| Low | 4 |

This is an indicative registry snapshot, not a claim that npm exactly reproduces the checked-in Yarn resolution. No dependency was installed into this repository and no archived package code was executed.

Do not suppress, waive, or mechanically patch these findings in the archive. Any reactivation must start in a separately approved repository, select supported dependencies from current primary documentation, regenerate an exact lockfile, review license and supply-chain risk, and pass build, test, security, and operational gates.
