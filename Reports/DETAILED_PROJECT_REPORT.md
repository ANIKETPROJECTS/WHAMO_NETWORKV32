# Detailed Project Report

## WHAMO Network Designer

**Prepared for:** [Ministry / Department / Institution]
**Prepared by:** [Project team members]
**Team leader:** ANIKET SANJAY RANE
**Institution / department:** [Name]
**Host organization:** [Name, if applicable]
**Project period:** 01 February 2026 to 30 July 2026
**Report version:** Draft for review and countersignature

> This report describes the current project source and the WHAMO output samples supplied by the team. Complete the project-specific fields and attach the approved evidence before signature.

---

## Contents

1. Executive Summary
2. Background and Problem Statement
3. Objectives, Scope, and Users
4. Earlier Command-Line Workflow and Current Application Workflow
5. System Design and Implementation
6. Functional Capabilities
7. Engineering Calculations and Model Assumptions
8. Verification and Test Evidence
9. Limitations, Handover, and Conclusion
10. References and Evidence Register
11. Team Declaration and Countersignature

---

## 1. Executive Summary

WHAMO Network Designer makes the WHAMO workflow easier to see and use. Instead of working only with input text, users can build a network on a visual screen, edit its properties through forms, and review results in graphs and tables.

The team previously prepared WHAMO input files and ran the executable from the Windows Command Prompt. The new application adds a simpler visual interface, a 3D network view, profile and history graphs, unit switching, tables, and file tools. It can also send a generated input file to a configured server-side WHAMO executable, when that execution environment is available.

This report explains what the application adds, how it is used, and what the available test files show. The supplied GENERATE and OFF output files show no input errors and a normal end marker. The REJECT file reports 3,594 computational warnings, and the supplied STARTUP file does not show a normal end marker. Those two findings still need review.

The report is a draft for project review. The team must complete document-control fields, attach the final test evidence and source revision, resolve or disposition the findings in Section 8, and obtain the required signatures before presenting it as an accepted final report.

## 2. Background and Problem Statement

### 2.1 Project context

WHAMO simulations require a network description, element and connection properties, operating schedules, computational parameters, and selected output requests. In the team's earlier workflow, these inputs were prepared as text and the executable was run from Command Prompt. Users then reviewed the generated output file.

That workflow remains useful when a user needs direct control over a WHAMO input file or must run a specific local executable. However, manual text preparation can make it harder to see the network topology while editing, track units across fields, or detect inconsistent identifiers before a run.

### 2.2 Problem statement

The project addresses the need for a visual interface that helps users:

- construct and inspect a hydraulic network graphically;
- edit element and connection properties through forms;
- prepare WHAMO input files with fewer manual text-editing steps;
- configure computational parameters and explicitly selected history outputs;
- inspect simulation summaries and time histories; and
- continue to use the WHAMO executable and its output files as part of the engineering workflow.

The application assists with model preparation and result review. It does not replace the user's responsibility to verify the physical model, input data, WHAMO syntax, simulation warnings, and engineering conclusions.

## 3. Objectives, Scope, and Users

### 3.1 Objectives

1. Provide a visual canvas for creating and editing hydraulic network models.
2. Provide property forms for supported network elements and connections.
3. Support project saving/opening and WHAMO `.INP` import and generation.
4. Allow users to configure simulation stages and manually add output requests.
5. Support review of `.OUT` data through profile/history visualizations and tables.
6. Preserve a workflow in which WHAMO can be run locally or through a configured server-side execution route.

### 3.2 Included scope

The current project source and user guide describe:

- a sign-in screen, user roles, and section-level access controls;
- a network canvas with supported hydraulic elements and connections;
- SI/FPS unit controls and property editing;
- conduit and surge-tank geometry options;
- turbine operation settings, schedules, and characteristic data;
- computational stages and HISTORY output requests;
- `.INP` and `.OUT` workflow support;
- profile and history result views, raw data, and spreadsheet exchange.

### 3.3 Exclusions and assumptions

