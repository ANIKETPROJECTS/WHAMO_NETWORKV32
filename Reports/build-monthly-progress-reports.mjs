import fs from "node:fs/promises";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

const reportPeriod = "01 February 2026 – 31 October 2026";
const months = [
  "February 2026",
  "March 2026",
  "April 2026",
  "May 2026",
  "June 2026",
  "July 2026",
  "August 2026",
  "September 2026",
  "October 2026",
];

const reports = [
  {
    name: "ANIKET SANJAY RANE",
    file: "MONTHLY_PROGRESS_ANIKET_SANJAY_RANE.docx",
    entries: [
      "Work began with understanding the existing WHAMO workflow and identifying the server-side needs of the proposed visual network application. The backend responsibilities were organized around project data, application requests, and the exchange of model and simulation files.",
      "The backend work focused on mapping the application’s main user actions to the data and server operations they require. This included considering how network models would be saved, reopened, and passed between the Designer and WHAMO-related file workflows.",
      "Initial server-side implementation continued alongside the application structure. Work concentrated on establishing dependable routes and data handling so that the visual interface could communicate with the backend without relying on manual file editing for every operation.",
      "Backend development supported the project and network workflows, including the handling of saved model information and the data needed by the application’s input-generation features. Integration needs were reviewed as the interface and model properties took shape.",
      "Work focused on connecting backend behavior with the developing network editor and its property data. Request handling and data consistency were considered so that values entered through the interface could be used by later project and file operations.",
      "Backend support continued as property-panel and network workflows were refined. The work was coordinated with the application’s changing model data so that updates made in the interface could be carried through the server-side paths.",
      "The backend contribution focused on maintaining the application’s project and file workflows as additional network and analysis features were integrated. Data exchange between the Designer, generated input, and result-review paths remained a central part of the work.",
      "Work continued on the server-side support needed by the Designer and visualization workflow. Integration checks focused on consistent handling of project data and the information required for generated WHAMO input and result review.",
      "Through 28 October, backend work supported the refined generation and output-request workflows and the application’s server execution path. The work also included reviewing how backend behavior connected to the latest interface and project-documentation updates.",
    ],
  },
  {
    name: "ABHIJEET RAJESH SINGH",
    file: "MONTHLY_PROGRESS_ABHIJEET_RAJESH_SINGH.docx",
    entries: [
      "Work began by reviewing the hosting requirements for the WHAMO Network Designer and the services needed to make the application accessible to its users. The assigned focus was the server environment and the components needed to serve the application reliably.",
      "The server work focused on preparing the deployment approach and understanding how the application service, web server, and runtime process would fit together. The aim was to support a clear path from a running application process to browser access.",
      "Work concentrated on the web-server layer, including the role of Nginx in routing browser requests to the application. Server configuration was considered alongside the application’s separate development and production needs.",
      "Nginx and application-serving arrangements were refined so that browser traffic could reach the application service through the expected route. The work remained focused on deployment configuration rather than the application’s hydraulic calculations.",
      "The server contribution included process-management planning with PM2 so that the application could be started and supervised as a managed service. Runtime behavior and the relationship between the process manager and web-server configuration were reviewed.",
      "Deployment work continued across the server runtime and web-serving setup. PM2 process handling and Nginx routing supported the application’s availability through the configured server environment.",
      "The server configuration was maintained as application work progressed. Attention remained on process startup, service continuity, and the routing required for users to reach the Designer through the deployed web service.",
      "Work focused on reviewing the deployment path and the interaction between the application process and Nginx. Server-side changes were coordinated with the evolving application so that access and runtime behavior remained aligned.",
      "Through 28 October, server work continued around the application’s Nginx and PM2 setup and the availability of the web service. Startup and access behavior were reviewed as the project’s interface and supporting documentation were refined.",
    ],
  },
  {
    name: "SAIRAJ MANOHAR KOYANDE",
    file: "MONTHLY_PROGRESS_SAIRAJ_MANOHAR_KOYANDE.docx",
    entries: [
      "Work began with reviewing how users could move from the earlier text-based WHAMO workflow to a visual network-design interface. The frontend focus was on presenting the network and its main actions in a clear, accessible way.",
      "The interface work focused on the layout and interaction model for the network canvas. Consideration was given to how users would create, select, and connect network elements while keeping the model visible during editing.",
      "Frontend development continued on the visual editor and its core controls. The work brought the network canvas and user actions into a more structured interface that could support element creation and model inspection.",
      "Work focused on property-entry interactions and the controls needed to edit network elements. The interface was developed so that users could work with labeled values and see the selected element’s settings alongside the network.",
      "The frontend contribution continued across property panels and unit-aware input controls. The interface work supported entering model values and reviewing the network without depending solely on direct edits to WHAMO text files.",
      "Frontend refinements supported the network editor and its property workflows as the application developed. Work included aligning the visible controls with the project’s current element properties and editing behavior.",
      "The interface work included refinements to geometry and material-related controls, keeping the property panels organized around the choices available for network components. The goal was to make model entry clearer while preserving the existing network view.",
      "Work continued on visualization and results presentation. The frontend supported graph and data views, with attention to how users could inspect simulation information and switch between display units.",
      "Through 28 October, frontend work focused on the visualization and output-configuration experience, including clearer panel organization, output-request controls, and SI/FPS display behavior across graph and data views.",
    ],
  },
  {
    name: "SEJAL SESHMANI YADAV",
    file: "MONTHLY_PROGRESS_SEJAL_SESHMANI_YADAV.docx",
    entries: [
      "Work began with research into the WHAMO workflow and the information users need when preparing hydraulic-network simulations. This research helped frame the project’s requirements and the transition from command-line input work to a visual application.",
      "Research focused on the terminology and sequence used in network modeling and simulation preparation. Findings helped clarify the types of elements, properties, and file operations that the application needed to explain and support.",
      "The research contribution continued around user needs and the structure of WHAMO input and output workflows. The work helped inform the application’s scope and the information that should be visible during model preparation.",
      "Research supported the interpretation of network properties and simulation setup requirements. Attention was given to making the application’s terminology and user-facing explanations consistent with the project’s engineering workflow.",
      "Work focused on reviewing the meaning and presentation of geometry, material, and hydraulic-property options. Research findings supported clearer descriptions of the values users enter and the assumptions behind calculated values.",
      "Research continued alongside changes to the application’s property and file workflows. The focus was on checking that the documented behavior and terminology remained aligned with the WHAMO modeling process.",
      "The research contribution included reviewing turbine settings, operating terminology, and the supporting information needed to explain the available choices. This work helped distinguish application labels from claims about engine compatibility.",
      "Work focused on examining turbine-mode behavior and available simulation evidence. The supplied output files were reviewed to distinguish cases that ended normally from cases with warnings or incomplete evidence.",
      "Through 28 October, research and documentation work continued on the turbine-mode evidence, application behavior, and project handover materials. The supplied GENERATE and OFF outputs showed normal end markers; the REJECT warnings and STARTUP end-marker gap were recorded as unresolved findings.",
    ],
  },
];

