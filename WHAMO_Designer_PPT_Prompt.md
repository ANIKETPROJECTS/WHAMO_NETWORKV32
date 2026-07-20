# WHAMO Designer — PowerPoint Presentation Prompt

> **How to use this file:** Feed this entire document to an AI presentation tool (ChatGPT, Gamma, Beautiful.ai, etc.) or use it as a detailed content brief for manually building slides. Every slide title, bullet, and talking point is specified below. Suggested slide count: **18–22 slides**.

---

## Presentation Overview

**Title:** WHAMO Designer — A Modern Visual Interface for Hydraulic Transient Analysis
**Subtitle:** Designing, Simulating, and Visualizing Water Hammer in Pipe Networks
**Audience:** Engineers, project managers, water infrastructure stakeholders, Ministry officials
**Tone:** Professional, technical but accessible, government/institutional

**Brand context visible in the app:**
- Ministry of Jal Shakti (जल शक्ति मंत्रालय) logo — India's central water ministry
- Yellow circular emblem (ministry seal)
- Blue primary color palette
- "VERSION 1.0" badge

---

## Slide-by-Slide Content

---

### SLIDE 1 — Title Slide

**Title:** WHAMO Designer
**Subtitle:** A Web-Based Visual Network Designer for Hydraulic Transient Analysis
**Supporting line:** Powered by the WHAMO (Water Hammer and Mass Oscillation) Simulation Engine
**Logos:** Ministry of Jal Shakti | Ministry Seal
**Version tag:** Version 1.0

---

### SLIDE 2 — The Problem: What is Water Hammer?

**Heading:** Understanding the Challenge

**Content:**
- Water hammer (hydraulic transient) is a pressure surge that occurs when fluid in motion is forced to stop or change direction suddenly — e.g., when a valve closes rapidly or a pump trips
- These pressure waves can cause pipe bursts, structural damage, and catastrophic failures in water distribution and hydropower systems
- Simulating these effects before construction or operational changes is critical for safe infrastructure design
- WHAMO (Water Hammer and Mass Oscillation) is a proven legacy simulation engine developed for exactly this purpose
- The challenge: WHAMO uses a complex, text-based `.INP` file format that requires specialized knowledge to construct manually — making it inaccessible to many engineers

**Visual suggestion:** Diagram of a pipe with pressure wave propagation, or a photo of pipe failure from water hammer

---

### SLIDE 3 — The Solution: WHAMO Designer

**Heading:** WHAMO Designer — Visual Engineering, No Text Files Required

**Content:**
- WHAMO Designer is a full-stack web application that wraps the WHAMO simulation engine in a modern, interactive graphical interface
- Engineers design hydraulic networks visually by dragging and dropping components onto a canvas
- The application automatically generates the `.INP` input file, executes the WHAMO engine, and presents results in interactive charts
- Developed for the Ministry of Jal Shakti — applicable to water supply networks, hydropower systems, irrigation infrastructure, and dam operations

**Tagline:** "From network sketch to simulation results — without writing a single line of WHAMO syntax"

---

### SLIDE 4 — Who Uses It?

**Heading:** Built for Hydraulic Engineers

**User roles:**
1. **Hydraulic Engineers** — Design and simulate pipe network transients
2. **Project Managers** — Review and share network projects across teams
3. **Ministry Officials** — Access and oversee infrastructure simulation projects
4. **Researchers** — Analyze water hammer behavior in academic settings

**Key benefit per user:**
- Engineers: Visual design replaces error-prone manual INP editing
- Managers: Project persistence in database; shareable by email
- Officials: Centralized, authenticated project management
- Researchers: Import/export via Excel for data analysis pipelines

---

### SLIDE 5 — Application Architecture Overview

**Heading:** System Architecture

**Three-tier web application:**

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript, Vite build |
| Backend | Node.js + Express.js REST API |
| Database | MongoDB (via Mongoose) |
| Auth | JWT (JSON Web Tokens) |
| Engine | WHAMO.EXE (Windows binary via Wine on Linux) |

