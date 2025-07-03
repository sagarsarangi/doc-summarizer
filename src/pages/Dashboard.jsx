// hello niggers
import { useState } from "react";
import {
  summarizeText,
  exportAsTxt,
  exportAsDocx,
  exportAsJson,
} from "../utils/summarizer";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import { useRef } from "react";
import bb from "./cc.jpg";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export default function Dashboard() {
  const [mode, setMode] = useState("text");
  const fileInputRef = useRef(null);
  const [customGuidelines, setCustomGuidelines] = useState("");

  const [textInput, setTextInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [focusArea, setFocusArea] = useState("General");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return; // 🛡️ prevents errors when input is cleared

    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "pdf" || ext === "docx") {
      setFileType("document");
      setSelectedFile(file);
    } else if (ext === "xlsx") {
      setFileType("excel");
      setSelectedFile(file);
    } else {
      alert("Unsupported file type");
      setSelectedFile(null); // 🔁 reset on bad file
      setFileType(null);
    }
  };

  const extractPdfText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      text += strings.join(" ") + "\n";
    }
    return text;
  };

  const extractDocxText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const extractExcelData = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    return jsonData.map((row) => row.join(" | ")).join("\n");
  };

  const handleProcess = async () => {
    setSummary("");
    console.log("Focus:", focusArea);

    try {
      setLoading(true);

      if (mode === "text" && textInput.trim()) {
        const result = await summarizeText(
          textInput,
          focusArea,
          customGuidelines
        );
        setSummary(result);
      } else if (mode === "file" && selectedFile) {
        let extractedText = "";

        if (fileType === "document") {
          if (selectedFile.name.endsWith(".pdf")) {
            extractedText = await extractPdfText(selectedFile);
          } else if (selectedFile.name.endsWith(".docx")) {
            extractedText = await extractDocxText(selectedFile);
          } else {
            alert("Unsupported document type.");
            return;
          }
        } else if (fileType === "excel") {
          extractedText = await extractExcelData(selectedFile);
        } else {
          alert("Unsupported file type.");
          return;
        }

        const result = await summarizeText(
          extractedText,
          focusArea,
          customGuidelines
        );
        setSummary(result);
      } else {
        alert("Please provide input for the selected mode.");
      }
    } catch (err) {
      alert(err.message || "Processing failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Summary copied to clipboard");
  };
  const isClearDisabled = summary.trim().length === 0;

  return (
    <div
      className="fixed inset-0 bg-cover bg-center bg-no-repeat to-black overflow-auto"
      style={{
        backgroundImage: `url(${bb})`, // ✅ correct
      }}
    >
      {/* Main Grid Layout */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:h-screen gap-6 p-6 overflow-auto">
        {/* Left Panel - Input Controls */}
        <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl flex flex-col overflow-hidden max-h-full">
          <h3 className="text-[1.3rem] font-semibold text-white mb-6  border-gray-700/50 pb-3">
            Input Configuration
          </h3>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto pr-5">
            {/* Focus Area Selection */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-3">
                Select Focus Area
              </label>
              <div className="relative">
                <select
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full bg-gray-800/70 border border-gray-600/50 text-white px-4 py-3 rounded-xl 
                  focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500 
                  transition-all duration-200 appearance-none cursor-pointer
                  hover:bg-gray-700/70 hover:border-gray-500/70
                  backdrop-blur-sm shadow-lg"
                >
                  <option
                    value="General"
                    className="bg-gray-800 text-white py-2"
                  >
                    General
                  </option>
                  <option
                    value="Finance"
                    className="bg-gray-800 text-white py-2"
                  >
                    Finance
                  </option>
                  <option
                    value="Business"
                    className="bg-gray-800 text-white py-2"
                  >
                    Business
                  </option>
                  <option
                    value="Technology"
                    className="bg-gray-800 text-white py-2"
                  >
                    Technology
                  </option>
                  <option
                    value="Healthcare"
                    className="bg-gray-800 text-white py-2"
                  >
                    Healthcare
                  </option>
                  <option
                    value="Education"
                    className="bg-gray-800 text-white py-2"
                  >
                    Education
                  </option>
                  <option
                    value="General Knowledge"
                    className="bg-gray-800 text-white py-2"
                  >
                    General Knowledge
                  </option>
                  <option
                    value="Marketing"
                    className="bg-gray-800 text-white py-2"
                  >
                    Marketing
                  </option>
                </select>

                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Custom Guidelines */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Optional Custom Guidelines
              </label>
              <textarea
                value={customGuidelines}
                onChange={(e) => setCustomGuidelines(e.target.value)}
                rows="4"
                className="w-full bg-gray-700/30 border border-gray-600 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none h-21"
                placeholder="Example: Use simpler language. Group by date. Add hashtags."
              />
            </div>

            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-3">
                Input Mode
              </label>
              <div className="flex p-1 bg-gray-700/30 rounded-xl border border-gray-600/50">
                <button
                  onClick={() => setMode("text")}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium mr-3 transition-all duration-200 ${
                    mode === "text"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-gray-600/50"
                  }`}
                >
                  Text
                </button>
                <button
                  onClick={() => setMode("file")}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    mode === "file"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-gray-600/50"
                  }`}
                >
                  File Upload
                </button>
              </div>
            </div>

            {/* Input Area */}
            <div className="mb-6">
              {mode === "text" && (
                <div className="space-y-4">
                  <label className="block text-gray-300 text-md font-medium">
                    Enter Text
                  </label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    rows="8"
                    className="w-full bg-gray-700/30 border border-gray-600 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    placeholder="Paste or type your text here..."
                  />
                </div>
              )}

              {mode === "file" && (
                <div className="space-y-3">
                  <label className="block text-gray-300 text-sm font-medium">
                    Upload File (PDF / DOCX / XLSX)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="bg-gray-700/30 border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-gray-700/50 transition-all duration-200">
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-6 h-6 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-300 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-gray-500 text-sm">
                        Supports PDF, DOCX, and XLSX files
                      </p>
                    </div>
                  </div>
                  {selectedFile && (
                    <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 px-3 py-2 rounded-lg border border-green-400/20">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Selected: {selectedFile.name}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex gap-4 pt-4  border-gray-700/50">
            <button
              onClick={handleProcess}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-medium py-3 md:py-4 px-4 md:px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg text-base md:text-lg"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Process"
              )}
            </button>

            <button
              onClick={() => setSummary("")}
              disabled={isClearDisabled}
              className={`w-full py-2 md:py-3 px-4 md:px-6 rounded-xl font-medium transition-all duration-200 shadow-md
    ${isClearDisabled ? "opacity-60" : "hover:shadow-lg"}`}
              style={{
                backgroundColor: isClearDisabled ? "#FCA5A5" : "#DC2626",
                color: isClearDisabled ? "#FEE2E2" : "#FFFFFF",
                cursor: isClearDisabled ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isClearDisabled) {
                  e.target.style.backgroundColor = "#B91C1C";
                }
              }}
              onMouseLeave={(e) => {
                if (!isClearDisabled) {
                  e.target.style.backgroundColor = "#DC2626";
                }
              }}
            >
              Clear Summary
            </button>
          </div>
        </div>

        {/* Right Panel - Output Area */}
        <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-7 shadow-2xl flex flex-col overflow-hidden max-h-full">
          <div className="flex justify-between items-center mb-4 border-gray-700/50 pb-2">
            <h3 className="text-xl font-semibold text-white">Summary Output</h3>

            {summary && (
              <div className="flex items-center gap-3">
                {/* Copy Button */}
                <button
                  onClick={() => copyToClipboard(summary)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md border-0"
                  style={{ backgroundColor: "#16a34a", color: "#ffffff" }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#15803d";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#16a34a";
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy
                </button>

                {/* Export Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => exportAsTxt(summary)}
                    className="py-2 px-3 rounded-lg text-sm font-medium shadow-md transition-all duration-200 border-0"
                    style={{ backgroundColor: "#374151", color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#4b5563";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#374151";
                    }}
                  >
                    TXT
                  </button>
                  <button
                    onClick={() => exportAsDocx(summary)}
                    className="py-2 px-3 rounded-lg text-sm font-medium shadow-md transition-all duration-200 border-0"
                    style={{ backgroundColor: "#1d4ed8", color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#1e40af";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#1d4ed8";
                    }}
                  >
                    DOCX
                  </button>
                  <button
                    onClick={() => exportAsJson(summary)}
                    className="py-2 px-3 rounded-lg text-sm font-medium shadow-md transition-all duration-200 border-0"
                    style={{ backgroundColor: "#7c3aed", color: "#ffffff" }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#6d28d9";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#7c3aed";
                    }}
                  >
                    JSON
                  </button>
                </div>
              </div>
            )}
          </div>

          {summary ? (
            <div className="flex-1 bg-gray-900/50 rounded-lg p-4 border border-gray-700/50 overflow-y-auto relative">
              <div className="h-full overflow-y-auto pb-10">
                <pre className="text-gray-100 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                  {summary}
                </pre>
              </div>
              {/* Character Count */}
              <div className="absolute bottom-0 right-0 bg-black px-3 py-2 rounded text-sm text-gray-150 border border-gray-600/50">
                {summary.length} characters
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-900/30 rounded-lg border-2 border-dashed border-gray-700/50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 text-lg mb-2">
                  No summary generated yet
                </p>
                <p className="text-gray-500 text-sm">
                  Configure your input and click "Process" to generate a summary
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