function makeDocument(report) {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({
        text: "MONTHLY PROGRESS REPORT",
        bold: true,
        font: "Calibri",
        size: 30,
        color: "000000",
      })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({
        text: report.name,
        bold: true,
        font: "Calibri",
        size: 24,
        color: "000000",
      })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 320 },
      children: [new TextRun({
        text: reportPeriod,
        font: "Calibri",
        size: 20,
        color: "000000",
      })],
    }),
  ];

  months.forEach((month, index) => {
    children.push(new Paragraph({
      text: month,
      heading: HeadingLevel.HEADING_2,
      keepNext: true,
      spacing: { before: 170, after: 90 },
    }));
    children.push(new Paragraph({
      children: [new TextRun({
        text: report.entries[index],
        font: "Calibri",
        size: 22,
        color: "000000",
      })],
      spacing: { after: 170, line: 300 },
      keepLines: true,
      widowControl: true,
    }));
  });

  return new Document({
    creator: "WHAMO Network Designer Project Team",
    title: `Monthly Progress Report — ${report.name}`,
    subject: `Project progress from ${reportPeriod}`,
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22, color: "000000" },
          paragraph: { spacing: { after: 150, line: 300 } },
        },
        heading2: {
          run: { font: "Calibri", size: 24, bold: true, color: "000000" },
          paragraph: { spacing: { before: 170, after: 90 }, keepNext: true },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
        },
      },
      children,
    }],
  });
}

const outputDirectory = new URL("../Monthly_Progress_Reports/", import.meta.url);
await fs.mkdir(outputDirectory, { recursive: true });

for (const report of reports) {
  const buffer = await Packer.toBuffer(makeDocument(report));
  const outputPath = new URL(`../Monthly_Progress_Reports/${report.file}`, import.meta.url);
  await fs.writeFile(outputPath, buffer);
  console.log(`Created ${outputPath.pathname} (${buffer.length} bytes)`);
}
