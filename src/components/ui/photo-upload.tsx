"use client";

import { useState, useCallback, useRef, type DragEvent, type ChangeEvent } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

interface PhotoUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
}

const MAX_FILES = 10;
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

async function compressImage(file: File): Promise<File> {
  // Skip non-image types that canvas can't handle (HEIC)
  if (file.type === "image/heic" || file.type === "image/heif") return file;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 2000;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        0.8
      );
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

export function PhotoUpload({ files, onChange }: PhotoUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    async (incoming: FileList | File[]) => {
      setError(null);
      const arr = Array.from(incoming);
      const valid: File[] = [];

      for (const f of arr) {
        if (!ACCEPTED.includes(f.type) && !f.name.toLowerCase().endsWith(".heic")) {
          setError("Format non supporté. Acceptés : JPG, PNG, WEBP, HEIC.");
          continue;
        }
        if (f.size > MAX_SIZE) {
          setError("Fichier trop volumineux (max 10 Mo par photo).");
          continue;
        }
        const compressed = await compressImage(f);
        valid.push(compressed);
      }

      const combined = [...files, ...valid].slice(0, MAX_FILES);
      if (files.length + valid.length > MAX_FILES) {
        setError(`Maximum ${MAX_FILES} photos.`);
      }
      onChange(combined);
    },
    [files, onChange]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) addFiles(e.target.files);
      e.target.value = "";
    },
    [addFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      onChange(files.filter((_, i) => i !== index));
    },
    [files, onChange]
  );

  return (
    <div className="space-y-3">
      {/* Drop zone — polish award-tier */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Zone de dépôt de photos"
        className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
          dragOver
            ? "border-brand-orange bg-brand-orange/8 scale-[1.01] shadow-[0_12px_32px_-20px_rgba(232,93,44,0.5)]"
            : "border-brand-night/15 bg-white hover:border-brand-orange/50 hover:bg-brand-cream/30"
        }`}
      >
        {/* Decorative glow during drag */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-orange/10 via-transparent to-brand-orange/5 transition-opacity duration-500 ${
            dragOver ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Corner marks — decorative brackets like camera viewfinder */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-brand-orange/30 transition-all duration-300 group-hover:border-brand-orange/60 group-hover:w-5 group-hover:h-5"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-brand-orange/30 transition-all duration-300 group-hover:border-brand-orange/60 group-hover:w-5 group-hover:h-5"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 bottom-3 h-4 w-4 border-l-2 border-b-2 border-brand-orange/30 transition-all duration-300 group-hover:border-brand-orange/60 group-hover:w-5 group-hover:h-5"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 bottom-3 h-4 w-4 border-r-2 border-b-2 border-brand-orange/30 transition-all duration-300 group-hover:border-brand-orange/60 group-hover:w-5 group-hover:h-5"
        />

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          className="hidden"
        />

        <div className="relative">
          <div
            className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${
              dragOver
                ? "bg-brand-orange text-white scale-110"
                : "bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange/15 group-hover:scale-105"
            }`}
          >
            <Upload className="h-6 w-6" />
          </div>
          <p className="font-display text-base font-semibold text-brand-night">
            {dragOver
              ? "Déposez vos photos ici"
              : "Glissez vos photos ou cliquez"}
          </p>
          <p className="mt-1.5 text-xs text-brand-charcoal/55">
            Jusqu&apos;à {MAX_FILES} photos · 10 Mo/photo · JPG · PNG · WEBP · HEIC
          </p>
          {files.length > 0 && (
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-orange">
              {files.length} photo{files.length > 1 ? "s" : ""} ajoutée{files.length > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* Error — compact variant (reuse visual language of the main ErrorAlert) */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700"
        >
          <span
            aria-hidden
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3 w-3">
              <line x1="12" y1="8" x2="12" y2="13" strokeLinecap="round" />
              <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
            </svg>
          </span>
          <span className="flex-1">{error}</span>
        </div>
      )}

      {/* Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="group relative aspect-square overflow-hidden rounded-xl bg-brand-charcoal/5 shadow-[0_4px_12px_-6px_rgba(0,0,0,0.15)] transition-all duration-300 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.3)]"
              style={{
                animation: `stat-pop 400ms cubic-bezier(0.22,1,0.36,1) ${i * 40}ms both`,
              }}
            >
              {file.type.startsWith("image/") && file.type !== "image/heic" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-brand-charcoal/30" />
                </div>
              )}
              {/* Dim overlay */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                aria-label={`Retirer la photo ${i + 1}`}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-red-600 hover:scale-110 group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {/* File index badge */}
              <span className="pointer-events-none absolute left-1.5 top-1.5 rounded-full bg-black/60 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white backdrop-blur-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
