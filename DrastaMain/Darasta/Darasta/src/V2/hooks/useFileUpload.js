import { useState, useCallback } from 'react';

export function useFileUpload() {
  const [file, setFile] = useState(null);
  const [imageError, setImageError] = useState("");

  const onFileChange = useCallback((e) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setImageError(""); // Clear error on selection
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setImageError(""); // Clear error on drop
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  return {
    file,
    setFile,
    imageError,
    setImageError,
    onFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave
  };
}