- The report does not assert that the model or simulation is independently certified.
- The report does not claim Ministry approval or acceptance.
- The report does not establish that a particular WHAMO executable version supports every generated keyword or mode.
- The actual production database, deployment configuration, engine availability, and access policy must be confirmed against the submitted release.
- Engineering values, turbine data, and acceptance criteria must be supplied or approved by the responsible project engineer.

### 3.4 Intended users

The application distinguishes **Master Admin** and **Normal User** roles. Master Admin users can manage user accounts and section access. Normal User access depends on the permissions assigned to that account. Actual user names, project access, and deployed authorization behavior should be recorded in the release handover, not embedded as credentials in this report.

## 4. Earlier Command-Line Workflow and Current Application Workflow

### 4.1 Earlier command-line workflow

As described by the project team, the earlier process used WHAMO from Windows Command Prompt:

1. Prepare or edit a WHAMO `.INP` text file.
2. Open Command Prompt in the WHAMO working folder.
3. Run the approved WHAMO executable and provide the input/output file names as required by that executable.
4. Review the `.OUT` file and any warnings or errors.
5. Revise the input and repeat the run when necessary.

The exact executable version, command syntax, working directory, and input/output prompts vary with the installation. Record these details from the team's actual test computer and WHAMO documentation before the report is signed.

### 4.2 Current application workflow

The current web application adds a visual workflow:

1. Sign in and create a new network or open an existing project.
2. Add supported elements and connect them on the canvas.
3. Enter properties, confirm units, and review the network.
4. Open the `.INP` or `.OUT` generation panel, review computational parameters, and add HISTORY requests manually.
5. Generate and review the `.INP` file.
6. Run the input with the approved WHAMO executable, either through the configured application server or through the team's local Command Prompt workflow.
7. Load the resulting `.OUT` data and review the profile/history graph and raw data.

The server source includes an authenticated execution endpoint that expects a WHAMO executable on the server and launches it through Wine. This describes the code path only; it does not prove the endpoint is available or compatible in every deployment. If server-side execution is unavailable, the generated `.INP` can be run in the approved local WHAMO environment and the resulting `.OUT` can be reviewed separately.

Editing text in the generated `.INP` preview does not update the network model. To make those edits part of the application model, save the edited input file and import it again.

### 4.3 Workflow comparison

| Activity | Earlier local workflow | Current application workflow |
|---|---|---|
| Define network | Create/edit model text | Place and connect elements on a visual canvas |
| Set properties | Edit input records manually | Use element and connection property panels |
| Prepare input | Save a `.INP` file from text editing | Generate a `.INP` from the current network state |
| Run WHAMO | Launch the local executable from Command Prompt | Use the configured server route when available, or continue with the local executable |
| Review results | Inspect output files and logs | Load `.OUT` data into graph, summary, and history views |
| Change a model after input editing | Edit the source file and rerun | Import the edited `.INP` if the network model must reflect those edits |

## 5. System Design and Implementation

### 5.1 High-level architecture

The current source is organized as a browser-based application with:

- a React and TypeScript user interface;
- a React Flow canvas for network nodes and connections;
- a Node.js/Express server for application routes and WHAMO execution handling;
- MongoDB/Mongoose-backed user and project-related data paths; and
- Vite-based development/build tooling.

The project also contains a separately runnable visualization viewer artifact. The Designer and the standalone viewer should be verified independently; a working viewer does not establish that Designer sign-in, database connectivity, or project saving works.

Confirm the exact database, authentication configuration, runtime, deployment revision, and WHAMO execution environment used for the final handover. Do not place passwords, tokens, or database connection strings in this report.

### 5.2 Main data flow

```text
User actions
    ↓
Network state and properties
    ↓
Validation and simulation configuration
    ↓
WHAMO .INP generation
    ↓
WHAMO execution (configured server route or local command-line run)
    ↓
.OUT results
    ↓
Profile/history visualization and raw data review
```

### 5.3 Project and file handling

