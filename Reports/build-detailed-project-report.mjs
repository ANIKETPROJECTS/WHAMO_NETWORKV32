import fs from "node:fs/promises";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  PageBreak,
  PageNumber,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";

const sourcePath = new URL("./DETAILED_PROJECT_REPORT.md", import.meta.url);
const outputPath = new URL("./DETAILED_PROJECT_REPORT.docx", import.meta.url);
const lines = (await fs.readFile(sourcePath, "utf8")).replace(/\r\n/g, "\n").split("\n");

const BLACK = "000000";
const LIGHT = "F2F2F2";
const PALE_GRAY = "F7F7F7";
const BORDER = "B7B7B7";
const CONTENT_WIDTH = 9638;
const border = { style: BorderStyle.SINGLE, size: 5, color: BORDER };
const cellMargins = { top: 90, bottom: 90, left: 110, right: 110 };

function inlineRuns(value, base = {}) {
  const parts = value.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part) => {
    const bold = part.startsWith("**") && part.endsWith("**");
    const code = part.startsWith("`") && part.endsWith("`");
    const text = bold ? part.slice(2, -2) : code ? part.slice(1, -1) : part;
    return new TextRun({
      text,
      bold: bold || base.bold,
      ...base,
      font: "Calibri",
      color: BLACK,
    });
  });
}

function cleanMarkdown(value) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

function renderInline(value, base = {}) {
  return inlineRuns(value.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"), base);
}

function makeTable(rows, header = true, rightAlignColumns = []) {
  const normalized = rows.map((row) => row.map((cell) => cleanMarkdown(cell)));
  const columns = Math.max(1, ...normalized.map((row) => row.length));
  const widths = Array.from({ length: columns }, () => Math.floor(CONTENT_WIDTH / columns));
  widths[columns - 1] += CONTENT_WIDTH - widths.reduce((sum, width) => sum + width, 0);
  const tableRows = normalized.map((row, rowIndex) => {
    const isHeader = header && rowIndex === 0;
    const cells = Array.from({ length: columns }, (_, cellIndex) => new TableCell({
      width: { size: widths[cellIndex], type: WidthType.DXA },
      margins: cellMargins,
      verticalAlign: VerticalAlign.CENTER,
      shading: {
        type: ShadingType.CLEAR,
        fill: isHeader ? "E6E6E6" : rowIndex % 2 === 0 ? PALE_GRAY : "FFFFFF",
      },
      borders: { top: border, bottom: border, left: border, right: border },
      children: [new Paragraph({
        children: inlineRuns(row[cellIndex] ?? "", {
          bold: isHeader || (rightAlignColumns.includes(cellIndex) && row[cellIndex]?.includes("ANIKET SANJAY RANE")),
          size: 19,
        }),
        alignment: rightAlignColumns.includes(cellIndex) ? AlignmentType.RIGHT : AlignmentType.LEFT,
        spacing: { after: 0, line: 250 },
        keepLines: true,
      })],
    }));
    return new TableRow({ children: cells, tableHeader: isHeader, cantSplit: true });
  });
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: widths,
    rows: tableRows,
    borders: {
      top: border,
      bottom: border,
      left: border,
      right: border,
      insideHorizontal: border,
      insideVertical: border,
    },
    margins: cellMargins,
  });
}

