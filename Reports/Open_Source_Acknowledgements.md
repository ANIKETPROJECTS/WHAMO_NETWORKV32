# Open-Source Acknowledgements and License Register

## Scope and verification status

This register records a **selected set of direct dependencies** in the root WHAMO Designer application. Package names, installed versions, and the license fields below were checked against the installed package metadata in this workspace. This is not a complete software bill of materials, legal opinion, or exhaustive audit of transitive dependencies, the standalone viewer/API artifacts, fonts, logos, images, or other supplied assets.

Before a formal or public handover, the responsible reviewer should:

1. Generate a complete dependency and asset inventory for the exact release.
2. Verify the license text and notices in each distributed package, including transitive dependencies.
3. Confirm that any external data, images, fonts, logos, sample curves, and copied code have an identified source and permission basis.
4. Include required license texts and notices in the distribution and resolve any package whose license metadata is missing or unclear.

## Selected direct components

| Component | Installed version | Package metadata license | Use in the project | Project / source page |
|---|---:|---|---|---|
| React | 18.3.1 | MIT | User interface | https://react.dev/ |
| React DOM | 18.3.1 | MIT | Browser rendering | https://react.dev/ |
| React Flow (`@xyflow/react`) | 12.10.1 | MIT | Interactive network canvas | https://reactflow.dev/ |
| Zustand | 5.0.11 | MIT | Client network/application state | https://zustand.docs.pmnd.rs/ |
| TanStack Query | 5.90.21 | MIT | Server-state and request management | https://tanstack.com/query/ |
| Express | 4.22.3 | MIT | Node.js HTTP server | https://expressjs.com/ |
| Mongoose | 9.6.3 | MIT | MongoDB object modeling package | https://mongoosejs.com/ |
| Vite | 7.3.1 | MIT | Development and client build tooling | https://vite.dev/ |
| TypeScript | 5.9.3 | Apache-2.0 | Type checking and language tooling | https://www.typescriptlang.org/ |
| Tailwind CSS | 3.4.19 | MIT | Styling framework | https://tailwindcss.com/ |
| Radix UI Dialog | 1.1.7 | MIT | Accessible dialog primitive | https://www.radix-ui.com/primitives |
| Radix UI Select | 2.1.7 | MIT | Accessible selection primitive | https://www.radix-ui.com/primitives |
| Lucide React | 0.453.0 | ISC | Interface icons | https://lucide.dev/ |
| Recharts | 2.15.4 | MIT | Data visualization charts | https://recharts.org/ |
| ExcelJS | 4.4.0 | MIT | Spreadsheet import/export | https://github.com/exceljs/exceljs |
| FileSaver.js | 2.0.5 | MIT | Browser file downloads | https://github.com/eligrey/FileSaver.js |
| Framer Motion | 11.18.2 | MIT | Interface animation | https://motion.dev/ |
| Three.js | 0.185.1 | MIT | 3D graphics | https://threejs.org/ |
| Zod | 3.25.76 | MIT | Runtime data validation | https://zod.dev/ |
| Passport | 0.7.0 | MIT | Authentication middleware | https://www.passportjs.org/ |
| jsonwebtoken | 9.0.3 | MIT | JSON Web Token utilities | https://github.com/auth0/node-jsonwebtoken |
| Wouter | 3.9.0 | Unlicense | Client-side routing | https://github.com/molefrog/wouter |

The installed package metadata for Wouter reports `Unlicense`; check the package's distributed license notice for the exact release before redistribution. Additional installed packages are not listed here.

## Suggested acknowledgement text

> WHAMO Network Designer uses third-party open-source software, including React, React Flow, Zustand, TanStack Query, Express, Mongoose, Vite, TypeScript, Tailwind CSS, Radix UI, Lucide React, Recharts, ExcelJS, FileSaver.js, Framer Motion, Three.js, Zod, Passport, jsonwebtoken, and Wouter. Their respective authors and contributors retain their rights. Applicable license texts and notices must accompany distributions as required by each license. See the project's open-source acknowledgement register for selected component versions and license metadata.

Update this text if the release dependency inventory changes. It is not a substitute for the license notices required by each component.

## Review record

| Field | Entry |
|---|---|
| Release / source revision reviewed | [Tag, commit, archive checksum] |
| Full dependency inventory attached | [Yes / no; reference] |
| Asset and font sources reviewed | [Yes / no; reference] |
| License notices included in distribution | [Yes / no; location] |
| Reviewer | [Name and role] |
| Review date | [Date] |
| Open questions / actions | [List, or “None” after review] |

