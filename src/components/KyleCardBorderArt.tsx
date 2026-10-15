import React from "react";
import { useTheme } from "../context/ThemeContext";

interface KyleCardBorderArtProps {
  /** Optional custom position style, defaults to top banner */
  position?: "top" | "top-right" | "bottom" | "strip" | "corners" | "badge";
  className?: string;
  label?: string;
}

/**
 * Renders cute Bread and coffee emoticons and graphic arts on the borders of Cards
 * in Kyle Theme (Pastries & Coffee).
 */
export const KyleCardBorderArt: React.FC<KyleCardBorderArtProps> = ({
  position = "top",
  className = "",
  label,
}) => {
  const { isDarkMode, activeHolidaySeason } = useTheme();

  if (isDarkMode || activeHolidaySeason !== "kyle") {
    return null;
  }

  if (position === "badge") {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none select-none inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#FAF4EB] border-2 border-[#D8C4A9] shadow-xs text-[11px] font-bold text-[#5C3A21] animate-[pastry-gentle-bob_4s_ease-in-out_infinite] ${className}`}
      >
        <span className="text-xs">☕</span>
        <span>{label || "Kyle's Café"}</span>
        <span className="text-xs">🥐</span>
      </div>
    );
  }

  if (position === "corners") {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none select-none z-10 ${className}`}
      >
        {/* Top-Left Corner Emoticon */}
        <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-[#FAF4EB] border-2 border-[#D8C4A9] shadow-xs flex items-center justify-center text-xs animate-[pastry-gentle-bob_4s_ease-in-out_infinite]">
          <span title="Fresh Coffee">☕</span>
        </div>
        {/* Top-Right Corner Emoticon */}
        <div
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#FAF4EB] border-2 border-[#D8C4A9] shadow-xs flex items-center justify-center text-xs animate-[pastry-gentle-bob_4.5s_ease-in-out_infinite]"
          style={{ animationDelay: "1s" }}
        >
          <span title="Warm Croissant">🥐</span>
        </div>
        {/* Bottom-Left Corner Emoticon */}
        <div
          className="absolute bottom-1.5 left-1.5 w-6 h-6 rounded-full bg-[#FAF4EB] border-2 border-[#D8C4A9] shadow-xs flex items-center justify-center text-xs animate-[pastry-gentle-bob_5s_ease-in-out_infinite]"
          style={{ animationDelay: "1.8s" }}
        >
          <span title="Artisan Baguette">🥖</span>
        </div>
        {/* Bottom-Right Corner Emoticon */}
        <div
          className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-[#FAF4EB] border-2 border-[#D8C4A9] shadow-xs flex items-center justify-center text-xs animate-[pastry-gentle-bob_4.2s_ease-in-out_infinite]"
          style={{ animationDelay: "0.5s" }}
        >
          <span title="Golden Pretzel">🥨</span>
        </div>
      </div>
    );
  }

  if (position === "top-right") {
    return (
      <div
        aria-hidden="true"
        className={`absolute top-5 right-5 sm:top-6 sm:right-6 z-10 pointer-events-none select-none inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#FAF4EB] border-2 border-[#D8C4A9] shadow-xs text-[11px] font-bold text-[#5C3A21] animate-[pastry-gentle-bob_4s_ease-in-out_infinite] ${className}`}
      >
        <span className="text-xs">☕</span>
        <span>{label || "Kyle's Café"}</span>
        <span className="text-xs">🥐</span>
      </div>
    );
  }

  if (position === "strip") {
    return (
      <div
        aria-hidden="true"
        className={`w-full py-1 px-3 bg-gradient-to-r from-[#F5ECE0] via-[#FAF4EB] to-[#F5ECE0] border-b border-[#D8C4A9]/70 flex items-center justify-between text-xs text-[#5C3A21] select-none pointer-events-none ${className}`}
      >
        <div className="flex items-center space-x-2 text-xs">
          <span>☕</span>
          <span className="text-[11px] font-extrabold tracking-wide uppercase text-[#8B5A2B]">
            {label || "Kyle Theme • Pastries & Coffee"}
          </span>
          <span>🥐</span>
        </div>
        <div className="flex items-center space-x-1.5 text-xs opacity-90 tracking-widest">
          <span>🥖</span>
          <span>🥨</span>
          <span>🍩</span>
          <span>🍪</span>
          <span>🍞</span>
          <span>☕</span>
        </div>
      </div>
    );
  }

  // Default: Cute border trim with emoticons across the top edge
  return (
    <div
      aria-hidden="true"
      className={`w-full flex items-center justify-between px-3 py-1 bg-[#F5ECE0]/85 border-b border-[#D8C4A9] select-none pointer-events-none text-xs ${className}`}
    >
      <div className="flex items-center space-x-1 text-[#8B5A2B] font-bold text-[11px]">
        <span>☕</span>
        <span>🥐</span>
        <span className="hidden sm:inline text-[#5C3A21] ml-1 font-extrabold uppercase tracking-wider text-[10px]">
          {label || "Vintage Café Edition"}
        </span>
      </div>
      <div className="flex items-center space-x-1.5 text-xs">
        <span title="Fresh Croissant">🥐</span>
        <span title="Crusty Baguette">🥖</span>
        <span title="Warm Pretzel">🥨</span>
        <span title="Sweet Donut">🍩</span>
        <span title="Choc Chip Cookie">🍪</span>
        <span title="Artisan Bread">🍞</span>
        <span title="Hot Coffee">☕</span>
      </div>
    </div>
  );
};

/**
 * Cute Bread & Coffee Emoticon indicator for buttons in Kyle Theme
 */
export const KyleButtonDeco: React.FC<{
  icon?: "coffee" | "croissant" | "bread" | "pretzel";
  className?: string;
}> = ({ icon = "coffee", className = "" }) => {
  const { isDarkMode, activeHolidaySeason } = useTheme();

  if (isDarkMode || activeHolidaySeason !== "kyle") {
    return null;
  }

  const emoji =
    icon === "coffee"
      ? "☕"
      : icon === "croissant"
      ? "🥐"
      : icon === "bread"
      ? "🥖"
      : "🥨";

  return (
    <span
      aria-hidden="true"
      className={`inline-block mr-1 text-xs select-none filter drop-shadow-xs animate-[pastry-gentle-bob_3s_ease-in-out_infinite] ${className}`}
    >
      {emoji}
    </span>
  );
};