function parsePipeRow(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function addBody(bodyLines, children) {
  let index = 0;
  while (index < bodyLines.length) {
    const line = bodyLines[index].trim();
    if (!line || line === "---") {
      index += 1;
      continue;
    }
    if (line.startsWith("|") && index + 1 < bodyLines.length && /^\|?[\s|:-]+\|?$/.test(bodyLines[index + 1].trim())) {
      const rows = [parsePipeRow(line)];
      index += 2;
      while (index < bodyLines.length && bodyLines[index].trim().startsWith("|")) {
        rows.push(parsePipeRow(bodyLines[index]));
        index += 1;
      }
      const isDeclarationSignatureTable = rows[0]?.some((cell) =>
        cell.toLowerCase().includes("team leader declaration"));
      children.push(makeTable(rows, true, isDeclarationSignatureTable ? [1] : []));
      children.push(new Paragraph({ text: "", spacing: { after: 100 } }));
      continue;
    }
    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^#+/)[0].length;
      const title = cleanMarkdown(line.replace(/^#{1,3}\s+/, ""));
      children.push(new Paragraph({
        text: title,
        heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
        keepNext: true,
        keepLines: true,
        pageBreakBefore: level === 2 && /^\d+\./.test(title),
        border: level === 2 ? { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLACK, space: 7 } } : undefined,
        spacing: { before: level === 1 ? 320 : 210, after: level === 1 ? 170 : 120 },
      }));
      index += 1;
      continue;
    }
    if (line.startsWith(">")) {
      const quoteLines = [];
      while (index < bodyLines.length && bodyLines[index].trim().startsWith(">")) {
        quoteLines.push(bodyLines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      children.push(new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [CONTENT_WIDTH],
        borders: { top: border, bottom: border, left: border, right: border },
        rows: [new TableRow({
          cantSplit: true,
          children: [new TableCell({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            margins: { top: 130, bottom: 130, left: 180, right: 150 },
            shading: { type: ShadingType.CLEAR, fill: PALE_GRAY },
            borders: { top: border, bottom: border, left: border, right: border },
            children: [new Paragraph({
              children: inlineRuns(quoteLines.join(" "), { size: 19 }),
              spacing: { after: 0, line: 250 },
            })],
          })],
        })],
      }));
      children.push(new Paragraph({ text: "", spacing: { after: 100 } }));
      continue;
    }
    if (/^[-*]\s/.test(line) || /^\d+\.\s/.test(line)) {
      const isNumbered = /^\d+\.\s/.test(line);
      const marker = isNumbered ? `${line.match(/^\d+/)[0]}.` : "•";
      const content = line.replace(/^([-*]|\d+\.)\s+/, "");
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `${marker}  `, bold: true, font: "Calibri", color: BLACK, size: 21 }),
          ...renderInline(content, { size: 22 }),
        ],
        indent: { left: 360, hanging: 240 },
        spacing: { after: 100, line: 290 },
        keepLines: true,
      }));
      index += 1;
      continue;
    }
    const paraLines = [line];
    index += 1;
    while (index < bodyLines.length) {
      const next = bodyLines[index].trim();
      if (!next || next === "---" || next.startsWith("#") || next.startsWith("|") || next.startsWith(">") || /^[-*]\s/.test(next) || /^\d+\.\s/.test(next)) break;
      paraLines.push(next);
      index += 1;
    }
    children.push(new Paragraph({
      children: renderInline(paraLines.join(" "), { size: 22 }),
      spacing: { after: 150, line: 300 },
      widowControl: true,
      keepLines: true,
    }));
  }
}

