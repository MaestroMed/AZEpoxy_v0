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
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragOver
            ? "border-brand-orange bg-brand-orange/5"
            : "border-brand-night/15 bg-white hover:border-brand-orange/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          className="hidden"
        />
        <Upload className="mx-auto h-8 w-8 text-brand-charcoal/30" />
        <p className="mt-2 text-sm font-medium text-brand-charcoal/70">
          Glissez vos photos ici ou cliquez pour sélectionner
        </p>
        <p className="mt-1 text-xs text-brand-charcoal/40">
          Max {MAX_FILES} photos, 10 Mo/photo — JPG, PNG, WEBP, HEIC
        </p>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="group relative aspect-square overflow-hidden rounded-lg bg-brand-charcoal/5"
            >
              {file.type.startsWith("image/") && file.type !== "image/heic" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-brand-charcoal/30" />
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
