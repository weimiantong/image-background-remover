"use client";

interface ImagePreviewProps {
  src: string;
  alt: string;
}

export default function ImagePreview({ src, alt }: ImagePreviewProps) {
  return (
    <div className="w-full max-w-lg">
      <p className="text-sm text-gray-500 mb-2 font-medium">{alt}</p>
      <div className="rounded-xl overflow-hidden border border-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-contain max-h-80"
        />
      </div>
    </div>
  );
}
