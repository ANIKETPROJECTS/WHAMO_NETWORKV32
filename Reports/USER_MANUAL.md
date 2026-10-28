# WHAMO Network Designer — User Manual

## 1. Purpose and important limits

WHAMO Network Designer is a visual editor for building hydraulic networks, configuring element data and simulation settings, preparing WHAMO `.INP` files, and viewing `.OUT` simulation results.

Use engineering data and operating scenarios approved for the project. File generation and software validation do not establish that a network is physically correct, that data are suitable, or that simulation results are safe to use. Review the generated input and the WHAMO diagnostics/results with a qualified reviewer.

This manual describes the main user workflow. The turbine-specific operation modes, fields, schedules, and characteristic data are documented in the project-root file [TURBINE.MD](../TURBINE.MD).

## 2. Sign in and open the Designer

1. Open the application URL provided by the host organization.
2. Sign in with an account issued for your role.
3. Do not share account credentials or include them in reports, screenshots, or project files.
4. The Designer opens with the project canvas, toolbar, and properties area. Available actions may depend on your account permissions.

## 3. Create, open, and save a project

### Create a project

1. Select **New** in the title bar.
2. Enter a project name.
3. Add network elements and connect them on the canvas.
4. Use **Save As** to create the first saved project.

### Open a saved project

1. Select **Open**.
2. Choose the project from the available project list.
3. Confirm the canvas, properties, schedules, simulation settings, and requests have loaded as expected.

### Save changes

- Use **Save** to update the current project.
- Use **Save As** to create a separate copy or revision.
- Use **Undo** and **Redo** to review recent changes. Save a separate copy before large edits or imports.

## 4. Build and edit the network

### Add elements

Use the **Insert** toolbar to add supported network elements, such as **Reservoir**, **Node**, **Junction**, **Surge Tank**, **Flow BC**, **Conduit**, and **Turbine**. Select an element on the canvas to open its properties.

### Connect elements

1. Activate the appropriate link tool when needed.
2. Drag from the connection handle on the upstream element to the intended downstream element.
3. Check the displayed direction and labels. Use distinct, valid identifiers for elements.
4. Arrange the diagram for readability; layout is visual and does not replace hydraulic connectivity review.

### Edit properties and units

1. Select a node, link, or boundary element.
2. Review all required fields and their displayed units.
3. Set the project's SI or FPS unit system where available; do not mix values from different unit systems.
4. Save the project after confirming the values.

Conduits include geometry and hydraulic fields. Material selection can fill supported material properties. Shape selection may display an equivalent-diameter calculation used for WHAMO input; review the displayed calculation and the project's engineering basis.

Surge tanks have their own cross-section/shape controls and data. Do not assume conduit shape settings apply to a surge tank.

### Turbine characteristics

Each turbine references a TCHAR type. The characteristic data include gate openings, heads, a flow (Q) matrix, and an efficiency matrix. You can enter the matrices directly or use the built-in curve generator where available. Generated curve data depend on the chosen library curve and design inputs; they are not a substitute for project-approved manufacturer data.

Review [TURBINE.MD](../TURBINE.MD) for current turbine operation options, gate schedules, TOFF, TCHAR structure, and the relevant manual reference.

## 5. Use the Flex Table and Excel

### Flex Table

1. Open **Tools → Flex Table**.
2. Select an element-type tab or **All**.
3. Edit the supported fields and check the units.
4. Select a row to locate its element on the canvas, then verify both views agree.

### Excel export and import

1. Export the selected table or all element sheets to an `.xlsx` workbook.
2. Keep the provided column headings and validation values intact.
3. Edit only intended cells; do not change element labels unless you intend to change the matching identifier.
4. Import the workbook into the matching table view.
5. Review the import summary. Excel import updates matching existing elements; it does not create new network elements.
6. Inspect the edited elements on the canvas and save the project.

Keep an untouched backup of the workbook and project before importing bulk edits.

## 6. Configure simulation and output requests

Open the generation panel using **Generate → .INP** or **Generate → .OUT**.

### Computational parameters

Review the time-stage settings:

- **DTCOMP** — computation time step.
- **DTOUT** — interval at which output is recorded.
- **TMAX** — simulation end time.

Use values selected for the study and WHAMO version. Confirm that the time step, output interval, and end time are consistent.

### Output configuration

Output requests are added manually. Adding a network element does not automatically create an output request.

1. Choose an element category/type.
2. Select a specific element.
3. Select the variables required for that element.
4. Add the request and review the current request list.
5. Remove unwanted requests before generating the file.

The request type currently used by the Designer is **HISTORY**.

## 7. Generate and edit WHAMO files

### Generate an `.INP`

1. Select **Generate → .INP**.
2. Read and resolve the network validation messages.
3. Review computational parameters and output requests.
4. Generate and download the `.INP`.
5. Inspect the downloaded text file before running it in WHAMO.

### Generate or obtain an `.OUT`

An `.OUT` file is produced by a WHAMO run. If the Designer's configured WHAMO engine is available:

1. Select **Generate → .OUT**.
2. Resolve validation errors.
3. Review settings and requests, then start the run.
4. Review the engine diagnostics and the resulting output before using it.

If the executable is not available in the environment, run the `.INP` with the approved WHAMO installation and then load the resulting `.OUT` into the visualization tool.

### Editing an `.INP`

Editing the generated text file does **not** change the values in the open network project. The text editor is for file reference/editing only. To run a modified input and have the Designer reflect that network, download the edited `.INP`, import it into the Designer, review the imported network, and then generate/run the desired `.OUT`.

Keep the original generated file before editing. Verify that manual edits remain valid WHAMO syntax.

## 8. View simulation results

1. Open **Tools → Visualization**.
2. Load the `.OUT` file to analyze.
3. Use **Profile Graph** for the profile/energy view and **History Graph** for time-series data.
4. Use the SI/FPS toggle in the selected graph section. It applies to that section's graph and associated raw data display.
5. Review the graph, axes, units, selected series, and raw values together.
6. Record the input file, output file, WHAMO version, and unit system when reporting results.

The visualization view reads the output file; it does not repair errors in the source network or prove the simulation is valid.

## 9. Validation and review checklist

Before generating or submitting a file:

- [ ] All required network elements are connected as intended.
- [ ] Labels and identifiers are unique and valid.
- [ ] Units are consistent throughout the network.
- [ ] Geometry, material, boundary conditions, schedules, and turbine data match approved sources.
- [ ] Required time stages and manually added output requests are correct.
- [ ] Validation errors have been resolved and warnings reviewed.
- [ ] The generated `.INP` has been inspected.
- [ ] WHAMO diagnostics and the `.OUT` results have been reviewed.
- [ ] The project, input file, output file, and evidence are saved with clear version names.

## 10. Troubleshooting

| Symptom | Checks |
|---|---|
| Project does not open | Confirm sign-in, try opening the project again, and report the time and any displayed error to the administrator. |
| Element cannot be connected | Confirm the link tool is active, start at the intended connection handle, and check that the target is a valid connection point. |
| Validation blocks generation | Read each message, correct the indicated missing or invalid data, and run validation again. |
| Excel import skips rows | Match workbook labels exactly to existing element labels and import into the corresponding table. |
| `.OUT` cannot be generated | Confirm the network passes validation and the WHAMO engine is configured and available. |
| `.OUT` cannot be visualized | Confirm the file is a complete WHAMO output, then try loading it again and record the first parser or browser error. |
| Edited `.INP` does not alter the diagram | This is expected until the edited file is imported back into the Designer. |

When reporting a problem, include the application version/revision, the action taken, the first error message, and a minimal example file with sensitive or private data removed.