Projects can be created, opened, saved, and saved as separate files. The application supports WHAMO input import/generation and result review. Spreadsheet exchange is supported for selected network data through the Flex Table/Excel workflow. The final archive should identify the exact source revision, user manual, approved test outputs, and any required dependency notices.

## 6. Functional Capabilities

### 6.1 Network design

The current Insert interface includes reservoirs, nodes, junctions, surge tanks, flow boundaries, and turbines. Network connections can be configured as conduits or dummy pipes where available.

### 6.2 What is new for users

- **Visual network editor:** users can see and arrange the network while building it instead of relying only on text input.
- **Simpler property panels:** common values are entered in labeled forms beside the selected item.
- **3D View:** users can inspect the network in a three-dimensional view. It is for visualization, not proof that the model is hydraulically correct.
- **Results Visualizer:** profile and history graphs make it easier to view results over the network and over time.
- **Raw data and unit controls:** users can review the values behind the graphs and switch SI/FPS display units.
- **Tables and Excel tools:** Flex Table and spreadsheet exchange support bulk review and editing.
- **Input-file tools:** users can generate and import WHAMO `.INP` files and review `.OUT` results.

### 6.3 Units, properties, and geometry

The Designer provides SI/FPS selection and displays units with property fields. Users should confirm unit labels before entering data and review converted values before generating an input file.

Conduits support circular and named non-circular profiles. The entered reference dimension is retained in the project while a circular equivalent diameter is written to the generated WHAMO input. Surge tanks retain a separate SHAPE elevation/area-pair mode; those SHAPE pairs are not replaced by the conduit diameter-profile conversion.

The current pipe-material selector offers Steel and Concrete. The configured Manning's `n` values are 0.011 for Steel and 0.013 for Concrete. Automatically filled material properties remain subject to project-specific review.

### 6.4 Turbine configuration

The current turbine operation choices are **GENERATE**, **OFF**, **REJECT**, and **STARTUP**. The property panel includes turbine identification and hydraulic/mechanical fields, schedule references, and turbine characteristic data.

- **TOFF** is displayed for the REJECT case.
- **VSCHEDULE** time/gate pairs are available for GENERATE, REJECT, and STARTUP.
- The optional TCHAR curve generator creates a characteristic table from its built-in curve library. Generated data are estimates and must be checked against the turbine's verified source data and the WHAMO version being used.

The application labels describe its current interface options. A successful parse or output file alone does not establish that a turbine configuration is suitable for a particular installation.

### 6.5 Computational parameters and output requests

The generation panel separates computational parameters from output configuration. A simulation may contain multiple time stages, each with **DTCOMP**, **DTOUT**, and **TMAX**. The panel also provides an optional ACCUTEST setting with FULL, PARTIAL, and NONE choices.

The only current request type is **HISTORY**. Adding an element to the network does not automatically add it to output requests. Users must explicitly select elements and variables, then review the current request list before generating the input.

### 6.6 Result review and spreadsheet tools

The visualization workflow provides Profile Graph and History Graph views. In the embedded viewer, the SI/FPS control applies to the graph and its associated raw data; History Graph also has a unit control. Users should check the chosen parameter, units, time range, and selected elements before interpreting a plotted result.

The raw summary/history data can be reviewed in tables. Flex Table and Excel exchange support bulk inspection or editing of selected network properties. Re-import and inspect edited data before using it in a simulation.

## 7. Engineering Calculations and Model Assumptions

### 7.1 Conduit equivalent diameter

For a circle:

```text
A_circle = 0.785 × D_eq²
```

For a named non-circular profile:

```text
A_shape = k × D²
D_eq = √(k / 0.785) × D
```

The current profile coefficients are:

| Profile | Coefficient k |
|---|---:|
| Circular | 0.785 |
| Horse Shoe | 0.829 |
| Modified Horse Shoe | 0.893 |
| D-Shaped | 0.813 |

The equivalent diameter is the value used as the circular conduit diameter in generated input. It is an area-equivalence calculation, not a full hydraulic equivalence for every possible tunnel profile.

