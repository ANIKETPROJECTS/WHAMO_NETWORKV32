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

const sourcePath = new URL("./USER_MANUAL.md", import.meta.url);
const outputPath = new URL("./WHAMO_Network_Designer_User_Manual.docx", import.meta.url);
const markdown = await fs.readFile(sourcePath, "utf8");
const lines = markdown.replace(/\r\n/g, "\n").split("\n");

const NAVY = "12304A";
const BLUE = "1A73E8";
const TEXT = "243447";
const MUTED = "64748B";
const LIGHT = "F1F5F9";
const PALE_BLUE = "EFF6FF";
const BORDER = "D7E0EA";
const CONTENT_WIDTH = 9638;

const border = { style: BorderStyle.SINGLE, size: 5, color: BORDER };
const cellMargins = { top: 90, bottom: 90, left: 110, right: 110 };

function inlineRuns(value, base = {}) {
  const parts = value.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return new TextRun({ text: part.slice(2, -2), bold: true, ...base });
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return new TextRun({
        text: part.slice(1, -1),
        font: "Consolas",
        color: "1D4ED8",
        ...base,
      });
    }
    return new TextRun({ text: part, ...base });
  });
}

function cleanMarkdown(value) {
  return value
    .replace(/\[([^\]]+)\]\(#[^)]+\)/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

function makeParagraph(text, options = {}) {
  return new Paragraph({
    children: inlineRuns(text, { color: TEXT, size: 21 }),
    spacing: { after: 120, line: 280 },
    ...options,
  });
}

function makeTable(rows, header = true) {
  const normalized = rows.map((row) => row.map((cell) => cleanMarkdown(cell)));
  const columns = Math.max(1, ...normalized.map((row) => row.length));
  const widths = Array.from({ length: columns }, () => Math.floor(CONTENT_WIDTH / columns));
  widths[columns - 1] += CONTENT_WIDTH - widths.reduce((sum, width) => sum + width, 0);
  const tableRows = normalized.map((row, rowIndex) => {
    const isHeader = header && rowIndex === 0;
    const cells = Array.from({ length: columns }, (_, cellIndex) => {
      const content = row[cellIndex] ?? "";
      const runs = inlineRuns(content, {
        bold: isHeader,
        color: isHeader ? "FFFFFF" : TEXT,
        size: 18,
      });
      return new TableCell({
        width: { size: widths[cellIndex], type: WidthType.DXA },
        margins: cellMargins,
        verticalAlign: VerticalAlign.CENTER,
        shading: {
          type: ShadingType.CLEAR,
          fill: isHeader ? NAVY : rowIndex % 2 === 0 ? "F8FAFC" : "FFFFFF",
        },
        borders: { top: border, bottom: border, left: border, right: border },
        children: [new Paragraph({ children: runs, spacing: { after: 0, line: 240 } })],
      });
    });
    return new TableRow({ children: cells, tableHeader: isHeader });
  });
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: widths,
    rows: tableRows,
    borders: { top: border, bottom: border, left: border, right: border, insideHorizontal: border, insideVertical: border },
    margins: cellMargins,
  });
}