const firstSeparator = lines.findIndex((line) => line.trim() === "---");
const coverLines = lines.slice(0, firstSeparator);
const title = cleanMarkdown(coverLines.find((line) => line.startsWith("# "))?.replace(/^#\s+/, "") ?? "Detailed Project Report");
const subtitle = cleanMarkdown(coverLines.find((line) => line.startsWith("## "))?.replace(/^##\s+/, "") ?? "WHAMO Network Designer");
const metadataLines = coverLines.filter((line) => /^\*\*.+\*\*/.test(line));
const coverNote = cleanMarkdown(coverLines.filter((line) => line.startsWith(">")).map((line) => line.replace(/^>\s?/, "")).join(" "));
const contentsHeading = lines.findIndex((line) => line.trim() === "## Contents");
const bodySeparator = lines.findIndex((line, idx) => idx > contentsHeading && line.trim() === "---");
const bodyLines = lines.slice(bodySeparator + 1);
const tocEntries = lines
  .slice(contentsHeading + 1, bodySeparator)
  .filter((line) => /^\d+\.\s/.test(line.trim()))
  .map((line) => line.trim().match(/^(\d+)\.\s+(.*)$/));

const coverRows = metadataLines.map((line) => {
  const match = line.match(/^\*\*(.+?)\*\*\s*(.*)$/);
  return [match?.[1]?.replace(/:$/, "") ?? "", cleanMarkdown(match?.[2] ?? "")];
});
const coverChildren = [
  new Paragraph({ text: "", spacing: { after: 850 } }),
  new Paragraph({
    text: "WHAMO",
    alignment: AlignmentType.CENTER,
    spacing: { after: 110 },
    style: "Title",
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 190 },
    children: [new TextRun({ text: "Network Designer", bold: true, color: BLACK, size: 42, font: "Calibri" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 },
    children: [new TextRun({ text: title, bold: true, color: BLACK, size: 30, font: "Calibri" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 440 },
    children: [new TextRun({ text: subtitle, color: BLACK, size: 23, font: "Calibri" })],
  }),
  makeTable([["DOCUMENT INFORMATION", "DETAIL"], ...coverRows]),
  new Paragraph({ text: "", spacing: { after: 280 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: inlineRuns(coverNote, { size: 19 }),
    spacing: { after: 150 },
  }),
];

const children = [...coverChildren, new Paragraph({ children: [new PageBreak()] })];
children.push(new Paragraph({
  text: "Contents",
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 0, after: 240 },
}));
for (const match of tocEntries) {
  if (!match) continue;
  children.push(new Paragraph({
    children: [
      new TextRun({ text: `${match[1]}.  `, bold: true, color: BLACK, size: 22, font: "Calibri" }),
      new TextRun({ text: cleanMarkdown(match[2]), color: BLACK, size: 22, font: "Calibri" }),
    ],
    spacing: { after: 180, line: 290 },
    keepLines: true,
  }));
}
addBody(bodyLines, children);

const doc = new Document({
  creator: "WHAMO Network Designer Project Team",
  title: "WHAMO Network Designer — Detailed Project Report",
  subject: "Project design, implementation, and verification report",
  description: "Editable detailed project report with team declaration and countersignature page.",
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 22, color: BLACK },
        paragraph: { spacing: { after: 150, line: 300 } },
      },
      title: {
        run: { font: "Calibri", size: 58, bold: true, color: BLACK },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 80 } },
      },
      heading1: {
        run: { font: "Calibri", size: 32, bold: true, color: BLACK },
        paragraph: { spacing: { before: 320, after: 170 }, keepNext: true, keepLines: true },
      },
      heading2: {
        run: { font: "Calibri", size: 26, bold: true, color: BLACK },
        paragraph: { spacing: { before: 220, after: 120 }, keepNext: true, keepLines: true },
      },
      heading3: {
        run: { font: "Calibri", size: 23, bold: true, color: BLACK },
        paragraph: { spacing: { before: 170, after: 100 }, keepNext: true, keepLines: true },
      },
      heading4: {
        run: { font: "Calibri", size: 22, bold: true, color: BLACK },
      },
      heading5: {
        run: { font: "Calibri", size: 22, bold: true, color: BLACK },
      },
      heading6: {
        run: { font: "Calibri", size: 22, bold: true, color: BLACK },
      },
      hyperlink: {
        run: { font: "Calibri", color: BLACK },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1050, right: 1134, bottom: 1050, left: 1134 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          children: [
            new TextRun({ text: "WHAMO NETWORK DESIGNER", bold: true, color: BLACK, size: 16, font: "Calibri" }),
            new TextRun({ text: "  |  DETAILED PROJECT REPORT", color: BLACK, size: 16, font: "Calibri" }),
          ],
          border: { bottom: { style: BorderStyle.SINGLE, size: 5, color: BORDER, space: 5 } },
          spacing: { after: 0 },
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 5, color: BORDER, space: 5 } },
          children: [
            new TextRun({ text: "Project report  •  Page ", color: BLACK, size: 16, font: "Calibri" }),
            new TextRun({ children: [PageNumber.CURRENT], color: BLACK, size: 16, font: "Calibri" }),
          ],
        })],
      }),
    },
    children,
  }],
});

const buffer = await Packer.toBuffer(doc);
await fs.writeFile(outputPath, buffer);
console.log(`Created ${outputPath.pathname} (${buffer.length} bytes)`);
