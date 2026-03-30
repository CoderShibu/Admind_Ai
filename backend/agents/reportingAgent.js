import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = path.join(__dirname, "../reports");

/**
 * REPORTING AGENT
 * Compiles analytics + insights + optimization into a
 * branded PDF report for stakeholder sharing.
 */

const INR = (n) => `Rs. ${Number(n || 0).toLocaleString("en-IN")}`;

// ── Palette ───────────────────────────────────────────────────
const C = {
  navy:  "#0A0F1E",
  cyan:  "#00D4FF",
  green: "#00C853",
  amber: "#FFB300",
  red:   "#E53935",
  gray:  "#9E9E9E",
  light: "#F5F5F5",
  white: "#FFFFFF",
  purple:"#9C27B0",
};

function sectionHeader(doc, title, y, accentColor = C.cyan) {
  doc.fillColor(C.navy).fontSize(13).font("Helvetica-Bold").text(title, 50, y);
  doc.moveTo(50, y + 18).lineTo(545, y + 18).strokeColor(accentColor).lineWidth(0.8).stroke();
  return y + 28;
}

function kpiCard(doc, label, value, color, x, y, w = 82) {
  doc.rect(x, y, w, 52).fill(C.light);
  doc.fillColor(C.gray).fontSize(7.5).font("Helvetica").text(label, x + 6, y + 8, { width: w - 10 });
  doc.fillColor(color).fontSize(11).font("Helvetica-Bold").text(value, x + 6, y + 24, { width: w - 10 });
}

