const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Header, Footer,
  AlignmentType, HeadingLevel, PageBreak, PageNumber,
  LevelFormat
} = require("docx");

const CHAPTERS_DIR = path.join(__dirname, "output-assets/documents/chapters");
const OUTPUT_PATH = path.join(__dirname, "output-assets/documents/Selling-Fire-Draft.docx");

const chapterFiles = [
  "ch-00-intro.md", "ch-01-map.md", "ch-02-promethean.md", "ch-03-valuable.md",
  "ch-04-confluence.md", "ch-05-effing.md", "ch-06-refusal.md", "ch-07-money.md",
  "ch-08-prison.md", "ch-09-truth.md", "ch-10-charlatans.md", "ch-11-voice.md",
  "ch-12-believing.md", "ch-13-fishing.md", "ch-14-road.md", "ch-15-trials.md",
  "ch-16-tension.md", "ch-17-honesty.md", "ch-18-elixir.md", "ch-19-becoming.md",
  "ch-20-true.md", "ch-21-return.md", "ch-22-selling.md", "ch-23-first-step.md",
  "ch-24-invitation.md"
];

function parseInlineFormatting(text) {
  const runs = [];
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(new TextRun({ text: text.slice(lastIndex, match.index), font: "Georgia", size: 24 }));
    }
    if (match[2]) {
      runs.push(new TextRun({ text: match[2], bold: true, italics: true, font: "Georgia", size: 24 }));
    } else if (match[3]) {
      runs.push(new TextRun({ text: match[3], bold: true, font: "Georgia", size: 24 }));
    } else if (match[4]) {
      runs.push(new TextRun({ text: match[4], italics: true, font: "Georgia", size: 24 }));
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    runs.push(new TextRun({ text: text.slice(lastIndex), font: "Georgia", size: 24 }));
  }

  if (runs.length === 0) {
    runs.push(new TextRun({ text: text, font: "Georgia", size: 24 }));
  }

  return runs;
}

function parseMarkdownToElements(markdown, isFirstChapter) {
  const lines = markdown.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") { i++; continue; }

    if (trimmed.startsWith("# ")) {
      const title = trimmed.replace(/^# /, "");
      if (!isFirstChapter) {
        elements.push(new Paragraph({ children: [new PageBreak()] }));
      }
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 600, after: 200 },
        children: [new TextRun({ text: title, font: "Georgia", size: 36, bold: true })]
      }));
      i++; continue;
    }

    if (trimmed.startsWith("## ")) {
      const subtitle = trimmed.replace(/^## /, "");
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
        children: [new TextRun({ text: subtitle, font: "Georgia", size: 28, italics: true, color: "444444" })]
      }));
      i++; continue;
    }

    if (trimmed === "---") {
      elements.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 300, after: 300 },
        children: [new TextRun({ text: "* * *", font: "Georgia", size: 24, color: "999999" })]
      }));
      i++; continue;
    }

    if (trimmed.startsWith("> ")) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quoteLines.push(lines[i].trim().replace(/^> ?/, ""));
        i++;
      }
      const quoteText = quoteLines.join(" ");
      elements.push(new Paragraph({
        indent: { left: 720, right: 720 },
        spacing: { before: 200, after: 200 },
        children: parseInlineFormatting(quoteText).map(r => {
          r.root[1].root.push({ "w:i": {} });
          return r;
        })
      }));
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const listText = trimmed.replace(/^\d+\.\s+/, "");
      elements.push(new Paragraph({
        numbering: { reference: "numbered-list", level: 0 },
        spacing: { before: 60, after: 60 },
        children: parseInlineFormatting(listText)
      }));
      i++; continue;
    }

    const bodyRuns = parseInlineFormatting(trimmed);
    elements.push(new Paragraph({
      spacing: { before: 120, after: 120 },
      children: bodyRuns
    }));
    i++;
  }

  return elements;
}

async function main() {
  const allElements = [];

  allElements.push(new Paragraph({ spacing: { before: 4000 }, children: [] }));
  allElements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: "SELLING FIRE", font: "Georgia", size: 56, bold: true })]
  }));
  allElements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [new TextRun({ text: "Turning Your Transformation into Your Vocation", font: "Georgia", size: 28, italics: true, color: "555555" })]
  }));
  allElements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 800 },
    children: [new TextRun({ text: "Jake Sebok", font: "Georgia", size: 32 })]
  }));
  allElements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 2000 },
    children: [new TextRun({ text: "DRAFT — For Proofreading", font: "Georgia", size: 22, italics: true, color: "999999" })]
  }));

  for (let idx = 0; idx < chapterFiles.length; idx++) {
    const filePath = path.join(CHAPTERS_DIR, chapterFiles[idx]);
    const markdown = fs.readFileSync(filePath, "utf-8");
    const isFirst = idx === 0;
    const elems = parseMarkdownToElements(markdown, isFirst);
    allElements.push(...elems);
  }

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: "Georgia", size: 24 } }
      },
      paragraphStyles: [
        {
          id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 36, bold: true, font: "Georgia" },
          paragraph: { spacing: { before: 600, after: 200 }, outlineLevel: 0 }
        },
        {
          id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 28, italics: true, font: "Georgia", color: "444444" },
          paragraph: { spacing: { before: 200, after: 200 }, outlineLevel: 1 }
        }
      ]
    },
    numbering: {
      config: [{
        reference: "numbered-list",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }]
    },
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          size: { width: 12240, height: 15840 }
        }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Selling Fire — Jake Sebok — DRAFT", font: "Georgia", size: 18, italics: true, color: "AAAAAA" })]
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "— ", font: "Georgia", size: 18, color: "AAAAAA" }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Georgia", size: 18, color: "AAAAAA" }),
              new TextRun({ text: " —", font: "Georgia", size: 18, color: "AAAAAA" })
            ]
          })]
        })
      },
      children: allElements
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log(`Written to ${OUTPUT_PATH}`);
  console.log(`Size: ${(buffer.length / 1024).toFixed(0)} KB`);
}

main().catch(console.error);