function parsePipeRow(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function addMarkdownBody(bodyLines, children) {
  let index = 0;
  while (index < bodyLines.length) {
    const line = bodyLines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }
    if (line === "---") {
      children.push(new Paragraph({ children: [new PageBreak()] }));
      index += 1;
      continue;
    }
    if (line.startsWith("```")) {
      index += 1;
      const codeLines = [];
      while (index < bodyLines.length && !bodyLines[index].trim().startsWith("```")) {
        codeLines.push(bodyLines[index]);
        index += 1;
      }
      index += 1;
      children.push(new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [CONTENT_WIDTH],
        borders: { top: border, bottom: border, left: border, right: border },
        rows: [new TableRow({
          children: [new TableCell({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: LIGHT },
            margins: { top: 130, bottom: 130, left: 160, right: 160 },
            borders: { top: border, bottom: border, left: border, right: border },
            children: codeLines.map((code) => new Paragraph({
              children: [new TextRun({ text: code || " ", font: "Consolas", color: "1E3A5F", size: 18 })],
              spacing: { after: 25, line: 240 },
            })),
          })],
        })],
      }));
      children.push(new Paragraph({ text: "", spacing: { after: 80 } }));
      continue;
    }
    if (line.startsWith("|") && index + 1 < bodyLines.length && /^\|?[\s|:-]+\|?$/.test(bodyLines[index + 1].trim())) {
      const rows = [parsePipeRow(line)];
      index += 2;
      while (index < bodyLines.length && bodyLines[index].trim().startsWith("|")) {
        rows.push(parsePipeRow(bodyLines[index]));
        index += 1;
      }
      children.push(makeTable(rows, true));
      children.push(new Paragraph({ text: "", spacing: { after: 100 } }));
      continue;
    }
    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^#+/)[0].length;
      const title = cleanMarkdown(line.replace(/^#{1,3}\s+/, ""));
      const headingLevel = level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3;
      children.push(new Paragraph({
        text: title,
        heading: headingLevel,
        keepNext: true,
        spacing: { before: level === 1 ? 300 : 190, after: level === 1 ? 130 : 90 },
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
      const quoteText = quoteLines.join(" ");
      children.push(new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [CONTENT_WIDTH],
        borders: { top: border, bottom: border, left: { style: BorderStyle.SINGLE, size: 18, color: BLUE }, right: border },
        rows: [new TableRow({
          children: [new TableCell({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            margins: { top: 130, bottom: 130, left: 180, right: 150 },
            shading: { type: ShadingType.CLEAR, fill: PALE_BLUE },
            borders: { top: border, bottom: border, left: { style: BorderStyle.SINGLE, size: 18, color: BLUE }, right: border },
            children: [new Paragraph({
              children: inlineRuns(quoteText, { color: "173B5E", size: 19 }),
              spacing: { after: 0, line: 250 },
            })],
          })],
        })],
      }));
      children.push(new Paragraph({ text: "", spacing: { after: 100 } }));
      continue;
    }
    if (/^[-*]\s/.test(line) || /^\d+\.\s/.test(line)) {
      const isNumber = /^\d+\.\s/.test(line);
      const content = isNumber ? line.replace(/^\d+\.\s/, "") : line.replace(/^[-*]\s/, "");
      const checked = content.startsWith("[ ] ");
      const bullet = isNumber ? line.match(/^\d+/)[0] + "." : checked ? "☐" : "•";
      const text = cleanMarkdown(checked ? content.slice(4) : content);
      children.push(new Paragraph({
        children: [new TextRun({ text: `${bullet}  `, bold: true, color: BLUE, size: 19 }), ...inlineRuns(text, { color: TEXT, size: 20 })],
        indent: { left: 360, hanging: 240 },
        spacing: { after: 75, line: 265 },
      }));
      index += 1;
      continue;
    }
    const paraLines = [line];
    index += 1;
    while (index < bodyLines.length) {
      const next = bodyLines[index].trim();
      if (!next || next === "---" || next.startsWith("#") || next.startsWith("|") || next.startsWith(">") || next.startsWith("```") || /^[-*]\s/.test(next) || /^\d+\.\s/.test(next)) break;
      paraLines.push(next);
      index += 1;
    }
    children.push(new Paragraph({
      children: inlineRuns(cleanMarkdown(paraLines.join(" ")), { color: TEXT, size: 20 }),
      spacing: { after: 115, line: 270 },
      widowControl: true,
    }));
  }
}

