# WHAMO Network Designer
## User Manual

**Prepared for submission to:** Ministry of Jal Shakti, Government of India

**Software:** WHAMO Network Designer, version 1.0 (as displayed in the application)

**Manual revision:** 1.0

**Date:** 28 October 2026

**Prepared by:** [Project team / intern names]

**Institution / host organization:** [Enter institution or organization]

> **Document status:** Project user manual prepared for submission and technical review. It is not an official Ministry publication, an approval of the software, or an engineering design certification. Complete the author and organization fields and verify the deployed application version before final submission.

---

## Contents

1. [About this manual and the software](#1-about-this-manual-and-the-software)
2. [Access and account roles](#2-access-and-account-roles)
3. [Start, open, and save a project](#3-start-open-and-save-a-project)
4. [Designer screen and network workflow](#4-designer-screen-and-network-workflow)
5. [Network elements and their principal data](#5-network-elements-and-their-principal-data)
6. [Units, conduits, and shape calculations](#6-units-conduits-and-shape-calculations)
7. [Turbine setup](#7-turbine-setup)
8. [Simulation parameters and output requests](#8-simulation-parameters-and-output-requests)
9. [Generate, edit, and import WHAMO files](#9-generate-edit-and-import-whamo-files)
10. [Visualize simulation results](#10-visualize-simulation-results)
11. [Flex Table and Excel exchange](#11-flex-table-and-excel-exchange)
12. [Settings and user management](#12-settings-and-user-management)
13. [Validation, review, and troubleshooting](#13-validation-review-and-troubleshooting)
14. [Glossary](#14-glossary)

---

## 1. About this manual and the software

WHAMO Network Designer is a visual application for creating hydraulic network models, entering model properties and schedules, preparing WHAMO `.INP` input files, running the configured WHAMO engine where available, and viewing simulation `.OUT` results.

The application provides a graphical network canvas, property panels, unit selection, project saving and loading, tabular editing, file import/export, validation messages, and profile/history visualization. The available actions may depend on the signed-in user's role and section permissions.

### Intended audience

This guide is for users who have been issued an application account and need to create, review, exchange, or visualize WHAMO network models. It assumes that the user has access to the engineering data and WHAMO version approved for the study.

### Important engineering limitation

The Designer helps users prepare and inspect model files. Its validation checks are software checks; they do not establish that the network topology, measurements, material assumptions, boundary conditions, turbine characteristics, operating scenarios, or results are physically correct or safe. Use project-approved data, inspect generated files and WHAMO diagnostics, and obtain review by a qualified person before relying on results.

### Separate applications

The main WHAMO Designer includes an embedded visualization view. A separate WHAMO Visualization web application is also provided in this project. Both can read supported WHAMO `.OUT` content; the standalone viewer is useful when an output file is being reviewed independently of an open Designer network.

---

## 2. Access and account roles

### Sign in

1. Open the application address supplied by the project administrator.
2. Enter the email address and password assigned to your account.
3. Select **Sign In**.
4. After successful authentication, the Designer opens. If sign-in fails, confirm the account details with the administrator rather than repeatedly guessing passwords.

The login page may display a demonstration account for demonstration/testing. Do not use demonstration credentials for operational work or enter them into a report, screenshot, or shared project file.

### Roles and section permissions

The application distinguishes **Master Admin** and **Normal User** accounts. A Master Admin can manage user accounts and assign access to application sections. A Normal User can use the sections enabled for that account. If a required tool is missing, ask the administrator to confirm the account's permissions.

Do not share accounts. Sign out from the user menu when finished, especially on shared computers.

---

## 3. Start, open, and save a project

### Start a new project

1. On the start screen, choose **New Project**, or choose **New** in the title bar.
2. Enter a meaningful project name in the name field.
3. Add the network elements and connections required for the model.
4. Select **Save** to save the project to your account.

Use a name that identifies the study and revision without including confidential information.

### Open a saved project or local file

- Select **Open** to choose a saved project from the project list.
- To load a local project file, use **Open** and select a `.json` project file or a supported `.INP` file.
- To import an input file into the current Designer workflow, select **From .INP**, choose the file, review the parsed network summary, and confirm the import.

After loading, check the project name, network diagram, element properties, schedules, simulation settings, unit system, and output requests. An import should always be reviewed before editing or generating a new file.

### Save and create a separate copy

- **Save** updates the current project in your account. The first save creates the account copy.
- **Save As** downloads a separate project copy in JSON format. Keep this file as a local backup or revision copy.
- **Undo** and **Redo** reverse or restore recent edits. Save before substantial changes, bulk imports, or experiments.

Saving a project and generating an `.INP` are separate actions. Save the project after editing; generate the input file when you are ready to prepare a WHAMO run.

---

## 4. Designer screen and network workflow

### Main screen areas

| Area | Purpose |
|---|---|
| Title bar | Start/open/save projects, undo/redo, arrange the diagram, import `.INP`, open Help, set the project name, choose units, and access account controls. |
| Insert ribbon | Add supported network elements and choose the turbine connection tool. |
| Tools ribbon | Open the diagram view, node selection, Flex Table, visualization, or 3D view. |
| Generate ribbon | Start `.INP` export or `.OUT` generation. Each action opens validation and generation settings as applicable. |
| Network canvas | Display and connect the model. Diagram position is for readability and does not define hydraulic correctness by itself. |
| Properties panel | Edit the selected node or connection. Fields and units vary by element. |

### Add and select elements

1. Select an element in the **Insert** ribbon: **Reservoir**, **Node**, **Junction**, **Surge Tank**, **Flow BC**, or **Turbine**.
2. Select the new item on the canvas to open its properties.
3. Enter a unique, meaningful label and the required model values.
4. Save the project after completing the element.

Conduits are network connections between elements. Select or create a connection using the connection controls, then select the conduit to edit its properties. The **Turbine** ribbon has a split control for placing a turbine as an element or activating turbine-connection mode.

Existing files containing retired Pump or Check Valve data may still be recognized for compatibility. These are not offered as new elements in the current Insert ribbon. Review legacy elements in imported models before generating new files.

### Connect and arrange the network

1. Connect the intended upstream and downstream elements using their connection handles.
2. Check the direction arrow, labels, and endpoints on every connection.
3. Use **Arrange** to improve diagram layout when useful.
4. Confirm the actual hydraulic connectivity independently of the visual layout.

Use nodes and junctions to express network topology. A surge tank is a side-branch element and should connect to one appropriate node/junction; it should not be inserted inline as a through-flow conduit.

### Edit and commit properties

1. Select an element or conduit on the canvas.
2. Review the fields shown in the **Properties** panel and their displayed units.
3. Enter the approved values. Some panels hold changes locally until **Save** is selected.
4. Confirm the displayed values and save the project.

When a field is automatically filled from a selected material or calculated from another field, verify its source inputs. Where the interface marks a value as editable, confirm the engineering basis before overriding it.

---

## 5. Network elements and their principal data

The precise fields shown depend on the selected element and project configuration. Use approved study data; the descriptions below explain the role of the main categories, not the engineering method for selecting their values.

| Element | General role | Data to review |
|---|---|---|
| **Reservoir** | Boundary representing a reservoir/source condition. | Label and reservoir elevation; confirm the boundary value and its datum. |
| **Node** | Network point used to connect conduits and report hydraulic quantities. | Label/number, elevation and any other displayed hydraulic or reporting fields. |
| **Junction** | Connection/split point for branches in the model. | Label/number, connections, and any displayed junction values. |
| **Flow BC** | Flow boundary condition driven by a flow schedule. | Label, schedule number, and the schedule's time/flow pairs. |
| **Conduit** | Pipe or connection carrying the modeled transient flow. | Label, length, diameter/shape, celerity, friction, material values, and any other displayed properties. |
| **Surge Tank** | Side-branch storage element used in the transient network. | Top and bottom elevations, cross-section mode, diameter or SHAPE data, and displayed hydraulic properties. |
| **Turbine** | Turbine component with characteristic data and an operating mode. | TCHAR type, synchronous speed, inertia, diameter, friction, windage, operation mode, and applicable schedule fields. |

### Schedules

Schedules are time/value pairs referenced by an element. Check that each element points to the intended schedule number and that pair order, units, values, and time range match the study. Schedule definitions can be reviewed in the properties panel or supported table editors.

---

## 6. Units, conduits, and shape calculations

### SI and FPS units

The title-bar **Units** control switches the global Designer unit system between **SI** and **FPS**. A selected element can also display its own unit control. An element that is explicitly locked to a unit system may not follow the global switch until it is unlocked.

Before entering or importing values:

1. Select the intended unit system.
2. Check the unit labels beside the fields.
3. Do not copy a value from a different unit system without converting it.
4. After switching units, review critical values and units before saving or generating a file.

The visualization's SI/FPS control changes displayed result units; it does not rewrite the source `.OUT` file.

### Conduit diameter and shape-equivalent diameter

The conduit **Diameter Shape Type** selector defaults to **Circular**. The other named profiles are **Horse Shoe**, **Modified Horse Shoe**, and **D-Shaped**. For a non-circular profile, the entered diameter is treated as the shape's reference dimension, and the displayed equivalent diameter is calculated from cross-sectional area:

```text
A_shape = k × D²
A_circle = 0.785 × D_eq²
D_eq = √(k / 0.785) × D
```

The current coefficients are:

| Shape | Area coefficient k | Approximate D_eq / D |
|---|---:|---:|
| Circular | 0.785 | 1.000 |
| Horse Shoe | 0.829 | 1.028 |
| Modified Horse Shoe | 0.893 | 1.067 |
| D-Shaped | 0.813 | 1.018 |

The resulting `D_eq` is used as the conduit diameter in the generated `.INP`. The display shows the calculation and the resulting value. For example, a 10 m Horse Shoe reference diameter gives `D_eq ≈ 10.28 m`.

This is an area-equivalence conversion to a circular diameter for WHAMO input. It does not mean the application has performed a full non-circular hydraulic analysis. Confirm that this approximation is suitable for the study.

### Pipe material

The current material selector offers **Steel** and **Concrete**. Selecting a material can automatically fill Manning's `n` and Young's modulus `E`; values remain subject to engineering review. The currently configured Steel Manning's `n` is **0.011**. Use the expandable material-properties display to inspect the selected material's listed values. The **Apply to all conduits in network** option applies the selected material across the network; use it only when that is intended.

### Surge tank cross-section

The surge tank keeps a separate **Enable SHAPE** toggle:

- **SHAPE disabled:** enter a diameter. The **Diameter Shape Type** selector can apply the same named-shape area-equivalent diameter calculation described above; the displayed equivalent diameter is the diameter used in the `.INP`.
- **SHAPE enabled:** provide SHAPE table pairs. Select a standard shape to calculate its area from `A = k × D²` for each entered `D` value. For **Custom**, provide the applicable `E` and `A` values directly.

Here, `E` identifies the elevation for a shape pair, `D` is the shape dimension used by the selected standard profile, and `A` is the corresponding cross-sectional area. Use consistent units and elevation references for every pair. The program may calculate a perimeter for named profiles, but the SHAPE pairs and geometry should still be reviewed against the project's source data.

---

## 7. Turbine setup

Select a turbine to open its **Properties** panel. Turbine behavior depends on the selected characteristic set and operation data; use project-approved manufacturer or study inputs.

### Turbine characteristics (TCHAR)

Each turbine references a **TCHAR Type**. The characteristic data describe turbine response across specified heads and gate openings. The software supports editing the characteristic tables and, where available, using a built-in curve generator. The generated curve is only an aid; it is not a substitute for verified manufacturer data.

The characteristic data include flow (`Q`) and efficiency values associated with the characteristic points. Confirm the table dimensions, head/gate alignment, units, and source before using it in a study. Do not assume an automatically generated efficiency or flow value is manufacturer-approved.

### Operation modes

The current operation-mode choices in the Designer are:

| Mode | User-level description |
|---|---|
| **GENERATE** | Represents the generating operating case. A V-schedule can define gate opening over time. |
| **OFF** | Represents the turbine-off case. |
| **REJECT** | Represents a load-rejection case. The panel exposes **TOFF** and a V-schedule. |
| **STARTUP** | Represents a startup case. A V-schedule can define gate opening over time. |

These are the mode labels exposed by this software; they are not a substitute for checking the syntax and interpretation supported by the WHAMO executable/version used for the analysis. Check WHAMO run diagnostics and the relevant WHAMO documentation before relying on a mode in a formal study.

### Turbine fields and schedules

- **TCHAR Type:** selects the turbine characteristic dataset.
- **Synchronous Speed (SYNCSPD):** turbine/generator synchronous rotational speed, in RPM.
- **WR²:** turbine-generator moment of inertia input as represented by the application.
- **Diameter, Friction, Windage:** turbine parameters used by the generated input.
- **TOFF:** rejection-time field shown for **REJECT** mode; enter a study-approved value in seconds.
- **VSCHEDULE:** time (`T`) and gate opening (`G`) pairs used for **GENERATE**, **REJECT**, and **STARTUP** modes. The schedule number on the turbine identifies which schedule is used.

For imported files containing a retired/legacy operation mode, the application preserves legacy data for compatibility and marks it as legacy. Choose a current mode to replace it only after confirming the intended WHAMO case.

---

## 8. Simulation parameters and output requests

Selecting **Generate → .INP** or **Generate → .OUT** first runs network validation. When the validation step allows continuation, the **Configure Output Requests** sidebar opens. It separates **Computational Parameters** from **Output Configuration**.

### Computational parameters

Review each time stage:

| Field | Meaning in the interface |
|---|---|
| **DTCOMP** | Computation time step. |
| **DTOUT** | Interval between recorded output times. |
| **TMAX** | Simulation end time for that stage. |

Use **Add Stage** to add a time stage. At least one stage is retained. The panel also contains the **ACCUTEST** accuracy-check setting. If included in the `.INP`, select the mode required by the study and WHAMO version. These settings should come from the approved analysis plan; the software does not choose engineering-appropriate values on the user's behalf.

### Output configuration

Only **HISTORY** is shown as the request type. Network elements are **not** automatically added to the output request list when they are inserted. Requests are created only after a user explicitly adds them in the output panel.

To add one request:

1. Choose a category under **Select Type** if you want to filter/group available items.
2. Choose the specific item under **Select Element**.
3. Select the variables to record. Turbine selections offer `Q`, `HEAD`, `SPEED`, and `POWER`; other selections may offer `Q`, `HEAD`, `ELEV`, `VEL`, `PRESS`, and `PIEZHEAD`.
4. Select **Add Request**.
5. Confirm that the item and variables appear under **Current Requests — HISTORY**.

To add requests for a group, choose a category, select the relevant variables, and use **Add All for ...**. **Select All** is a separate explicit action that fills requests for the available network items; inspect the resulting list and remove any request that is not needed. **Clear All** removes all current requests. These controls do not add requests silently when a network element is created.

---

## 9. Generate, edit, and import WHAMO files

### Generate an `.INP`

1. Enter a specific project name.
2. Select **Generate → .INP**.
3. Review the validation messages. Correct errors and inspect warnings; do not bypass a message without understanding it.
4. In **Configure Output Requests**, review Computational Parameters and Output Configuration separately.
5. Confirm the History request list, then continue to generate the file.
6. Inspect the `.INP` preview. Save/download a copy and preserve it with the project revision.

Generated `.INP` text is an input file for WHAMO. File generation by itself does not run the simulation.

### Edit a generated `.INP`

The application displays a warning before opening the text editor: editing the `.INP` changes the text file only. It does **not** update the values in the network currently open in the Designer.

If the edited file should become the network used for a run:

1. Save/download the edited `.INP`.
2. Import it using **From .INP**.
3. Review the parsed network, schedules, parameters, and requests.
4. Save the imported project as a separate revision if appropriate.
5. Generate or run the desired output from that imported network.

Keep the original input file. Manually edited text must remain valid for the WHAMO version in use.

### Generate an `.OUT`

1. Select **Generate → .OUT**.
2. Review validation messages and resolve problems before proceeding.
3. Check the generation sidebar settings and History requests.
4. Continue to run the configured WHAMO engine.
5. Review the returned output and engine diagnostics before interpreting results.

The `.OUT` operation depends on a WHAMO engine being configured and available to the application. If it is unavailable or the run fails, use the approved WHAMO installation to run the reviewed `.INP`, then load the resulting `.OUT` into the visualization tool.

---

## 10. Visualize simulation results

### Open the visualization view

- In the Designer, select **Tools → Visualization**. When a network is open, the application attempts to run a simulation and open its output. If no network is open, the visualization view can be used to load an `.OUT` file.
- In the standalone WHAMO Visualization application, select **Add .OUT File** and choose the output file.

The viewer reads supported summary and history sections from the `.OUT`. If the file has no readable summary data, the viewer displays an error instead of a graph.

### Profile Graph

The **Profile Graph** shows summary/profile data across nodes, including maximum and minimum energy elevation and, where applicable, the animated current hydraulic grade line. Use the playback controls to view the animation, the slider to move through time, and the speed controls to adjust playback. Use **Expand** or **Fullscreen** where shown for a larger chart. The optional pipe display and labels can be toggled where available.

Expand **Raw Simulation Summary Data** to inspect values in tabular form. The SI/FPS control in this view applies to the profile chart and its raw summary table together. Verify the displayed axis units before comparing values.

### History Graph

The **History Graph** is available when the loaded `.OUT` contains history data. Select one or more nodes, choose the recorded parameter, and use playback controls to review time-dependent behavior. Expand **Raw Time History Data** to inspect the selected series in a table; large tables may be paginated. The SI/FPS control applies to the history graph and its associated displayed values.

In the Designer's embedded visualization, the SI/FPS control is shared by the Profile Graph and History Graph. In the standalone viewer, verify the unit labels and controls shown in that viewer; its interface may not match the embedded view in every detail. Display-unit controls change presentation only; they do not alter the source `.OUT` file or recalculate the simulation. Note the source file, WHAMO version, and displayed unit system in any report based on the visualization.

---

## 11. Flex Table and Excel exchange

### Flex Table

1. Select **Tools → Flex Table**.
2. Choose an element-type tab or the all-elements view.
3. Review the row labels, field names, and units before editing.
4. Edit supported cells and commit the edits as shown in the table.
5. Select a row when you need to locate the corresponding element on the canvas.
6. Save the project and verify that the canvas properties and table agree.

Some columns are read-only or apply only to specific element types.

### Export or import Excel workbooks

1. In Flex Table, choose the required element-type tab or all-elements view.
2. Select the Excel export action and save the `.xlsx` workbook.
3. Preserve the workbook's column headings and expected value formats.
4. Edit only the intended cells. Keep an untouched copy as a backup.
5. Import the workbook into the corresponding table view.
6. Review the import summary, skipped rows, and matched elements.
7. Inspect the affected elements in the Designer and save the project.

Excel import updates matching existing elements; it is not a way to create new network elements. Labels/identifiers are used to match rows, so changing them can prevent a row from matching the intended element.

---

## 12. Settings and user management

### Personal settings

Open the user menu and choose **Settings** to access the available profile, security, autosave, and projects settings. Use the security page to change your own password. Follow the application's password requirements and do not include credentials in project documentation.

Autosave settings control automatic account backups for a named project. Autosave is not a replacement for using **Save**, and it does not replace local `.json` backups or generated `.INP`/`.OUT` files.

### User management (Master Admin only)

1. Open the user menu and select **User Management**.
2. Select **Add User** to create an account, or the edit control to update a user.
3. Assign the role and the section access required for that user's duties.
4. Save the change and verify the displayed account and permissions.
5. Delete an account only when authorized and after considering whether access or project ownership is affected.

Master Admin accounts have full access. Assign only the minimum sections needed for a user's work. Normal users cannot open the User Management panel.

---

## 13. Validation, review, and troubleshooting

### Pre-run review checklist

- [ ] Project name and revision identify the intended study.
- [ ] Network connectivity and flow direction match the approved schematic.
- [ ] Element labels and node numbers are unique and valid.
- [ ] Every required field has a value in the displayed unit system.
- [ ] Boundary elevations and schedules match the approved source data.
- [ ] Conduit materials, shape assumptions, diameter, celerity, and friction have been reviewed.
- [ ] Surge tank connection and cross-section data have been reviewed.
- [ ] Turbine characteristics, operation mode, TOFF where applicable, and gate schedule have been verified.
- [ ] DTCOMP, DTOUT, TMAX, and ACCUTEST settings match the analysis plan.
- [ ] Output requests have been explicitly reviewed under Current Requests — HISTORY.
- [ ] Validation errors are resolved and warnings are understood.
- [ ] The generated `.INP`, WHAMO diagnostics, and `.OUT` are saved and checked.
- [ ] Results are reviewed by a qualified person before they are used in engineering decisions.

### Troubleshooting

| Symptom | Checks and recommended action |
|---|---|
| Cannot sign in | Check the account email and password, network connection, and whether the account is active. Ask the administrator for help; do not share credentials. |
| A section or button is missing | Confirm the account's role and section permissions with a Master Admin. |
| A project does not appear in Open | Confirm that it was saved to the account, that the correct user is signed in, and that the project list has refreshed. Check local backups as well. |
| A local project file will not load | Confirm the file is a valid `.json` project or supported `.INP`; keep an untouched copy and note the first displayed error. |
| A network connection is not created | Check that the correct connection tool/handles are being used and that the intended endpoints are selected. Confirm the arrow direction. |
| Validation blocks generation | Read each message, correct the indicated data/topology problem, then run validation again. Do not treat a successful bypass as proof of correctness. |
| `.INP` does not match the open canvas after editing | This is expected. The text edit does not change the canvas; download the edited file and import it back into the Designer. |
| `.OUT` generation fails | Confirm the `.INP` passes review, check the configured WHAMO engine and server availability, and retain the first error message. If needed, run the input with the approved local WHAMO installation. |
| `.OUT` opens but a graph is missing | Confirm the output contains the relevant summary/history section. History Graph is only available when history data are detected. |
| Excel rows are skipped | Preserve the exported headers, match identifiers to existing elements, and review the import summary for row-level reasons. |

When reporting a problem, record the date/time, application version, action immediately before the problem, full error text, and a minimal example file with confidential or personal information removed.

---

## 14. Glossary

| Term | Meaning in this manual |
|---|---|
| **ACCUTEST** | Accuracy-check setting that may be included in the generated input. |
| **DTCOMP** | Computation time step entered for a simulation stage. |
| **DTOUT** | Time interval for recording output. |
| **TMAX** | Simulation end time for a stage. |
| **HISTORY request** | A request to record selected variables for an element over the simulation history. |
| **INP** | WHAMO input file containing model and run configuration data. |
| **OUT** | WHAMO simulation output file used for reviewing results. |
| **SI** | International System of Units. |
| **FPS** | Foot-pound-second / customary English unit system as labeled in the application. |
| **TCHAR** | Turbine characteristic dataset selected by a turbine. |
| **TOFF** | Turbine load-rejection time field displayed for REJECT mode. |
| **VSCHEDULE** | Turbine time/gate-opening schedule referenced by the turbine operation settings. |
| **WR²** | Moment-of-inertia input displayed for the turbine-generator assembly. |
| **D_eq** | Circular equivalent diameter calculated from an entered non-circular shape reference dimension by matching cross-sectional area. |

---

## Before final submission

This manual is written from the current project interface and source. Before submitting it:

1. Replace the author and organization fields on the cover.
2. Confirm that the deployed application still displays version 1.0 and that the described controls match the deployed build.
3. Add screenshots captured from the final authenticated application if required by the reviewer. Use sanitized example data and hide account details.
4. Confirm turbine mode behavior and all generated file syntax against the specific WHAMO executable/version used for the project.
5. Proofread the final Word/PDF copy and attach the project's reviewed source code, test evidence, and required signed declarations separately.

This guide does not claim that the software, model, or simulation has been independently certified or accepted by the Ministry of Jal Shakti.
