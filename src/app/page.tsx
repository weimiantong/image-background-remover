"use client";

import { useState, useCallback, useRef } from "react";
import DropZone from "@/components/DropZone";
import ImagePreview from "@/components/ImagePreview";
import CompareView from "@/components/CompareView";
import Header from "@/components/Header";

type Status = "idle" | "uploading" | "processing" | "done" | "error";

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const resultBlobRef = useRef<string | null>(null);

  const handleFile = useCallback((file: File) => {
    // validate
    const validTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Unsupported format. Please upload PNG, JPG or WEBP.");
      setStatus("error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File too large. Maximum size is 10MB.");
      setStatus("error");
      return;
    }

    // cleanup previous
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    resultBlobRef.current = null;
    setErrorMsg("");

    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setOriginalFile(file);
    setStatus("idle");
  }, [originalUrl, resultUrl]);

  const handleRemoveBg = useCallback(async () => {
    if (!originalFile) return;
    setStatus("processing");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("image", originalFile);

      const res = await fetch("/api/remove", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      resultBlobRef.current = url;
      setStatus("done");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to remove background.");
      setStatus("error");
    }
  }, [originalFile]);

  const handleDownload = useCallback(() => {
    if (!resultUrl || !originalFile) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    const name = originalFile.name.replace(/\.[^.]+$/, "") + "-no-bg.png";
    a.download = name;
    a.click();
  }, [resultUrl, originalFile]);

  const handleReset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setOriginalUrl(null);
    setOriginalFile(null);
    setResultUrl(null);
    resultBlobRef.current = null;
    setStatus("idle");
    setErrorMsg("");
  }, [originalUrl, resultUrl]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-3xl mx-auto w-full">
        {!originalUrl && (
          <DropZone onFile={handleFile} disabled={status === "processing"} />
        )}

        {originalUrl && !resultUrl && (
          <div className="w-full flex flex-col items-center gap-6">
            <ImagePreview src={originalUrl} alt="Original" />
            <button
              onClick={handleRemoveBg}
              disabled={status === "processing"}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-xl text-lg transition-colors flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {status === "processing" ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>🪄 Remove Background</>
              )}
            </button>
            <button
              onClick={handleReset}
              className="text-gray-500 hover:text-gray-700 text-sm underline cursor-pointer"
            >
              🔄 Upload New
            </button>
          </div>
        )}

        {originalUrl && resultUrl && (
          <CompareView
            originalSrc={originalUrl}
            resultSrc={resultUrl}
            onDownload={handleDownload}
            onReset={handleReset}
          />
        )}

        {status === "error" && errorMsg && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center max-w-md">
            <p className="font-medium">Oops!</p>
            <p className="text-sm mt-1">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="mt-3 text-sm text-red-600 underline cursor-pointer"
            >
              Try again
            </button>
          </div>
        )}
      </main>

      <footer className="text-center text-gray-400 text-xs py-4 border-t">
        Powered by Remove.bg · Free & Open Source
      </footer>
    </div>
  );
}