const coverEnd = lines.findIndex((line) => line.trim() === "---");
const coverLines = lines.slice(0, coverEnd);
const title = cleanMarkdown(coverLines.find((line) => line.startsWith("# "))?.replace(/^#\s+/, "") ?? "WHAMO Network Designer");
const subtitle = cleanMarkdown(coverLines.find((line) => line.startsWith("## "))?.replace(/^##\s+/, "") ?? "User Manual");
const metadataLines = coverLines.filter((line) => /^\*\*.+\*\*/.test(line));
const coverNoteLines = coverLines.filter((line) => line.startsWith(">")).map((line) => line.replace(/^>\s?/, ""));
const coverNote = cleanMarkdown(coverNoteLines.join(" "));

const contentsHeading = lines.findIndex((line) => line.trim() === "## Contents");
const bodyStart = lines.findIndex((line, idx) => idx > contentsHeading && line.trim() === "---");
const documentBody = lines.slice(bodyStart + 1);

const coverChildren = [
  new Paragraph({ text: "", spacing: { after: 1050 } }),
  new Paragraph({
    text: "WHAMO",
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    style: "Title",
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 },
    children: [new TextRun({ text: "Network Designer", bold: true, color: NAVY, size: 40, font: "Aptos Display" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 140 },
    children: [new TextRun({ text: subtitle, color: BLUE, size: 28, font: "Aptos Display" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 550 },
    children: [new TextRun({ text: "Hydraulic Transient Analysis · Water Hammer & Mass Oscillation", color: MUTED, size: 19, italics: true })],
  }),
];

const metaRows = metadataLines.map((line) => {
  const match = line.match(/^\*\*(.+?)\*\*\s*(.*)$/);
  return [match?.[1]?.replace(/:$/, "") ?? "", cleanMarkdown(match?.[2] ?? "")];
});
coverChildren.push(makeTable([["DOCUMENT INFORMATION", "DETAIL"], ...metaRows], true));
coverChildren.push(new Paragraph({ text: "", spacing: { after: 350 } }));
coverChildren.push(new Table({
  width: { size: CONTENT_WIDTH, type: WidthType.DXA },
  columnWidths: [CONTENT_WIDTH],
  borders: { top: border, bottom: border, left: border, right: border },
  rows: [new TableRow({
    children: [new TableCell({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      margins: { top: 150, bottom: 150, left: 180, right: 180 },
      shading: { type: ShadingType.CLEAR, fill: PALE_BLUE },
      borders: { top: border, bottom: border, left: { style: BorderStyle.SINGLE, size: 18, color: BLUE }, right: border },
      children: [new Paragraph({
        children: inlineRuns(coverNote, { color: "173B5E", size: 19 }),
        spacing: { after: 0, line: 260 },
      })],
    })],
  })],
}));

const children = [...coverChildren, new Paragraph({ children: [new PageBreak()] })];

const tocLines = lines.slice(contentsHeading + 1, bodyStart);
const tocEntries = tocLines.filter((line) => /^\d+\.\s/.test(line.trim())).map((line) => {
  const match = line.trim().match(/^(\d+)\.\s+(.*)$/);
  return [match?.[1] ?? "", cleanMarkdown(match?.[2] ?? "")];
});
children.push(new Paragraph({
  text: "Contents",
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 0, after: 240 },
}));
for (const [number, entry] of tocEntries) {
  children.push(new Paragraph({
    children: [
      new TextRun({ text: `${number}.  `, bold: true, color: BLUE, size: 21 }),
      new TextRun({ text: entry, color: TEXT, size: 21 }),
    ],
    spacing: { after: 150 },
  }));
}
children.push(new Paragraph({ children: [new PageBreak()] }));
addMarkdownBody(documentBody, children);

const doc = new Document({
  creator: "WHAMO Network Designer Project Team",
  title: "WHAMO Network Designer — User Manual",
  subject: "User guide prepared for project submission and technical review",
  description: "Editable project user manual for WHAMO Network Designer.",
  styles: {
    default: {
      document: {
        run: { font: "Aptos", size: 20, color: TEXT },
        paragraph: { spacing: { after: 100, line: 270 } },
      },
      title: {
        run: { font: "Aptos Display", size: 52, bold: true, color: BLUE },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 80 } },
      },
      heading1: {
        run: { font: "Aptos Display", size: 30, bold: true, color: NAVY },
        paragraph: { spacing: { before: 320, after: 150 }, keepNext: true },
      },
      heading2: {
        run: { font: "Aptos Display", size: 24, bold: true, color: BLUE },
        paragraph: { spacing: { before: 220, after: 100 }, keepNext: true },
      },
      heading3: {
        run: { font: "Aptos", size: 21, bold: true, color: NAVY },
        paragraph: { spacing: { before: 150, after: 80 }, keepNext: true },
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
            new TextRun({ text: "WHAMO NETWORK DESIGNER", bold: true, color: NAVY, size: 16 }),
            new TextRun({ text: "  |  USER MANUAL", color: MUTED, size: 16 }),
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
            new TextRun({ text: "Project submission manual  •  ", color: MUTED, size: 16 }),
            new TextRun({ text: "Page ", color: MUTED, size: 16 }),
            new TextRun({ children: [PageNumber.CURRENT], color: MUTED, size: 16 }),
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
