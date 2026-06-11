'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface UploadDropzoneProps {
  onUpload: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  label?: string;
}

export default function UploadDropzone({
  onUpload,
  accept = { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
  maxFiles = 1,
  label = 'Drop files here or click to select',
}: UploadDropzoneProps) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const reason = rejectedFiles[0].errors[0]?.code || 'Unknown error';
        setError(`File rejected: ${reason}`);
        return;
      }

      if (acceptedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} file(s) allowed`);
        return;
      }

      const newPreviews = acceptedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

      setPreviews(newPreviews);
      onUpload(acceptedFiles);
    },
    [maxFiles, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
  });

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index].url);
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-primary bg-accent/30 scale-[1.01]'
            : 'border-border hover:border-muted-foreground'
        } ${error ? 'border-destructive bg-destructive/5' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {maxFiles === 1 ? 'Single file' : `Up to ${maxFiles} files`}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {previews.length > 0 && (
        <div className={`grid gap-3 ${maxFiles === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'}`}>
          {previews.map((preview, idx) => (
            <motion.div
              key={idx}
              className="relative group rounded-lg overflow-hidden bg-gray-100"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <img
                src={preview.url}
                alt={`Preview ${idx}`}
                className="w-full h-24 object-cover"
              />
              <motion.button
                onClick={() => removePreview(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
              <p className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                {preview.file.name}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
