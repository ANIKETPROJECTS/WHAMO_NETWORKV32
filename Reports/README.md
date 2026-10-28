# Reports and handover documents

This folder contains templates and project documentation for the WHAMO Network Designer. Templates are intentionally unsigned and contain fields for the interns, supervisors, and host-organization committee to complete.

## Documents

| File | Purpose |
|---|---|
| [Monthly Progress Report Template](Monthly_Progress_Report_Template.md) | Submit one report per intern for each reporting month; the host-organization committee records verification and acceptance. |
| [Final Project Report Template](Final_Project_Report_Template.md) | Document the final product, implementation, evidence, limitations, handover, and required countersignatures. |
| [User Manual (Markdown)](USER_MANUAL.md) | Detailed instructions for operating the WHAMO Designer and reviewing WHAMO files. |
| [User Manual (Word)](WHAMO_Network_Designer_User_Manual.docx) | Editable, professionally formatted copy prepared for project submission and technical review. |
| [Intern Responsibility Declaration](Intern_Responsibility_Declaration.md) | Individual declaration covering each intern's work, plagiarism, intellectual property, copyright, and acknowledgements. A signature-ready Word copy is also provided as `Intern_Responsibility_Declaration.docx`. |
| [Open-Source Acknowledgements](Open_Source_Acknowledgements.md) | A selected register of direct components whose installed package metadata was checked, plus the limits of that check. |

## How to use these templates

1. Make a separate copy of the monthly report for each intern and reporting month.
2. Replace every square-bracketed field with verified information. Do not fill in committee decisions, test results, or signatures on another person's behalf.
3. Attach evidence referenced by a report, such as dated screenshots, test logs, review records, or approved meeting minutes. Remove credentials and personal data from evidence.
4. Before final submission, include the source-code repository or approved source archive, the user manual, the completed final report, the open-source notices required by the actual distribution, and each intern's signed declaration.
5. Obtain committee verification and acceptance for monthly reports, and the required countersignatures on the final report.

The project source code is maintained in the repository root and its application folders; this Reports folder documents and supports the handover rather than duplicating the source. These templates do not certify that a committee has reviewed or accepted the work.

The Markdown user manual is the editable source. After changing it, rebuild the Word copy from the project root with `node Reports/build-user-manual.mjs`. Complete the author and organization fields and verify the deployed application version before submitting the document.
