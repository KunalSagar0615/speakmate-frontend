import { jsPDF } from "jspdf";
import { formatMode } from "../utils/constants";

const MARGIN = 14;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const FOOTER_ZONE = 262;
const LINE_HEIGHT = 5.5;

const COLORS = {
  headerBg: [30, 58, 95],
  headerText: [255, 255, 255],
  strengthsBg: [220, 252, 231],
  improvementBg: [254, 226, 226],
  recommendationsBg: [219, 234, 254],
  answerBg: [243, 244, 246],
  feedbackBg: [209, 250, 229],
  questionText: [29, 78, 216],
  bodyText: [31, 41, 55],
  mutedText: [107, 114, 128],
  footerText: [100, 116, 139],
  separator: [203, 213, 225],
};

const getQuestion = (item) => item?.aiQuestion || item?.question || "";
const getAnswer = (item) => item?.userAnswer ?? item?.answer ?? "";
const getFeedback = (item) => item?.aiFeedback || item?.feedback || "";

const hasAnswer = (item) => {
  const answer = getAnswer(item);
  return answer != null && String(answer).trim() !== "";
};

const addFooters = (doc) => {
  const pageCount = doc.getNumberOfPages();
  const pageHeight = doc.internal.pageSize.height;

  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setDrawColor(...COLORS.separator);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, pageHeight - 24, PAGE_WIDTH - MARGIN, pageHeight - 24);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.footerText);

    const note =
      "Note: Unanswered questions may not appear in this report if the session was ended before a response was submitted.";
    const contact =
      "For suggestions, improvements, or support regarding SpeakMate AI Friend, please contact us at 7249176496.";

    doc.text(note, MARGIN, pageHeight - 18, { maxWidth: CONTENT_WIDTH });
    doc.text(contact, MARGIN, pageHeight - 11, { maxWidth: CONTENT_WIDTH });
  }
};

const ensureSpace = (doc, y, needed) => {
  if (y + needed > FOOTER_ZONE) {
    doc.addPage();
    return 20;
  }
  return y;
};

const wrapAndDraw = (doc, text, x, y, maxWidth, lineHeight = LINE_HEIGHT) => {
  const lines = doc.splitTextToSize(String(text || ""), maxWidth);
  lines.forEach((line) => {
    y = ensureSpace(doc, y, lineHeight);
    doc.text(line, x, y);
    y += lineHeight;
  });
  return y;
};

const drawFilledBox = (doc, x, y, width, height, rgb) => {
  doc.setFillColor(...rgb);
  doc.roundedRect(x, y, width, height, 2, 2, "F");
};

const drawSectionBox = (doc, title, content, y, bgColor) => {
  if (!content || !String(content).trim()) return y;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.bodyText);
  y = ensureSpace(doc, y, 14);
  doc.text(title, MARGIN, y);
  y += 7;

  const lines = doc.splitTextToSize(String(content), CONTENT_WIDTH - 8);
  const boxHeight = lines.length * LINE_HEIGHT + 8;
  y = ensureSpace(doc, y, boxHeight + 4);

  drawFilledBox(doc, MARGIN, y - 4, CONTENT_WIDTH, boxHeight, bgColor);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.bodyText);

  let textY = y + 2;
  lines.forEach((line) => {
    doc.text(line, MARGIN + 4, textY);
    textY += LINE_HEIGHT;
  });

  return y + boxHeight + 6;
};