export async function runReportingAgent(analytics, insights = [], optimization = null, reportType = "weekly") {
  console.log("[ReportingAgent] Generating PDF…");

  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const reportId = `report-${Date.now()}`;
  const filename = `${reportId}.pdf`;
  const filepath = path.join(REPORTS_DIR, filename);

  const doc = new PDFDocument({ margin: 50, size: "A4" });
  const stream = fs.createWriteStream(filepath);
  doc.pipe(stream);

  const { portfolio, patterns, campaigns } = analytics;

  // ── PAGE 1 ─────────────────────────────────────────────────

  // Header bar
  doc.rect(0, 0, doc.page.width, 75).fill(C.navy);
  doc.fillColor(C.cyan).fontSize(22).font("Helvetica-Bold").text("Admind AI", 50, 18);
  doc.fillColor(C.white).fontSize(10).font("Helvetica").text("Performance Marketing Intelligence", 50, 44);
  doc.fillColor(C.gray).fontSize(8).text(
    `${reportType.toUpperCase()} REPORT  |  Generated: ${new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}`,
    50, 60
  );

  // KPI cards
  let y = sectionHeader(doc, "Portfolio Overview", 90);
  const kpis = [
    { label: "Total Ad Spend",   value: INR(portfolio.totalSpend),     color: C.navy  },
    { label: "Total Revenue",    value: INR(portfolio.totalRevenue),    color: C.green },
    { label: "Avg ROAS",         value: `${portfolio.avgROAS}x`,        color: portfolio.avgROAS >= 3 ? C.green : portfolio.avgROAS >= 1.5 ? C.amber : C.red },
    { label: "Avg CTR",          value: `${portfolio.avgCTR}%`,         color: C.navy  },
    { label: "Avg CAC",          value: INR(portfolio.avgCAC),          color: C.navy  },
    { label: "Conversions",      value: String(portfolio.totalConversions), color: C.green },
  ];
  kpis.forEach((k, i) => kpiCard(doc, k.label, k.value, k.color, 50 + i * 91, y));
  y += 70;

  // Platform breakdown
  y = sectionHeader(doc, "Platform Breakdown", y);
  patterns.platformBreakdown.forEach((p) => {
    const barW = Math.min(Math.round((p.spend / portfolio.totalSpend) * 340), 340);
    doc.rect(50, y, barW, 14).fill(C.cyan);
    doc.fillColor(C.navy).fontSize(8).font("Helvetica-Bold")
      .text(`${p.platform}  —  ROAS ${p.roas}x  |  Spend ${INR(p.spend)}  |  ${p.count} campaigns`, 50, y + 3);
    y += 20;
  });
  y += 10;

  // Campaign table
  y = sectionHeader(doc, "Campaign Performance", y);

  // Table header
  doc.rect(50, y, 496, 18).fill("#DDDDDD");
  const cols = [
    { label: "Campaign",  x: 54,  w: 155 },
    { label: "Platform",  x: 214, w: 55  },
    { label: "Spend",     x: 274, w: 65  },
    { label: "ROAS",      x: 344, w: 42  },
    { label: "CTR",       x: 390, w: 38  },
    { label: "Conv.",     x: 432, w: 40  },
    { label: "Status",    x: 476, w: 66  },
  ];
  cols.forEach((col) =>
    doc.fillColor(C.navy).fontSize(7.5).font("Helvetica-Bold").text(col.label, col.x, y + 5, { width: col.w })
  );
  y += 18;

  const sorted = [...campaigns].sort((a, b) => b.roas - a.roas);
  sorted.forEach((c, i) => {
    if (y > 720) { doc.addPage(); y = 50; }
    if (i % 2 === 0) doc.rect(50, y, 496, 16).fill(C.light);
    const statusColor =
      c.status === "scaling" ? C.green :
      c.status === "pause"   ? C.red   :
      c.status === "review"  ? C.amber : C.navy;

    doc.fillColor(C.navy).fontSize(7.5).font("Helvetica")
      .text(c.campaign_name.substring(0, 26), cols[0].x, y + 4, { width: cols[0].w })
      .text(c.platform || "-",                cols[1].x, y + 4, { width: cols[1].w })
      .text(INR(c.spend),                     cols[2].x, y + 4, { width: cols[2].w });
    doc.fillColor(c.roas >= 3 ? C.green : c.roas < 1 ? C.red : C.navy).font("Helvetica-Bold")
      .text(`${c.roas}x`, cols[3].x, y + 4, { width: cols[3].w });
    doc.fillColor(C.navy).font("Helvetica")
      .text(`${c.ctr}%`,      cols[4].x, y + 4, { width: cols[4].w })
      .text(String(c.conversions), cols[5].x, y + 4, { width: cols[5].w });
    doc.fillColor(statusColor).font("Helvetica-Bold")
      .text(c.status.toUpperCase(), cols[6].x, y + 4, { width: cols[6].w });
    y += 16;
  });

  // ── PAGE 2 ─────────────────────────────────────────────────
  doc.addPage();
  y = 50;

  // AI Insights
  y = sectionHeader(doc, "AI-Generated Insights", y, C.cyan);
  const topInsights = insights.filter((i) => i.impact === "high").slice(0, 6);
  topInsights.forEach((ins) => {
    if (y > 680) { doc.addPage(); y = 50; }
    const catColor =
      ins.category === "performance" ? C.cyan   :
      ins.category === "budget"      ? C.amber  :
      ins.category === "creative"    ? C.purple : C.green;

    doc.rect(50, y, 496, 58).fill(C.light);
    doc.rect(50, y, 3, 58).fill(catColor);
    doc.fillColor(catColor).fontSize(7).font("Helvetica-Bold")
      .text(String(ins.category || "").toUpperCase(), 60, y + 7);
    doc.fillColor(C.navy).fontSize(9).font("Helvetica-Bold")
      .text(ins.title || "", 60, y + 18, { width: 475 });
    doc.fillColor(C.gray).fontSize(8).font("Helvetica")
      .text(ins.detail || "", 60, y + 32, { width: 475 });
    y += 64;
  });

  // Quick Wins
  if (optimization?.quickWins?.length) {
    y += 6;
    y = sectionHeader(doc, "Quick Wins — Act Today", y, C.green);
    optimization.quickWins.forEach((qw) => {
      if (y > 720) { doc.addPage(); y = 50; }
      doc.rect(50, y, 8, 8).fill(C.green);
      doc.fillColor(C.navy).fontSize(9).font("Helvetica")
        .text(qw, 66, y, { width: 470 });
      y += 20;
    });
  }

  // Weekly Priorities
  if (optimization?.weeklyPriorities?.length) {
    y += 6;
    y = sectionHeader(doc, "Weekly Priorities", y, C.amber);
    optimization.weeklyPriorities.forEach((p, i) => {
      if (y > 720) { doc.addPage(); y = 50; }
      doc.fillColor(C.amber).fontSize(11).font("Helvetica-Bold").text(`${i + 1}`, 50, y);
      doc.fillColor(C.navy).fontSize(9).font("Helvetica").text(p, 68, y, { width: 470 });
      y += 20;
    });
  }

  // Footer on each page
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.rect(0, doc.page.height - 36, doc.page.width, 36).fill(C.navy);
    doc.fillColor(C.gray).fontSize(7.5).font("Helvetica")
      .text(
        `Admind AI Marketing Intelligence  |  Report: ${reportId}  |  Confidential  |  Page ${i + 1} of ${range.count}`,
        50, doc.page.height - 22
      );
  }

  doc.end();
  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  console.log(`[ReportingAgent] PDF saved: ${filename}`);
  return { reportId, filename, filepath };
}