### 7.2 Surge-tank geometry

The surge-tank editor retains the existing toggle between diameter mode and SHAPE mode. In diameter mode, the selected named profile can use the equivalent circular diameter calculation. In SHAPE mode, elevation/area pairs remain independent and are exported as SHAPE data. Users must not substitute one representation for the other without an approved model change.

### 7.3 Material properties

The material selector supplies Manning's `n` and Young's modulus values for the selected material. The currently configured `n` values are 0.011 for Steel and 0.013 for Concrete. These are software defaults; confirm all engineering properties against the approved project specification.

### 7.4 Turbine Q and efficiency matrix generation

The built-in TCHAR generator samples normalized head points from a selected curve group, scales head and flow using the entered design values, and computes efficiency from interpolated torque, head, and flow data:

```text
H_scaled = H_normalized × H_design / 100
Q_matrix = Q_interpolated × Q_design / 100
η_raw = [T_interpolated / (H_normalized × Q_interpolated)] × (η_design × 100)
η_matrix = min(0.98, max(0, η_raw))
```

The implementation uses zero efficiency when normalized head or interpolated flow is at or below 1, rounds head and flow to three decimal places and efficiency to four, and caps the stored efficiency value at 0.98. When a requested head is outside the available points for a gate, the implementation uses the nearest endpoint rather than extrapolating.

This describes the software algorithm, not manufacturer data or a validated turbine selection. Verify curve provenance, units, generated table values, and WHAMO interpretation before using the result for engineering decisions.

### 7.5 Computational time-step check

The in-app Help states the Courant condition as:

```text
celerity × DTCOMP / conduit length ≤ 1.0
```

Check the condition using consistent units and study-approved values. Generating an input file does not prove that the chosen time step is appropriate.

## 8. Verification and Test Evidence

### 8.1 Evidence basis

This section separates source inspection from WHAMO execution evidence. The mode-specific `.OUT` observations below are based on files supplied by the project team from its local WHAMO environment. They have not been rerun as part of this report in the current deployment.

### 8.2 Supplied turbine-mode output observations

| Scenario | Observation in supplied `.OUT` | Assessment |
|---|---|---|
| GENERATE | The output contains **NO INPUT ERRORS** and ends with **GOODBYE**. | Input was accepted and the output shows a normal end marker. Numerical results still require engineering review. |
| OFF | The output contains **NO INPUT ERRORS** and ends with **GOODBYE**. | Input was accepted and the output shows a normal end marker. Numerical results still require engineering review. |
| REJECT | The output contains **NO INPUT ERRORS**, then reports **3,594 computational warnings**, with the last warning at 200 seconds, and ends with **GOODBYE**. | Do not describe this run as a clean pass. Review the warning messages and model behavior with the responsible engineer. |
| STARTUP | The output contains **NO INPUT ERRORS**, but the supplied file does not show the **GOODBYE** end marker. | Completion is not established by this file. Re-run and retain the full output before accepting the case. |

The statements above concern the supplied files only. They do not establish numerical accuracy, physical validity, or acceptance by the WHAMO maintainer or project authority.

### 8.3 Application verification still required

Before countersigning, record the exact release and attach evidence for the following checks:

| Check | Evidence to retain | Status |
|---|---|---|
| Sign-in, role restrictions, and administrative access | Sanitized screenshots or test record for each relevant role | [Not recorded in this report] |
| Create/open/save a project | Test project and result record | [Not recorded in this report] |
| Generate and re-import `.INP` | Original and generated input files, plus comparison notes | [Not recorded in this report] |
| Manually add HISTORY requests | Screenshot or generated input excerpt showing selected requests | [Not recorded in this report] |
| Unit toggles and shape calculations | Input values, displayed calculations, and generated-file excerpt | [Not recorded in this report] |
| `.OUT` generation or local execution | Full WHAMO output and exact executable/version information | [Partially supplied; see Section 8.2] |
| Profile/history visualization | Sanitized screenshot and corresponding `.OUT` file | [Not recorded in this report] |
| Flex Table/Excel exchange | Sample workbook and round-trip result | [Not recorded in this report] |

