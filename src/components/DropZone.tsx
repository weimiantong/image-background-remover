"use client";

import { useCallback, useRef, useState } from "react";

interface DropZoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export default function DropZone({ onFile, disabled }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [onFile, disabled]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`
        w-full max-w-lg border-2 border-dashed rounded-2xl p-12
        flex flex-col items-center justify-center gap-3 cursor-pointer
        transition-colors
        ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <span className="text-4xl">📁</span>
      <p className="text-gray-600 font-medium">
        Drag & drop your image here
      </p>
      <p className="text-gray-400 text-sm">or click to browse</p>
      <p className="text-gray-400 text-xs">PNG / JPG / WEBP · Max 10MB</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
