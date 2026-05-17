"use client";

import { useState } from "react";

interface CompareViewProps {
  originalSrc: string;
  resultSrc: string;
  onDownload: () => void;
  onReset: () => void;
}

export default function CompareView({
  originalSrc,
  resultSrc,
  onDownload,
  onReset,
}: CompareViewProps) {
  const [tab, setTab] = useState<"result" | "original">("result");

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Tab switch */}
      <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setTab("result")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            tab === "result" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Result
        </button>
        <button
          onClick={() => setTab("original")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            tab === "original" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Original
        </button>
      </div>

      {/* Preview */}
      <div className="w-full max-w-lg">
        <div
          className="rounded-xl overflow-hidden border border-gray-200"
          style={{
            backgroundImage:
              tab === "result"
                ? "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)"
                : "none",
            backgroundSize: tab === "result" ? "20px 20px" : "auto",
            backgroundPosition: tab === "result" ? "0 0, 0 10px, 10px -10px, -10px 0px" : "auto",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tab === "result" ? resultSrc : originalSrc}
            alt={tab === "result" ? "Result" : "Original"}
            className="w-full h-auto object-contain max-h-80"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
        >
          📥 Download PNG
        </button>
        <button
          onClick={onReset}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
        >
          🔄 Upload New
        </button>
      </div>
    </div>
  );
}