**Frontend libraries:**
- **@xyflow/react** (React Flow) — interactive node-graph canvas
- **Zustand** — complex network state management
- **Recharts** — visualization charts
- **ExcelJS** — Excel import/export
- **Radix UI + Tailwind CSS** — accessible, styled UI components
- **shadcn/ui** — pre-built component system

**Deployment:** Node.js server on Replit (Linux), WHAMO.EXE executed via Wine compatibility layer

---

### SLIDE 6 — Feature Map (High-Level)

**Heading:** Core Capabilities at a Glance

**Six pillars:**

1. 🗺️ **Visual Network Editor** — Drag-and-drop canvas, node/edge design
2. ⚙️ **Element Configuration** — Rich properties panel for every component
3. 📄 **INP File Generation** — Automatic, client-side WHAMO input file creation
4. 🚀 **Simulation Execution** — One-click WHAMO engine run on the server
5. 📊 **Results Visualization** — Animated HGL profiles + time-series history graphs
6. 📁 **Data Management** — Projects saved to MongoDB, Excel import/export, sharing

---

### SLIDE 7 — The Network Canvas

**Heading:** Interactive Node-Graph Editor

**What it is:**
- Built on **@xyflow/react** (React Flow) — a powerful, interactive diagram engine
- Engineers draw their hydraulic network exactly as they would on paper, but digitally
- Nodes represent hydraulic elements (reservoirs, junctions, surge tanks, etc.)
- Edges (connections) represent pipes, pumps, valves, and turbines
- Full pan, zoom, and selection support

**Key canvas interactions:**
- **Add elements** via the Node Selection Panel (sidebar)
- **Connect elements** by dragging from one node's port to another
- **Select and move** individual nodes or multi-select groups
- **Auto-arrange** — one-click automatic layout algorithm that organizes the network hierarchically, eliminating manual positioning
- **Delete** nodes or edges with keyboard shortcuts
- **Canvas fits** to the network automatically on load

**Visual suggestion:** Screenshot of the designer canvas with a sample hydraulic network

---

### SLIDE 8 — Supported Hydraulic Elements

**Heading:** All Major Hydraulic Components Supported

**NODE TYPES (placed as points on the network):**

| Element | Icon | Description |
|---|---|---|
| **Reservoir** | 🏞️ | Fixed water surface elevation or time-varying H-Schedule boundary |
| **Junction** | ⬤ | Internal pipe junction node; connects multiple conduits |
| **Surge Tank — Simple** | 🗼 | Open standpipe surge protection vessel |
| **Surge Tank — Differential** | 🗼⬡ | Surge tank with inner standpipe for refined surge control |
| **Surge Tank — Air Tank** | 🫧 | Closed pressurized air vessel; no free surface |
| **Flow Boundary** | 🌊 | Time-varying flow injection/extraction (Q-Schedule) |

**LINK TYPES (edges connecting nodes):**

| Element | Description |
|---|---|
| **Conduit (Pipe)** | Standard pipe with length, diameter, wave speed (celerity), and friction factor (Hazen-Williams or Darcy-Weisbach) |
| **Dummy Pipe** | Zero-length connection for model topology (no hydraulic properties) |
| **Pump** | Centrifugal pump with characteristic curve data; supports ACTIVE/INACTIVE status |
| **Check Valve** | One-way (non-return) valve; OPEN/CLOSED initial state |
| **Turbine** | Hydraulic turbine with four operating modes: TURBINE, GENERATE, TURBGOV, EMERGENCY |

---

### SLIDE 9 — Properties Panel: Configuring Elements

**Heading:** Precise Property Control for Every Element

**The Properties Panel** appears on the right side when any node or edge is selected.

**Conduit (Pipe) properties include:**
- Label / ID
- Length (m or ft)
- Diameter (m or ft)
- Wave Speed / Celerity (m/s or ft/s)
- Friction factor (Hazen-Williams C or Darcy-Weisbach f)
- Number of reaches (computational sub-divisions)
- Wave speed adjustment options

