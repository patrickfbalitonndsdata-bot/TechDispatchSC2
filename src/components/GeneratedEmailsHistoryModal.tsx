import React, { useState } from "react";
import {
  X,
  Mail,
  Search,
  Trash2,
  Download,
  Calendar,
  User,
  History,
  Sparkles,
  Copy,
  Check,
  Eye,
  Paperclip,
} from "lucide-react";
import { GeneratedEmailRecord } from "../utils/generatedEmailStorage";
import { cleanTechnicianName, copyRichHtmlToClipboard } from "../utils/outlookTemplateGenerator";
import { EmailViewerModal } from "./EmailViewerModal";
import { useTheme } from "../context/ThemeContext";
import { KyleCardBorderArt } from "./KyleCardBorderArt";

interface GeneratedEmailsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedEmailRecord[];
  activeTechName?: string;
  activeWorkWeek?: string;
  onDeleteRecord: (id: string) => void;
  onClearTechHistory?: (techName: string, workWeek?: string) => void;
  onLoadSavedEmailIntoGenerator?: (record: GeneratedEmailRecord) => void;
}

export const GeneratedEmailsHistoryModal: React.FC<GeneratedEmailsHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  activeTechName,
  activeWorkWeek,
  onDeleteRecord,
  onClearTechHistory,
  onLoadSavedEmailIntoGenerator,
}) => {
  const { isDarkMode, activeHolidaySeason, holidayConfig } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTech, setFilterTech] = useState<string>(activeTechName ? "current" : "all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedHtmlId, setCopiedHtmlId] = useState<string | null>(null);
  const [confirmClearTech, setConfirmClearTech] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<GeneratedEmailRecord | null>(null);

  if (!isOpen) return null;

  const cleanActiveTech = activeTechName ? cleanTechnicianName(activeTechName).toLowerCase() : "";

  const filteredHistory = history.filter((item) => {
    if (filterTech === "current" && cleanActiveTech) {
      if (item.cleanTechName.toLowerCase() !== cleanActiveTech) return false;
    }

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.technicianName.toLowerCase().includes(term) ||
      item.cleanTechName.toLowerCase().includes(term) ||
      item.workWeek.toLowerCase().includes(term) ||
      item.subject.toLowerCase().includes(term) ||
      String(item.version).toLowerCase().includes(term) ||
      (item.notes && item.notes.toLowerCase().includes(term))
    );
  });

  const handleCopySubject = (id: string, text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyHtml = async (item: GeneratedEmailRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!item.htmlContent) return;
    const success = await copyRichHtmlToClipboard(item.htmlContent, item.plainTextContent || "");
    if (success) {
      setCopiedHtmlId(item.id);
      setTimeout(() => setCopiedHtmlId(null), 2500);
    }
  };

  const handleExportCsv = () => {
    if (filteredHistory.length === 0) return;
    const headers = ["Timestamp", "Technician", "Work Week", "Version", "Subject", "Method", "Notes"];
    const rows = filteredHistory.map((r) => [
      `"${r.dateFormatted}"`,
      `"${r.cleanTechName}"`,
      `"${r.workWeek}"`,
      `"${r.version}"`,
      `"${r.subject.replace(/"/g, '""')}"`,
      `"${r.exportMethod}"`,
      `"${(r.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvText = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Generated_Emails_History_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div
          className={`rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border overflow-hidden transition-colors ${
            isDarkMode
              ? "bg-[#08150D] border-[#00FF41]/40 shadow-[0_0_30px_rgba(0,255,65,0.25)] text-[#D2FAD7]"
              : activeHolidaySeason === "kyle"
              ? "bg-[#FFFDF9] border-2 border-[#D8C4A9] shadow-[#8B5A2B]/20 text-[#361F0E]"
              : activeHolidaySeason === "halloween"
              ? "bg-white border-2 border-orange-300 shadow-orange-950/20 text-orange-950"
              : activeHolidaySeason === "christmas_eve"
              ? "bg-white border-2 border-blue-300 shadow-blue-950/20 text-blue-950"
              : activeHolidaySeason === "christmas"
              ? "bg-white border-2 border-emerald-300 shadow-emerald-950/20 text-stone-900"
              : activeHolidaySeason === "new_year"
              ? "bg-white border-2 border-amber-300 shadow-amber-950/20 text-amber-950"
              : "bg-white border-[#CFE0B8] text-[#3F4A33]"
          }`}
        >
          {/* Cute Bread and Coffee Border Art for Kyle Theme */}
          <KyleCardBorderArt label="Generated Email History" />

          {/* Modal Header */}
          <div
            className={`px-6 py-4 flex items-center justify-between border-b transition-colors ${
              isDarkMode
                ? "bg-[#040906] text-white border-[#00FF41]/30"
                : activeHolidaySeason === "kyle"
                ? "bg-[#3D2314] text-white border-[#D8C4A9]/40"
                : activeHolidaySeason === "halloween"
                ? "bg-[#2A130A] text-white border-orange-400/40"
                : activeHolidaySeason === "christmas_eve"
                ? "bg-[#0F1E36] text-white border-amber-300/40"
                : activeHolidaySeason === "christmas"
                ? "bg-[#143E23] text-white border-red-400/40"
                : activeHolidaySeason === "new_year"
                ? "bg-[#1E1B4B] text-white border-yellow-300/40"
                : "bg-[#3F4A33] text-white border-[#CFE0B8]/30"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold border shadow-xs ${
                  isDarkMode
                    ? "bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/40"
                    : activeHolidaySeason === "kyle"
                    ? "bg-[#8B5A2B] text-white border-[#D8C4A9]"
                    : activeHolidaySeason === "halloween"
                    ? "bg-orange-600 text-white border-orange-400"
                    : activeHolidaySeason === "christmas_eve"
                    ? "bg-amber-600 text-white border-amber-400"
                    : activeHolidaySeason === "christmas"
                    ? "bg-emerald-600 text-white border-emerald-400"
                    : activeHolidaySeason === "new_year"
                    ? "bg-amber-600 text-white border-amber-400"
                    : "bg-[#8AA66B]/30 text-[#EDF3E3] border-[#CFE0B8]/30"
                }`}
              >
                <History className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-sm font-bold text-white">Generated Email Version History</h2>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                      isDarkMode
                        ? "bg-[#00FF41]/20 text-[#00FF41] border-[#00FF41]/50 font-mono shadow-[0_0_8px_rgba(0,255,65,0.25)]"
                        : activeHolidaySeason === "kyle"
                        ? "bg-[#FAF4EB] text-[#5C3A21] border-[#D8C4A9] shadow-xs"
                        : activeHolidaySeason !== "standard"
                        ? "bg-white/20 text-white border-white/40 shadow-xs"
                        : "bg-[#EDF3E3] text-[#3F4A33] border-[#CFE0B8]"
                    }`}
                  >
                    {activeHolidaySeason !== "standard" && !isDarkMode && `${holidayConfig.emoji} `}
                    {history.length} Saved
                  </span>
                </div>
                <p className={`text-xs ${isDarkMode ? "text-[#D2FAD7]/80" : "text-[#EDF3E3]/80"}`}>
                  Tracking all generated Outlook schedules to auto-detect update versions per technician
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition cursor-pointer ${
                isDarkMode
                  ? "text-[#00FF41] hover:text-white hover:bg-[#00FF41]/20"
                  : "text-[#CFE0B8] hover:text-white hover:bg-white/10"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toolbar & Filters */}
          <div
            className={`p-4 border-b flex flex-col sm:flex-row items-center justify-between gap-3 text-xs transition-colors ${
              isDarkMode
                ? "bg-[#040906]/90 border-[#00FF41]/30 text-[#D2FAD7]"
                : activeHolidaySeason === "kyle"
                ? "bg-[#FAF4EB] border-[#D8C4A9] text-[#361F0E]"
                : activeHolidaySeason === "halloween"
                ? "bg-orange-50 border-orange-200 text-orange-950"
                : activeHolidaySeason === "christmas_eve"
                ? "bg-blue-50 border-blue-200 text-blue-950"
                : activeHolidaySeason === "christmas"
                ? "bg-emerald-50 border-emerald-200 text-stone-900"
                : activeHolidaySeason === "new_year"
                ? "bg-amber-50 border-amber-200 text-amber-950"
                : "bg-[#FBF7F0] border-[#CFE0B8] text-[#3F4A33]"
            }`}
          >
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search
                  className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                    isDarkMode
                      ? "text-[#00FF41]"
                      : activeHolidaySeason === "kyle"
                      ? "text-[#8B5A2B]"
                      : "text-zinc-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search subject, week, tech..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs focus:outline-hidden focus:ring-2 ${
                    isDarkMode
                      ? "bg-[#08150D] border border-[#00FF41]/40 text-[#E0FFE5] placeholder:text-[#D2FAD7]/40 focus:ring-[#00FF41]"
                      : activeHolidaySeason === "kyle"
                      ? "bg-white border border-[#D8C4A9] text-[#361F0E] placeholder:text-[#8B5A2B]/40 focus:ring-[#8B5A2B]"
                      : activeHolidaySeason === "halloween"
                      ? "bg-white border border-orange-300 text-orange-950 focus:ring-orange-500"
                      : "bg-white border border-[#CFE0B8] text-[#3F4A33] focus:ring-[#8AA66B]"
                  }`}
                />
              </div>

              {activeTechName && (
                <select
                  value={filterTech}
                  onChange={(e) => setFilterTech(e.target.value)}
                  className={`rounded-xl px-2.5 py-1.5 text-xs focus:outline-hidden focus:ring-2 cursor-pointer ${
                    isDarkMode
                      ? "bg-[#08150D] border border-[#00FF41]/40 text-[#E0FFE5] focus:ring-[#00FF41]"
                      : activeHolidaySeason === "kyle"
                      ? "bg-white border border-[#D8C4A9] text-[#361F0E] focus:ring-[#8B5A2B]"
                      : "bg-white border border-[#CFE0B8] text-[#3F4A33] focus:ring-[#8AA66B]"
                  }`}
                >
                  <option value="current">{cleanTechnicianName(activeTechName)} Only</option>
                  <option value="all">All Technicians ({history.length})</option>
                </select>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleExportCsv}
                disabled={filteredHistory.length === 0}
                className={`flex items-center space-x-1 font-semibold px-3 py-1.5 rounded-xl border transition cursor-pointer disabled:opacity-50 ${
                  isDarkMode
                    ? "bg-[#0C1E12] hover:bg-[#00FF41]/20 text-[#00FF41] border-[#00FF41]/40 font-mono shadow-[0_0_8px_rgba(0,255,65,0.2)]"
                    : activeHolidaySeason === "kyle"
                    ? "bg-white hover:bg-[#FAF4EB] text-[#5C3A21] border-[#D8C4A9] shadow-xs"
                    : "text-[#3F4A33] bg-white hover:bg-[#EDF3E3] border-[#CFE0B8]"
                }`}
              >
                <Download
                  className={`w-3.5 h-3.5 ${
                    isDarkMode
                      ? "text-[#00FF41]"
                      : activeHolidaySeason === "kyle"
                      ? "text-[#8B5A2B]"
                      : "text-[#8AA66B]"
                  }`}
                />
                <span>Export CSV</span>
              </button>

              {onClearTechHistory && activeTechName && (
                <button
                  onClick={() => {
                    if (confirmClearTech) {
                      onClearTechHistory(activeTechName, activeWorkWeek);
                      setConfirmClearTech(false);
                    } else {
                      setConfirmClearTech(true);
                      setTimeout(() => setConfirmClearTech(false), 4000);
                    }
                  }}
                  className={`flex items-center space-x-1 font-semibold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                    confirmClearTech
                      ? "bg-red-600 text-white border-red-700 animate-pulse"
                      : isDarkMode
                      ? "text-rose-400 bg-rose-950/40 hover:bg-rose-950/70 border-rose-800"
                      : "text-red-600 bg-red-50 hover:bg-red-100 border-red-200"
                  }`}
                  title="Clear all generated email records for this technician"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{confirmClearTech ? "Confirm Clear?" : "Clear Tech History"}</span>
                </button>
              )}
            </div>
          </div>

          {/* History List */}
          <div
            className={`flex-1 overflow-y-auto p-4 space-y-2.5 transition-colors ${
              isDarkMode
                ? "bg-[#040906]/60"
                : activeHolidaySeason === "kyle"
                ? "bg-[#FAF4EB]/40"
                : activeHolidaySeason === "halloween"
                ? "bg-orange-50/30"
                : "bg-[#FBF7F0]/30"
            }`}
          >
            {filteredHistory.length === 0 ? (
              <div className="text-center py-16">
                <History
                  className={`w-10 h-10 mx-auto mb-2 ${
                    isDarkMode
                      ? "text-[#00FF41]/40"
                      : activeHolidaySeason === "kyle"
                      ? "text-[#8B5A2B]/40"
                      : "text-[#8AA66B]/50"
                  }`}
                />
                <p
                  className={`text-sm font-semibold ${
                    isDarkMode
                      ? "text-[#E0FFE5]"
                      : activeHolidaySeason === "kyle"
                      ? "text-[#5C3A21]"
                      : "text-[#3F4A33]"
                  }`}
                >
                  No generated emails found
                </p>
                <p
                  className={`text-xs mt-1 max-w-md mx-auto ${
                    isDarkMode
                      ? "text-[#D2FAD7]/80"
                      : activeHolidaySeason === "kyle"
                      ? "text-[#78593F]"
                      : "text-zinc-500"
                  }`}
                >
                  When you generate, copy, or download an Outlook email for a technician, it will be saved here in local storage to automatically track update versions.
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl p-3.5 shadow-2xs transition space-y-2 group border ${
                    isDarkMode
                      ? "bg-[#08150D]/90 border-[#00FF41]/30 hover:border-[#00FF41]/60 text-[#D2FAD7] shadow-[0_0_15px_rgba(0,255,65,0.08)]"
                      : activeHolidaySeason === "kyle"
                      ? "bg-white border-[#D8C4A9] hover:border-[#8B5A2B] text-[#361F0E] shadow-xs"
                      : activeHolidaySeason === "halloween"
                      ? "bg-white border-orange-200 hover:border-orange-400 text-orange-950 shadow-xs"
                      : "bg-white border-[#CFE0B8] hover:border-[#8AA66B] text-[#3F4A33]"
                  }`}
                >
                  <div
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2 ${
                      isDarkMode
                        ? "border-[#00FF41]/20"
                        : activeHolidaySeason === "kyle"
                        ? "border-[#D8C4A9]/40"
                        : "border-[#CFE0B8]/40"
                    }`}
                  >
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span
                        className={`border font-black px-2.5 py-0.5 rounded-lg text-xs ${
                          isDarkMode
                            ? "bg-[#00FF41]/20 text-[#00FF41] border-[#00FF41]/50 font-mono shadow-[0_0_8px_rgba(0,255,65,0.2)]"
                            : activeHolidaySeason === "kyle"
                            ? "bg-[#FAF4EB] text-[#5C3A21] border-[#D8C4A9] font-bold"
                            : activeHolidaySeason === "halloween"
                            ? "bg-orange-100 text-orange-900 border-orange-300"
                            : "bg-[#EDF3E3] text-[#3F4A33] border-[#CFE0B8]"
                        }`}
                      >
                        {String(item.version).toLowerCase().includes("v") ||
                        String(item.version).toLowerCase().includes("update") ||
                        String(item.version).toLowerCase().includes("version")
                          ? item.version
                          : `Version ${item.version}`}
                      </span>
                      <span
                        className={`font-bold text-xs flex items-center space-x-1 ${
                          isDarkMode
                            ? "text-[#E0FFE5]"
                            : activeHolidaySeason === "kyle"
                            ? "text-[#361F0E]"
                            : "text-[#3F4A33]"
                        }`}
                      >
                        <User
                          className={`w-3.5 h-3.5 ${
                            isDarkMode
                              ? "text-[#00FF41]"
                              : activeHolidaySeason === "kyle"
                              ? "text-[#8B5A2B]"
                              : "text-[#8AA66B]"
                          }`}
                        />
                        <span>{item.cleanTechName}</span>
                      </span>
                      <span
                        className={`${
                          isDarkMode
                            ? "text-[#00FF41]"
                            : activeHolidaySeason === "kyle"
                            ? "text-[#8B5A2B]"
                            : "text-[#8AA66B]"
                        } text-xs`}
                      >
                        •
                      </span>
                      <span
                        className={`text-xs flex items-center space-x-1 ${
                          isDarkMode
                            ? "text-[#D2FAD7]"
                            : activeHolidaySeason === "kyle"
                            ? "text-[#78593F]"
                            : "text-[#3F4A33]/80"
                        }`}
                      >
                        <Calendar
                          className={`w-3.5 h-3.5 ${
                            isDarkMode
                              ? "text-[#00FF41]"
                              : activeHolidaySeason === "kyle"
                              ? "text-[#8B5A2B]"
                              : "text-[#8AA66B]"
                          }`}
                        />
                        <span>{item.workWeek}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span
                        className={`text-[11px] font-mono ${
                          isDarkMode
                            ? "text-[#D2FAD7]/70"
                            : activeHolidaySeason === "kyle"
                            ? "text-[#8B5A2B]/70"
                            : "text-zinc-500"
                        }`}
                      >
                        {item.dateFormatted}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                          isDarkMode
                            ? "bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/30 font-mono"
                            : activeHolidaySeason === "kyle"
                            ? "bg-[#FAF4EB] text-[#5C3A21] border-[#D8C4A9]"
                            : "bg-[#EDF3E3] text-[#3F4A33] border-[#CFE0B8]"
                        }`}
                      >
                        {item.exportMethod}
                      </span>
                      {((item.attachments && item.attachments.length > 0) ||
                        (item.brandingConfig?.attachments && item.brandingConfig.attachments.length > 0)) && (
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                            isDarkMode
                              ? "bg-[#00FF41]/15 text-[#00FF41] border-[#00FF41]/40 font-mono"
                              : activeHolidaySeason === "kyle"
                              ? "bg-[#FAF4EB] text-[#5C3A21] border-[#D8C4A9]"
                              : "bg-[#EDF3E3] text-[#3F4A33] border-[#CFE0B8]"
                          }`}
                          title={`${
                            item.attachments?.length || item.brandingConfig?.attachments?.length
                          } attachment(s) saved in this version`}
                        >
                          <Paperclip
                            className={`w-3 h-3 ${
                              isDarkMode
                                ? "text-[#00FF41]"
                                : activeHolidaySeason === "kyle"
                                ? "text-[#8B5A2B]"
                                : "text-[#8AA66B]"
                            }`}
                          />
                          <span>
                            {item.attachments?.length || item.brandingConfig?.attachments?.length || 0}
                          </span>
                        </span>
                      )}
                      {/* Delete Individual Generated Email */}
                      <button
                        type="button"
                        onClick={() => onDeleteRecord(item.id)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          isDarkMode
                            ? "text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                            : "text-zinc-400 hover:text-red-600 hover:bg-red-50"
                        }`}
                        title="Delete this generated email from history (adjusts auto-version counter)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pt-1 gap-2">
                    <div className="min-w-0 pr-3 flex-1">
                      <div
                        className={`font-semibold truncate ${
                          isDarkMode
                            ? "text-[#E0FFE5]"
                            : activeHolidaySeason === "kyle"
                            ? "text-[#361F0E]"
                            : "text-[#3F4A33]"
                        }`}
                        title={item.subject}
                      >
                        Subject: {item.subject}
                      </div>
                      {item.notes && (
                        <div
                          className={`text-[11px] italic mt-0.5 truncate ${
                            isDarkMode
                              ? "text-[#D2FAD7]/80"
                              : activeHolidaySeason === "kyle"
                              ? "text-[#78593F]"
                              : "text-zinc-500"
                          }`}
                        >
                          Notes: {item.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {/* Display Email Button */}
                      <button
                        type="button"
                        onClick={() => setViewingRecord(item)}
                        className={`inline-flex items-center space-x-1 text-[11px] font-bold px-3 py-1.5 rounded-xl transition cursor-pointer shadow-2xs ${
                          isDarkMode
                            ? "bg-[#00FF41] hover:bg-[#39FF14] text-[#040906] font-mono shadow-[0_0_10px_#00FF41]"
                            : activeHolidaySeason === "kyle"
                            ? "text-white bg-[#8B5A2B] hover:bg-[#6F441D] shadow-xs"
                            : activeHolidaySeason === "halloween"
                            ? "text-white bg-orange-600 hover:bg-orange-500 shadow-xs"
                            : activeHolidaySeason === "christmas_eve"
                            ? "text-white bg-amber-600 hover:bg-amber-500 shadow-xs"
                            : activeHolidaySeason === "christmas"
                            ? "text-white bg-emerald-600 hover:bg-emerald-500 shadow-xs"
                            : activeHolidaySeason === "new_year"
                            ? "text-white bg-amber-600 hover:bg-amber-500 shadow-xs"
                            : "text-white bg-[#8AA66B] hover:bg-[#7a965c]"
                        }`}
                        title="Display full formatted email preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Display Email</span>
                      </button>

                      {/* Copy HTML Button */}
                      {item.htmlContent && (
                        <button
                          type="button"
                          onClick={(e) => handleCopyHtml(item, e)}
                          className={`flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border transition cursor-pointer ${
                            isDarkMode
                              ? "bg-[#0C1E12] hover:bg-[#00FF41]/20 text-[#00FF41] border-[#00FF41]/40"
                              : activeHolidaySeason === "kyle"
                              ? "text-[#5C3A21] bg-white hover:bg-[#FAF4EB] border-[#D8C4A9]"
                              : "text-[#3F4A33] bg-white hover:bg-[#EDF3E3] border-[#CFE0B8]"
                          }`}
                          title="Copy styled HTML"
                        >
                          {copiedHtmlId === item.id ? (
                            <>
                              <Check
                                className={`w-3 h-3 ${
                                  isDarkMode
                                    ? "text-[#00FF41]"
                                    : activeHolidaySeason === "kyle"
                                    ? "text-[#8B5A2B]"
                                    : "text-[#8AA66B]"
                                }`}
                              />
                              <span
                                className={`font-bold ${
                                  isDarkMode
                                    ? "text-[#00FF41]"
                                    : activeHolidaySeason === "kyle"
                                    ? "text-[#5C3A21]"
                                    : "text-[#3F4A33]"
                                }`}
                              >
                                Copied
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy
                                className={`w-3 h-3 ${
                                  isDarkMode
                                    ? "text-[#00FF41]"
                                    : activeHolidaySeason === "kyle"
                                    ? "text-[#8B5A2B]"
                                    : "text-[#8AA66B]"
                                }`}
                              />
                              <span>Copy HTML</span>
                            </>
                          )}
                        </button>
                      )}

                      {/* Copy Subject Button */}
                      <button
                        type="button"
                        onClick={(e) => handleCopySubject(item.id, item.subject, e)}
                        className={`flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border transition cursor-pointer ${
                          isDarkMode
                            ? "bg-[#08150D] hover:bg-[#00FF41]/15 text-[#D2FAD7] border-[#00FF41]/30"
                            : activeHolidaySeason === "kyle"
                            ? "text-[#5C3A21] hover:text-black bg-[#FAF4EB] hover:bg-[#EEDFC8] border-[#D8C4A9]"
                            : "text-[#3F4A33] hover:text-black bg-[#EDF3E3] hover:bg-[#CFE0B8] border-[#CFE0B8]"
                        }`}
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check
                              className={`w-3 h-3 ${
                                isDarkMode
                                  ? "text-[#00FF41]"
                                  : activeHolidaySeason === "kyle"
                                  ? "text-[#8B5A2B]"
                                  : "text-[#8AA66B]"
                              }`}
                            />
                            <span
                              className={`font-bold ${
                                isDarkMode
                                  ? "text-[#00FF41]"
                                  : activeHolidaySeason === "kyle"
                                  ? "text-[#5C3A21]"
                                  : "text-[#3F4A33]"
                              }`}
                            >
                              Copied
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy
                              className={`w-3 h-3 ${
                                isDarkMode
                                  ? "text-[#00FF41]"
                                  : activeHolidaySeason === "kyle"
                                  ? "text-[#8B5A2B]"
                                  : "text-[#8AA66B]"
                              }`}
                            />
                            <span>Subject</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modal Footer */}
          <div
            className={`px-6 py-3 border-t flex items-center justify-between text-xs transition-colors ${
              isDarkMode
                ? "bg-[#040906] border-[#00FF41]/30 text-[#D2FAD7]"
                : activeHolidaySeason === "kyle"
                ? "bg-[#FAF4EB] border-[#D8C4A9] text-[#361F0E]"
                : activeHolidaySeason === "halloween"
                ? "bg-orange-50 border-orange-200 text-orange-950"
                : "bg-[#FBF7F0] border-[#CFE0B8] text-[#3F4A33]"
            }`}
          >
            <div>
              Showing{" "}
              <strong
                className={`font-bold ${
                  isDarkMode
                    ? "text-[#00FF41]"
                    : activeHolidaySeason === "kyle"
                    ? "text-[#5C3A21]"
                    : "text-[#3F4A33]"
                }`}
              >
                {filteredHistory.length}
              </strong>{" "}
              recorded email(s) in local storage
            </div>
            <button
              onClick={onClose}
              className={`font-bold px-4 py-1.5 rounded-xl border shadow-xs transition cursor-pointer ${
                isDarkMode
                  ? "bg-[#08150D] hover:bg-[#00FF41]/20 text-[#00FF41] border-[#00FF41]/40"
                  : activeHolidaySeason === "kyle"
                  ? "bg-white text-[#5C3A21] hover:text-black border-[#D8C4A9] hover:bg-[#FAF4EB]"
                  : "bg-white text-[#3F4A33] hover:text-black border-[#CFE0B8] hover:bg-[#EDF3E3]"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Stored Email Full Display Modal */}
      {viewingRecord && (
        <EmailViewerModal
          isOpen={Boolean(viewingRecord)}
          onClose={() => setViewingRecord(null)}
          record={viewingRecord}
          onLoadIntoGenerator={onLoadSavedEmailIntoGenerator}
        />
      )}
    </>
  );
};
