import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import toastUtil from '@/shared/utils/toast';

const ImageUpload = ({ images = [], onChange, maxFiles = 5, className = '' }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    // Filter valid images
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      toastUtil.error('Some files were ignored. Only images are allowed.');
    }

    if (images.length + validFiles.length > maxFiles) {
      toastUtil.error(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    // Pass the actual File objects to the parent
    onChange([...images, ...validFiles]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  // Helper function to get image source (matches either string URL or File object)
  const getImageSource = (img) => {
    if (typeof img === 'string') return img;
    if (img instanceof File) return URL.createObjectURL(img);
    if (img && img.url) return img.url; // Support object format {url, public_id}
    return '';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging 
            ? 'border-emerald-500 bg-emerald-50' 
            : 'border-gray-200 hover:bg-gray-50'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center space-y-2" style={{ padding: '10px'}}>
          <div className={`p-3 rounded-full ${isDragging ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
            <Upload className="w-6 h-6" />
          </div>
          <div className="text-sm font-medium text-gray-900">
            Click to upload or drag and drop
          </div>
          <div className="text-xs text-gray-500">
            SVG, PNG, JPG (max. {maxFiles} images)
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
        />
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" style={{ padding: '10px' }}>
          {images.map((img, index) => (
            <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={getImageSource(img)}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] py-1 text-center backdrop-blur-sm">
                  Main Image
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