**Reservoir properties include:**
- Boundary mode: Fixed Elevation or H-Schedule (time-varying head)
- Elevation (m or ft)
- Schedule assignment (links to an H-Schedule definition)

**Surge Tank properties include:**
- Type: Simple, Differential, or Air Tank
- Cross-sectional area
- Initial water level
- Orifice area (for differential type)
- Air volume and pressure (for air tank type)

**Pump properties include:**
- Status: ACTIVE / INACTIVE
- Operating mode
- Pump curve: Head vs. Flow characteristic (H-Q curve defined as data points)
- Moment of inertia, speed

**Turbine properties include:**
- Operating mode: TURBINE / GENERATE / TURBGOV / EMERGENCY
- Turbine curve (characteristic data)
- Shutoff time (TOFF)

**Schedule definitions:**
- **H-Schedule:** Time-Head pairs for time-varying reservoir water levels
- **Q-Schedule:** Time-Flow pairs for flow boundary injection/extraction
- **V-Schedule:** Time-Velocity pairs

---

### SLIDE 10 — Simulation Parameters

**Heading:** Computational Control Settings

**Global simulation parameters (set per project):**

| Parameter | Description |
|---|---|
| **DTCOMP** | Computational time step (seconds) — must satisfy Courant condition |
| **DTOUT** | Output interval (seconds) — how frequently results are written |
| **TMAX** | Total simulation duration (seconds) |
| **ITMAX** | Maximum iterations per time step |
| **Units** | SI (metric) or FPS (English/Imperial) — the app handles all unit conversions internally |

**Unit conversion:**
- The application stores data in the user's chosen unit system (SI or FPS)
- INP file generation automatically converts SI values to FPS as required by the WHAMO engine
- Engineers always work in their preferred units; conversion is invisible

---

### SLIDE 11 — INP File Generation

**Heading:** Automatic WHAMO Input File Creation

**What is a `.INP` file?**
- WHAMO's proprietary text-based input format
- Describes every element of the hydraulic network in a structured keyword syntax
- Historically written by hand — error-prone and time-consuming

**How WHAMO Designer generates it:**
- Entirely **client-side** (runs in the browser, instant feedback)
- Reads the current network graph state (all nodes, edges, properties, schedules)
- Converts to WHAMO keyword format automatically
- Handles:
  - Section headers for each element type (RESERVOIRS, JUNCTIONS, CONDUITS, PUMPS, TURBINES, etc.)
  - H-Schedule, Q-Schedule, and V-Schedule blocks
  - Computational stage parameters (DTCOMP, DTOUT, TMAX)
  - SI → FPS unit conversion
  - Connectivity validation (unique IDs, proper connections)
  - Pump and turbine curve data embedding

**Output options:**
- Download the `.INP` file directly (for use with standalone WHAMO)
- Send to server for immediate simulation execution

**Visual suggestion:** Side-by-side comparison — graphical network on left, generated INP text on right

---

### SLIDE 12 — Running the Simulation

**Heading:** One-Click WHAMO Engine Execution

**The simulation pipeline:**

```
User clicks "Run Simulation"
        ↓
Browser generates .INP content (client-side)
        ↓
POST /api/generate-out (authenticated API call)
        ↓
Server creates isolated temp directory (UUID)
        ↓
Copies WHAMO.EXE + .INP into temp directory
        ↓
Executes: wine whamo.exe (via Wine compatibility layer)
        ↓
WHAMO produces: .OUT (output), .PLT (plot data), .TAB (tabular sheet)
        ↓
Server reads output files, encodes as Base64
        ↓
Returns file content to browser
        ↓
Browser parses and renders results
        ↓
Temp directory cleaned up automatically
```

