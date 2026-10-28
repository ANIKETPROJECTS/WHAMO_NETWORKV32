# Final Project Report

## WHAMO Network Designer

> **Status: Draft template.** Complete with verified project records and evidence. Do not claim a test passed, a requirement was accepted, or a report was countersigned until the corresponding record exists.

## Document control

| Field | Entry |
|---|---|
| Project title | WHAMO Network Designer |
| Host organization | [Organization] |
| Institution / department | [Institution and department] |
| Project period | [Start date] to [End date] |
| Report version and date | [Version and date] |
| Intern team | [Names and IDs] |
| Project supervisor | [Name and role] |
| Committee / reviewer | [Committee name] |
| Repository / source archive | [Approved URL or archive reference] |
| Release / source revision | [Tag, commit, or archive checksum] |

## Approval and countersignature

By signing, each reviewer confirms that they reviewed the report and the deliverables identified in it. Record any conditions or required corrections.

| Role | Name | Decision / conditions | Signature | Date |
|---|---|---|---|---|
| Intern representative | [Name] | [Submitted / corrected] | [Sign here] | [Date] |
| Project supervisor | [Name] | [Reviewed / conditions] | [Sign here] | [Date] |
| Host-organization committee chair | [Name] | [Accepted / returned / conditions] | [Countersign here] | [Date] |
| Additional authorized reviewer | [Name / role] | [Decision / conditions] | [Countersign here] | [Date] |

## Revision history

| Version | Date | Author(s) | Change summary | Reviewer |
|---|---|---|---|---|
| [Version] | [Date] | [Name] | [Summary] | [Name / pending] |

## Executive summary

Describe the engineering or workflow problem, the product delivered, the work performed, the evidence collected, and the remaining limitations. Keep conclusions tied to observed results.

[Summary]

## 1. Introduction

### 1.1 Background

WHAMO Network Designer is a visual web application for constructing hydraulic networks, configuring their properties, preparing WHAMO input files, and viewing simulation output. Replace this summary with the project's approved context and cite the supporting requirements or references.

### 1.2 Problem statement

[Describe the user or organizational problem, existing process, and why the project was undertaken.]

### 1.3 Objectives

1. [Objective]
2. [Objective]
3. [Objective]

### 1.4 Scope

**Included:** [List implemented and verified capabilities.]

**Excluded:** [List unsupported, deferred, or out-of-scope work.]

### 1.5 Intended users and operating context

[Describe intended users, access roles, supported environment, and assumptions. Do not include credentials.]

## 2. Requirements and traceability

| ID | Requirement / acceptance criterion | Implementation area | Verification method | Result and evidence | Reviewer decision |
|---|---|---|---|---|---|
| R-01 | [Requirement] | [Feature / module] | [Test / inspection] | [Observed result and evidence] | [Pending / accepted / changes required] |
| R-02 | [Requirement] | [Feature / module] | [Test / inspection] | [Observed result and evidence] | [Decision] |
| R-03 | [Requirement] | [Feature / module] | [Test / inspection] | [Observed result and evidence] | [Decision] |

## 3. Product and user workflow

Describe the delivered application and link its operation instructions to [Reports/USER_MANUAL.md](USER_MANUAL.md).

### 3.1 Main workflow

Document the verified user flow from project creation or import through network editing, validation, input generation, WHAMO execution where available, and output review.

[Workflow description and figures]

### 3.2 Network and data model

Describe the supported node and link types, connections, units, schedules, turbine characteristics, and persistence behavior as verified in the final release.

[Description]

### 3.3 Input and output files

Describe the `.INP` generation/import workflow, `.OUT` handling, output requests, file-editing behavior, and compatibility constraints. Include example files only if approved for disclosure.

[Description]

## 4. Design and implementation

### 4.1 Architecture

The current root application uses a React/TypeScript client with Vite, a React Flow network canvas, Zustand client state, and a Node.js/Express server. Confirm the exact persistence, authentication, deployment, and WHAMO-engine configuration against the release being submitted; environment configuration may differ from development.

Include an architecture diagram and explain the main data paths:

- User input → network state → validation.
- Network state and settings → WHAMO `.INP` generation.
- Simulation execution or external WHAMO run → `.OUT` file.
- `.OUT` parsing → profile/history visualization and raw data.

### 4.2 Module summary