### 8.4 Reproducibility record

Complete this record from the final test environment:

| Item | Record |
|---|---|
| Application release / source revision | [Tag, commit, or archive checksum] |
| Test date and tester | [Date and name] |
| Browser and operating system | [Details] |
| WHAMO executable version and location | [Exact version and approved environment] |
| Application server execution tested | [Yes / No; record result] |
| Test network/input file | [Approved evidence reference] |
| Output files and diagnostics | [Evidence archive reference] |

## 9. Limitations, Handover, and Conclusion

### 9.1 Limitations and risks

- The application helps prepare and inspect models; it does not replace independent engineering review.
- Equivalent diameter matches area using the configured coefficient. It does not represent every hydraulic effect of a non-circular profile.
- Built-in turbine-curve estimates must be checked against verified manufacturer/project data.
- Operation labels and generated syntax must be checked against the exact WHAMO version used.
- The supplied REJECT output contains a high computational-warning count, and the supplied STARTUP output lacks a normal end marker. These are open verification findings.
- Server-side execution depends on the approved executable being available and compatible with the server runtime. Confirm licensing and distribution rights before packaging or deploying the executable.
- The final deployed version, database, security settings, and user permissions must be verified in the actual handover environment.

### 9.2 Handover package

| Item | Handover reference |
|---|---|
| Application source code and exact revision | [Repository/archive/checksum] |
| User manual | `Reports/WHAMO_Network_Designer_User_Manual.docx` and source Markdown |
| Detailed project report | This report and its signed final copy |
| Approved `.INP` and `.OUT` test evidence | [Evidence archive] |
| Monthly progress reports | [Report range/archive] |
| Open-source acknowledgements and notices | `Reports/Open_Source_Acknowledgements.md` plus required packaged notices |
| Team responsibility declarations | [Approved signed copies] |
| WHAMO executable/version and operating instructions | [Authorized reference; do not include unlicensed copies] |

### 9.3 Conclusion

The project provides a visual interface for preparing hydraulic network models, generating WHAMO input, and reviewing simulation output. It builds on the team's earlier command-line use of WHAMO while preserving the option to run an approved local executable when server-side execution is unavailable.

The source describes the current interface and calculation paths, but the available execution evidence is mixed: the GENERATE and OFF samples show no input errors and a normal end marker; the REJECT sample contains 3,594 computational warnings; and the STARTUP sample lacks a normal end marker. The team should attach complete, reviewed test evidence and record how the outstanding findings were resolved or accepted before the report is countersigned.

## 10. References and Evidence Register

1. WHAMO Network Designer current source and release: [record exact revision and archive/checksum].
2. WHAMO Network Designer User Manual: `Reports/USER_MANUAL.md` and approved final document.
3. WHAMO user documentation for the exact executable/version used: [insert title, publisher, edition/year, and approved reference].
4. Team-supplied WHAMO output files for GENERATE, OFF, REJECT, and STARTUP cases: [retain original files in the approved evidence archive].
5. Project requirements, test plans, and engineering data: [insert approved document identifiers].
6. Third-party components and notices: `Reports/Open_Source_Acknowledgements.md`; verify against the final packaged build.

## 11. Team Declaration and Countersignature

We declare that this report summarizes the work performed by the project team and that test observations are based on the evidence listed in it. Pending checks and warnings are shown honestly for review. Sources and third-party components used in the project are to be acknowledged in the accompanying records.

The team leader signs on behalf of the team. The authorized reviewer completes the countersignature after reviewing the report and evidence. Add the digital signature in the space at the right.

| Authorized reviewer countersignature | Team leader declaration |
|---|---|
| Name and role: [Enter here] | **ANIKET SANJAY RANE** |
| Signature: [Countersign here] | Team Leader |
| Date: [Enter here] | Digital signature: [Place signature here] |
|  | Date: [Enter here] |