**Technical notes:**
- WHAMO.EXE is a legacy Windows binary — runs on Linux via **Wine**
- Each simulation job runs in its own isolated directory (UUID-named) for concurrency safety
- 60-second timeout with 100MB output buffer
- Results returned as Base64-encoded file content
- No output files stored permanently on server

---

### SLIDE 13 — Results Visualization

**Heading:** Understanding Simulation Results

**Three visualization modes:**

#### 1. Profile Chart (Animated HGL — Hydraulic Grade Line)
- Shows the **energy grade line** along the pipe network over time
- Animates the pressure wave travelling through the system
- Controls: **Play / Pause / Reset / Speed**
- Each node shows: max energy elevation, min energy elevation, and time of occurrence
- Up to 200 animation frames
- Zoom in/out controls

#### 2. History Graph (Time Series)
- Shows **head, flow, or velocity** at selected nodes over the full simulation duration
- Multi-line chart — compare multiple nodes simultaneously
- Interactive: hover for exact values at any time step
- Built with **Recharts** (React charting library)

#### 3. FlexTable (Tabular Data)
- Structured table of all simulation data points
- Filterable by element type
- Useful for numerical review and export

**Parsing:**
- `.OUT` file parsed by `out-parser.ts` (profile/envelope data)
- `.PLT` file parsed by `history-parser.ts` (time series data)
- All parsing happens client-side — no server round-trip for visualization interaction

---

### SLIDE 14 — Excel Integration

**Heading:** Bidirectional Excel Import / Export

**Why Excel?**
- Engineers frequently manage large networks with many elements
- Excel provides bulk editing, formula support, and familiar tooling
- Enables data exchange with other engineering software

**Export to Excel:**
- Generates a multi-sheet `.xlsx` workbook using **ExcelJS**
- Separate sheets for: Conduits, Nodes, Reservoirs, Junctions, Surge Tanks, Flow Boundaries, Pumps, Check Valves, Turbines
- Each row = one network element with all its properties
- Dropdown validation cells (e.g., pipe type, surge tank type, pump status)
- Conditional locking (columns that become read-only based on other field values)
- H-Schedule data exported to a dedicated `_Lists` sheet

**Import from Excel:**
- Read back a modified workbook
- All changes applied to the network state
- Handles column types: text, number, boolean, dropdown
- Validates and reconciles schedule data

**Supported filter views during export:** All elements, conduits only, nodes only, or any specific element type

---

### SLIDE 15 — Project Management

**Heading:** Persistent, Shareable Project Workspace

**Projects system:**
- Each user can create multiple named projects
- Full network state saved to **MongoDB** as structured JSON:
  - All nodes with positions and properties
  - All edges (connections) with properties
  - All schedule definitions (H, Q, V)
  - Simulation parameter stages
- Projects listed in the Projects Panel (collapsible sidebar)
- Open, rename, or delete projects from the panel

**Sharing:**
- Projects can be shared via email (share-by-email feature)
- Shared projects accessible to other registered users

**Auto-save:**
- Network changes can be saved on demand
- JSON file export/import for backup and portability

---

### SLIDE 16 — Authentication & Security

**Heading:** Secure Multi-User Access

**Authentication system:**
- **JWT (JSON Web Token)** based authentication
- All project API routes protected by `authMiddleware`
- Tokens issued on login, validated on every API call

**User management:**
- User registration (email + password)
- Login page with show/hide password toggle
- **Demo Account** — pre-seeded credentials for immediate exploration:
  - Email: `demo@example.com`
  - Password: pre-configured
- Admin Panel for user administration

**Session handling:**
- Token stored client-side
- Protected routes redirect unauthenticated users to login
- `AuthGuard` component wraps all protected pages

---

### SLIDE 17 — User Interface Walkthrough

**Heading:** Designed for Engineering Workflows

**Main layout — Designer page:**
```
┌─────────────────────────────────────────────────────────┐
│  Header: Logo | Project Name | Toolbar Actions          │
├──────────┬──────────────────────────────────┬───────────┤
│  Node    │                                  │ Properties│
│Selection │       Network Canvas             │  Panel    │
│  Panel   │    (React Flow graph editor)     │           │
│          │                                  │           │
│          │                                  │           │
│          │                                  │           │
└──────────┴──────────────────────────────────┴───────────┘
```