| Area | Responsibility | Files / evidence in release |
|---|---|---|
| Network designer | Canvas, elements, connections, and property editing | [References] |
| File handling | Project save/open and INP import/export | [References] |
| Simulation configuration | Computational parameters and manually added output requests | [References] |
| Visualization | Profile/history graphs and raw simulation data | [References] |
| Authentication / administration | Role-based access and administration, if in scope | [References and verification] |

### 4.3 Engineering calculations and assumptions

Document formulas, units, source data, rounding, valid ranges, and engineering assumptions for every derived value included in the submitted release. Do not present a software approximation as manufacturer data or as a validated engineering result.

For turbine characteristics, explain whether each submitted TCHAR table was entered manually or generated from the built-in curve library. Record the selected curve group and design inputs, and attach the resulting table and a review of its suitability. See [TURBINE.MD](../TURBINE.MD) for the current turbine guide.

[Calculation details, references, and reviewer approval]

### 4.4 Security, privacy, and operational considerations

[Describe user roles, protected data, secret handling, backup/recovery, logging, and any unresolved risks. Do not place secrets or personal data in this report.]

## 5. Testing and verification

### 5.1 Test environment

| Item | Release-tested value |
|---|---|
| Application revision | [Commit/tag/archive checksum] |
| Browser and version | [Details] |
| Operating system | [Details] |
| WHAMO version / execution environment | [Details or not tested] |
| Database / storage configuration | [Details; do not include credentials] |
| Test date and tester | [Date and name] |

### 5.2 Test results

| Test ID | Scenario | Expected result | Actual result | Evidence | Status |
|---|---|---|---|---|---|
| T-01 | [Scenario] | [Expected] | [Observed] | [Log / screenshot / file] | [Pass / fail / not run] |
| T-02 | [Scenario] | [Expected] | [Observed] | [Evidence] | [Status] |
| T-03 | [Scenario] | [Expected] | [Observed] | [Evidence] | [Status] |

Include tests for relevant paths such as login and role permissions, project save/open, network validation, INP import/generation, output-request handling, Excel round-trip, visualization unit toggles, and WHAMO execution. Mark a test “not run” if the required executable, account, data, or environment was unavailable.

### 5.3 Defects and unresolved findings

| ID | Finding | Impact | Workaround / correction | Owner | Status |
|---|---|---|---|---|---|
| [ID] | [Finding] | [Impact] | [Action] | [Owner] | [Open / resolved] |

## 6. Results and discussion

Report measured or observed results with references to evidence. Separate verified results from expectations. Explain any deviations from requirements and the reason for them.

[Results, interpretation, and limitations]

## 7. Source code and handover

The source code is delivered in the project repository or archive identified in Document Control. Record the exact revision so the submitted product can be reproduced.

| Handover item | Reference / location | Verified by | Status |
|---|---|---|---|
| Source code and revision | [Repository / archive / checksum] | [Name] | [Pending / verified] |
| User manual | [Reports/USER_MANUAL.md or approved final copy] | [Name] | [Status] |
| Monthly progress reports | [Report range / archive] | [Name] | [Status] |
| Open-source acknowledgements and notices | [Reports/Open_Source_Acknowledgements.md plus packaged notices] | [Name] | [Status] |
| Intern declarations | [Secure approved location; do not publish personal data in a public repository] | [Name] | [Status] |
| Test evidence | [Archive / location] | [Name] | [Status] |
| Deployment / operation notes | [Approved handover reference] | [Name] | [Status] |

## 8. Limitations and recommendations

List known technical limitations, assumptions, unverified behavior, required operational safeguards, and recommended next steps.

| Limitation / recommendation | Risk or benefit | Proposed action | Priority / owner |
|---|---|---|---|
| [Item] | [Impact] | [Action] | [Priority / owner] |

## 9. Conclusion

Summarize which objectives were met, which remain open, what evidence supports the conclusion, and what the committee is being asked to accept.

[Conclusion]

## References

List manuals, standards, requirements, research, data sources, vendor specifications, and software project references used in this report. Include version, date, publisher, and URL or document identifier where available.

1. [Reference]
2. [Reference]

## Appendices

- Appendix A — Requirements and acceptance evidence.
- Appendix B — Test logs and approved screenshots.
- Appendix C — Sample input/output files with disclosure approval.
- Appendix D — Open-source acknowledgements and required notices.
- Appendix E — Monthly reports and committee decisions.