const drawHeader = (doc, session, totalQuestions) => {
  doc.setFillColor(...COLORS.headerBg);
  doc.rect(0, 0, PAGE_WIDTH, 52, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...COLORS.headerText);
  doc.text("SpeakMate AI Session Report", MARGIN, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const meta = [
    `Topic: ${session.topic || "N/A"}`,
    `Mode: ${session.mode || "N/A"}`,
    `Status: ${session.status || "N/A"}`,
    `Report Generated: ${new Date().toLocaleString()}`,
    `Total Questions: ${totalQuestions}`,
  ];
  meta.forEach((line, i) => {
    doc.text(line, MARGIN, 28 + i * 5);
  });

  return 62;
};

export const reportService = {
  downloadPdf: (session, conversations = [], aiReport = null) => {
    const doc = new jsPDF();
    const answered = conversations.filter(hasAnswer);
    const totalQuestions = answered.length;

    let y = drawHeader(doc, session, totalQuestions);

    if (aiReport) {
      y = ensureSpace(doc, y, 12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...COLORS.bodyText);
      doc.text("AI Analysis", MARGIN, y);
      y += 10;

      if (aiReport.overallEvaluation) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        y = ensureSpace(doc, y, 10);
        doc.text("Overall Evaluation", MARGIN, y);
        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        y = wrapAndDraw(doc, aiReport.overallEvaluation, MARGIN, y, CONTENT_WIDTH);
        y += 4;
      }

      y = drawSectionBox(doc, "Strengths", aiReport.strengths, y, COLORS.strengthsBg);
      y = drawSectionBox(
        doc,
        "Areas Of Improvement",
        aiReport.areasOfImprovement,
        y,
        COLORS.improvementBg
      );
      y = drawSectionBox(
        doc,
        "Recommendations",
        aiReport.recommendations,
        y,
        COLORS.recommendationsBg
      );
    }

    y = ensureSpace(doc, y, 14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...COLORS.bodyText);
    doc.text("Conversation History", MARGIN, y);
    y += 10;

    answered.forEach((item, index) => {
      const question = getQuestion(item);
      const answer = getAnswer(item);
      const feedback = getFeedback(item);

      y = ensureSpace(doc, y, 20);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...COLORS.questionText);
      doc.text(`Question ${index + 1}`, MARGIN, y);
      y += 6;
      y = wrapAndDraw(doc, question, MARGIN, y, CONTENT_WIDTH, LINE_HEIGHT);
      y += 3;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.bodyText);
      y = ensureSpace(doc, y, 8);
      doc.text("Answer", MARGIN, y);
      y += 5;

      const answerLines = doc.splitTextToSize(String(answer), CONTENT_WIDTH - 8);
      const answerBoxHeight = answerLines.length * LINE_HEIGHT + 8;
      y = ensureSpace(doc, y, answerBoxHeight + 4);
      drawFilledBox(doc, MARGIN, y - 3, CONTENT_WIDTH, answerBoxHeight, COLORS.answerBg);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      let answerY = y + 2;
      answerLines.forEach((line) => {
        doc.text(line, MARGIN + 4, answerY);
        answerY += LINE_HEIGHT;
      });
      y += answerBoxHeight + 4;

      if (feedback && String(feedback).trim()) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        y = ensureSpace(doc, y, 8);
        doc.text("Feedback", MARGIN, y);
        y += 5;

        const feedbackLines = doc.splitTextToSize(String(feedback), CONTENT_WIDTH - 8);
        const feedbackBoxHeight = feedbackLines.length * LINE_HEIGHT + 8;
        y = ensureSpace(doc, y, feedbackBoxHeight + 4);
        drawFilledBox(doc, MARGIN, y - 3, CONTENT_WIDTH, feedbackBoxHeight, COLORS.feedbackBg);
        doc.setFont("helvetica", "normal");
        let feedbackY = y + 2;
        feedbackLines.forEach((line) => {
          doc.text(line, MARGIN + 4, feedbackY);
          feedbackY += LINE_HEIGHT;
        });
        y += feedbackBoxHeight + 6;
      }

      y += 4;
    });

    addFooters(doc);
    const safeTopic = (session.topic || "session").replace(/[^\w\- ]/g, "").trim().slice(0, 30);
    doc.save(`speakmate-report-${safeTopic}-${session.id || Date.now()}.pdf`);
  },

  getAnsweredConversations: (conversations = []) => conversations.filter(hasAnswer),
};