**Toolbar actions (Header):**
- New Project | Open Project | Save
- Import Excel | Export Excel
- Download INP | Run Simulation
- Auto-Arrange (layout)
- Visualization (opens full-screen results overlay)
- Settings | Help

**Node Selection Panel (left):**
- All element types grouped by category (Nodes / Links)
- Click to add element to canvas
- Filterable

**Properties Panel (right):**
- Context-sensitive — shows properties for selected node or edge
- Tabbed where needed (e.g., General | Curve | Schedule)
- Inline validation

**Help Modal:**
- Built-in documentation and usage guide
- Accessible from the toolbar

---

### SLIDE 18 — The Full Engineering Workflow

**Heading:** End-to-End in WHAMO Designer

**Step-by-step user journey:**

```
1. LOGIN
   └─ Enter credentials or use Demo Account

2. CREATE / OPEN PROJECT
   └─ Name your project, open from Projects Panel

3. DESIGN NETWORK
   └─ Add nodes: Reservoirs → Junctions → Surge Tanks → Flow Boundaries
   └─ Add links: Conduits → Pumps → Check Valves → Turbines
   └─ Connect elements on the canvas

4. CONFIGURE ELEMENTS
   └─ Click any node or edge → Properties Panel opens
   └─ Set elevations, pipe dimensions, pump curves, schedules

5. SET SIMULATION PARAMETERS
   └─ Configure DTCOMP, TMAX, DTOUT in Settings/Stages

6. VALIDATE & EXPORT INP
   └─ App auto-validates topology and properties
   └─ Download .INP for review or archive

7. RUN SIMULATION
   └─ Click "Run" → server executes WHAMO.EXE
   └─ Results returned automatically

8. VISUALIZE RESULTS
   └─ Animated Profile Chart (HGL envelope)
   └─ History Graph (time-series at nodes)
   └─ FlexTable (numerical data)

9. SAVE & SHARE
   └─ Save to MongoDB
   └─ Export Excel for reporting
   └─ Share project by email
```

---

### SLIDE 19 — Key Technical Differentiators

**Heading:** What Makes WHAMO Designer Different

| Challenge | Traditional Approach | WHAMO Designer |
|---|---|---|
| INP file creation | Manual text editing, WHAMO syntax expertise required | Auto-generated from visual design |
| Error-prone connections | Manually verifying node IDs in text | Visual graph — connections are inherent |
| Unit conversion | Engineer must convert SI ↔ FPS manually | Handled automatically by the app |
| Running WHAMO | Installing Windows environment, running locally | Browser → server → Wine → results back |
| Viewing results | Post-processing with separate tools | Built-in animated charts and tables |
| Data management | Files on local disk | MongoDB-persisted, multi-user, shareable |
| Bulk editing | Re-editing INP text | Excel import/export |

---

### SLIDE 20 — Current Status & Version

**Heading:** WHAMO Designer v1.0 — Production Ready

**What's included in v1.0:**
- ✅ Full visual network editor with all WHAMO element types
- ✅ Complete INP file generation (all sections, all schedules)
- ✅ WHAMO engine execution via server API
- ✅ Animated Profile Chart (HGL) + History Graph + FlexTable
- ✅ Excel bidirectional import/export (multi-sheet)
- ✅ MongoDB project persistence
- ✅ JWT authentication with demo account
- ✅ Project sharing by email
- ✅ Auto-arrange layout algorithm
- ✅ Pump and Turbine characteristic curve editors
- ✅ Three surge tank types (Simple, Differential, Air Tank)
- ✅ Schedule support (H-Schedule, Q-Schedule, V-Schedule)
- ✅ SI and FPS unit systems
- ✅ Built-in help documentation

