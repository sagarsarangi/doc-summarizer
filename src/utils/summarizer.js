export async function summarizeText(text, focus = "General", customGuidelines = "") {
  let systemPrompt = `You are a thorough document analyzer. Your job is to extract ALL important information from the document and organize it with the bullet symbol •`;

  // If custom guidelines exist, make them the TOP PRIORITY
  if (customGuidelines.trim()) {
    systemPrompt += `

🚨 CRITICAL: CUSTOM GUIDELINES OVERRIDE ALL OTHER INSTRUCTIONS 🚨
USER CUSTOM GUIDELINES (MUST BE FOLLOWED EXACTLY):
${customGuidelines}

GUIDELINE COMPLIANCE RULES:
- If user specifies character/word limits, COUNT as you write and STOP when limit is reached
- If user requests specific format, follow it exactly (ignore default bullet format if conflicted)
- If user asks for specific tone/style, use that instead of default
- If user wants shorter summaries, prioritize only the most critical points
- Custom guidelines are MORE IMPORTANT than the default instructions below
- When in doubt between custom guidelines and default rules, ALWAYS choose custom guidelines

BEFORE RESPONDING: Ask yourself "Am I following the user's custom guidelines exactly?"`;
  }

  systemPrompt += `

MAIN PRIORITY: ${focus} (this gets the most detailed coverage)
SECONDARY PRIORITY: Everything else (if space/guidelines allow)

MANDATORY PROCESS:
1. First: Check if custom guidelines specify length limits - if yes, plan accordingly
2. Scan document and identify all sections/topics
3. Extract content related to ${focus} with priority
4. Extract other important information based on remaining space/guidelines
5. Create bullets for each distinct point
6. Include important numbers, statistics, dates, names, facts
7. FINAL CHECK: Does this meet the custom guidelines exactly?

DEFAULT ORGANIZATION STRUCTURE (unless custom guidelines specify otherwise):

FOCUS AREA: ${focus}
• [Key details about ${focus}]
• [Data and examples related to ${focus}]

OTHER IMPORTANT CONTENT:
• [Main points from document]
• [Supporting details and conclusions]

FORMATTING RULES (unless custom guidelines override):
• Use ONLY the bullet symbol • for content points
• NEVER use dashes (-), asterisks (*), or bold formatting
• Write in plain text only
• One main idea per bullet point

${
  customGuidelines.trim()
    ? `
REMEMBER: Your response MUST comply with the custom guidelines above. If they conflict with these default rules, follow the custom guidelines instead.
`
    : `
QUALITY GUIDELINES:
- Aim for comprehensive coverage (15-30 bullets for most documents)
- Include all numbers, percentages, dates exactly as stated
- Cover every major section of the document
- Each bullet should contain one clear, complete idea
`
}

ERROR PREVENTION:
- If custom guidelines specify character limits, count characters as you write
- If guidelines ask for brevity, focus only on the most critical information
- Stop writing when custom limits are reached, even mid-sentence if necessary
- Double-check final response against custom guidelines before submitting`;
  
  
  const payload = {
    model: "google/gemini-2.5-flash-lite-preview-06-17", // You can switch models later
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: text },
    ],
  };

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (response.status === 429) {
    const data = await response.json();
    throw new Error("Rate limit exceeded: " + data?.error?.message);
  }

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("❌ API error:", response.status, errorBody);
    throw new Error("API request failed: " + response.statusText);
  }
  
  
  const result = await response.json();
  console.log("🔍 API result:", result);

  if (result?.choices?.[0]?.message?.content) {
    return result.choices[0].message.content.trim();
  } else {
    throw new Error("Summarization failed");
  }
}
// Save TXT
export const exportAsTxt = (text) => {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  downloadFile(url, "summary.txt");
};

// Save JSON
export const exportAsJson = (text) => {
  const json = JSON.stringify({ summary: text }, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  downloadFile(url, "summary.json");
};

// Save DOCX using Blob (works with text-based summaries)
import { Document, Packer, Paragraph, TextRun } from "docx";

export const exportAsDocx = async (text) => {
  const lines = text.split("\n");
  const paragraphs = lines.map(
    (line) =>
      new Paragraph({
        children: [new TextRun({ text: line, font: "Calibri", size: 24 })],
      })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);

  downloadFile(url, "summary.docx");
};


// Helper to trigger download
function downloadFile(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