**Deployment:**
- Web application — accessible from any browser, no installation required
- Runs on Node.js server (Linux)
- WHAMO.EXE executed via Wine compatibility layer

---

### SLIDE 21 — Potential Future Enhancements (Roadmap Ideas)

**Heading:** What Could Come Next

**Suggested roadmap items:**

1. **Session Persistence** — Keep users logged in across server restarts (move from in-memory to MongoDB-backed sessions)
2. **Network Validation Engine** — Pre-simulation checks for topology errors, missing required properties, and Courant condition violations
3. **Multiple Simulation Stages** — UI for defining multi-stage simulations (different DTCOMP/TMAX per stage)
4. **Result Export** — Download chart data as CSV or PNG
5. **Collaborative Editing** — Real-time multi-user canvas editing (WebSocket)
6. **Offline/Desktop Mode** — Electron wrapper for offline use
7. **Enhanced Turbine Models** — Governor model parameters (TURBGOV mode)
8. **API Access** — Programmatic INP generation and simulation triggering

---

### SLIDE 22 — Summary & Conclusion

**Heading:** WHAMO Designer — Bringing Legacy Simulation into the Modern Era

**Key takeaways:**
1. Water hammer is a critical risk in water infrastructure — simulation saves lives and infrastructure
2. WHAMO is a proven engine; WHAMO Designer removes the barrier to using it
3. Visual design → automatic INP → engine execution → interactive results — all in one web app
4. Built for the Ministry of Jal Shakti — scalable to national infrastructure projects
5. Modern web stack ensures accessibility from any device, zero installation

**Closing statement:**
> WHAMO Designer transforms a complex, specialist-only simulation workflow into an accessible, visual engineering tool — enabling more engineers to safely design water infrastructure, faster.

**Contact / Demo:** [Your organization contact here]
**Live demo:** Use the built-in Demo Account at the application URL

---

## Design Recommendations for the Slides

### Color Palette
- **Primary blue:** `#1A56DB` (matches the app's Sign In button)
- **Dark navy:** `#1E3A5F`
- **Accent gold:** `#F59E0B`
- **Background:** White or very light gray (`#F9FAFB`)
- **Text:** `#111827` (near-black)

### Typography
- Headings: Bold sans-serif (e.g., Inter Bold, Calibri Bold)
- Body: Regular sans-serif
- Code/INP snippets: Monospace (Courier New, JetBrains Mono)

### Suggested Visuals
- **Slide 2:** Water hammer pressure wave diagram
- **Slide 7:** Screenshot of the WHAMO Designer canvas with a sample network
- **Slide 8:** Grid of element icons with labels
- **Slide 11:** Side-by-side: canvas screenshot + corresponding INP text excerpt
- **Slide 12:** Flowchart of simulation pipeline
- **Slide 13:** Screenshot of Profile Chart animation + History Graph
- **Slide 14:** Excel workbook screenshot
- **Slide 18:** Timeline/flow diagram of the 9-step workflow
- **Slide 19:** Comparison table (Traditional vs WHAMO Designer)

### Logos to Include
- Ministry of Jal Shakti (जल शक्ति मंत्रालय) — appears on login page header
- Ministry circular seal/emblem

---

## Quick Stats for Callout Boxes

| Stat | Value |
|---|---|
| Node element types | 6 (Reservoir, Junction, Surge Tank ×3, Flow Boundary) |
| Link element types | 5 (Conduit, Dummy, Pump, Check Valve, Turbine) |
| Schedule types | 3 (H-Schedule, Q-Schedule, V-Schedule) |
| Surge tank variants | 3 (Simple, Differential, Air Tank) |
| Turbine operating modes | 4 (TURBINE, GENERATE, TURBGOV, EMERGENCY) |
| Excel sheets exported | Up to 9 (one per element type) |
| Simulation timeout | 60 seconds |
| Unit systems supported | 2 (SI / FPS) |
| Tech stack layers | 3 (React frontend, Express API, MongoDB) |
| Authentication | JWT with demo account |
