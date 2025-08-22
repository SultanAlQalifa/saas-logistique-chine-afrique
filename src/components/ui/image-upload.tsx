'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { 
  Camera, 
  Upload, 
  X, 
  Eye, 
  Download,
  RotateCcw,
  Crop,
  ImageIcon,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
  uploadProgress?: number;
  uploaded?: boolean;
  error?: string;
}

interface ImageUploadProps {
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  onFilesChange?: (files: ImageFile[]) => void;
  existingImages?: ImageFile[];
  disabled?: boolean;
  showCamera?: boolean;
  showPreview?: boolean;
  className?: string;
}

export default function ImageUpload({
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  onFilesChange,
  existingImages = [],
  disabled = false,
  showCamera = true,
  showPreview = true,
  className = ''
}: ImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>(existingImages);
  const [isDragging, setIsDragging] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFilesChange = useCallback((newImages: ImageFile[]) => {
    setImages(newImages);
    onFilesChange?.(newImages);
  }, [onFilesChange]);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Type de fichier non supporté. Types acceptés: ${acceptedTypes.join(', ')}`;
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `Fichier trop volumineux. Taille maximale: ${maxSize}MB`;
    }
    return null;
  };

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newImages: ImageFile[] = [];

    fileArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        // Vous pourriez vouloir afficher une notification d'erreur ici
        console.error(error);
        return;
      }

      if (images.length + newImages.length >= maxFiles) {
        console.warn(`Nombre maximum de fichiers atteint (${maxFiles})`);
        return;
      }

      const imageFile: ImageFile = {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadProgress: 0,
        uploaded: false
      };

      newImages.push(imageFile);
    });

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages];
      handleFilesChange(updatedImages);
      
      // Simuler l'upload
      newImages.forEach((img) => simulateUpload(img));
    }
  };

  const simulateUpload = (imageFile: ImageFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        updateImageStatus(imageFile.id, { uploadProgress: 100, uploaded: true });
      } else {
        updateImageStatus(imageFile.id, { uploadProgress: progress });
      }
    }, 200);
  };

  const updateImageStatus = (id: string, updates: Partial<ImageFile>) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, ...updates } : img
    ));
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => {
      if (img.id === id) {
        URL.revokeObjectURL(img.preview);
        return false;
      }
      return true;
    });
    handleFilesChange(updatedImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Utilise la caméra arrière sur mobile
      });
      setCameraStream(stream);
      setShowCameraModal(true);
      
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Erreur d\'accès à la caméra:', error);
      alert('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  const capturePhoto = () => {
    if (cameraRef.current && canvasRef.current) {
      const video = cameraRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
            processFiles([file]);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card className={`border-2 border-dashed transition-all duration-300 ${
        isDragging 
          ? 'border-blue-500 bg-blue-50' 
          : disabled 
            ? 'border-gray-200 bg-gray-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
      }`}>
        <CardContent 
          className="p-8 text-center cursor-pointer"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className={`p-4 rounded-full ${
                disabled ? 'bg-gray-200' : 'bg-blue-100'
              }`}>
                <ImageIcon className={`h-8 w-8 ${
                  disabled ? 'text-gray-400' : 'text-blue-600'
                }`} />
              </div>
            </div>
            
            <div>
              <h3 className={`text-lg font-medium ${
                disabled ? 'text-gray-400' : 'text-gray-900'
              }`}>
                {isDragging ? 'Déposez vos images ici' : 'Ajoutez vos images'}
              </h3>
              <p className={`text-sm mt-1 ${
                disabled ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Glissez-déposez ou cliquez pour sélectionner ({images.length}/{maxFiles})
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Formats acceptés: JPG, PNG, WebP, GIF • Max {maxSize}MB par fichier
              </p>
            </div>

            {!disabled && (
              <div className="flex justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Parcourir
                </Button>
                
                {showCamera && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      startCamera();
                    }}
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Prendre une photo
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Images Preview */}
      {showPreview && images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative aspect-square">
                <img
                  src={image.preview}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Upload Progress */}
                {!image.uploaded && image.uploadProgress !== undefined && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-full p-2">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                )}

                {/* Status Icons */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {image.uploaded && (
                    <div className="bg-green-500 text-white p-1 rounded-full">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                  )}
                  {image.error && (
                    <div className="bg-red-500 text-white p-1 rounded-full">
                      <AlertCircle className="h-3 w-3" />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all duration-300 opacity-0 hover:opacity-100 flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedImage(image)}
                    className="text-white hover:bg-white/20"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(image.id)}
                    className="text-white hover:bg-red-500/50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{image.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
                {image.uploadProgress !== undefined && !image.uploaded && (
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div 
                      className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${image.uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Prendre une photo</h3>
              <Button variant="ghost" size="sm" onClick={stopCamera}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={cameraRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={stopCamera}>
                  Annuler
                </Button>
                <Button onClick={capturePhoto} className="bg-blue-600 hover:bg-blue-700">
                  <Camera className="h-4 w-4 mr-2" />
                  Capturer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold truncate">{selectedImage.name}</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedImage(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <img
                src={selectedImage.preview}
                alt={selectedImage.name}
                className="w-full max-h-96 object-contain rounded-lg"
              />
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{formatFileSize(selectedImage.size)}</span>
                <span>{selectedImage.type}</span>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedImage(null)}>
                  Fermer
                </Button>
                <Button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedImage.preview;
                    link.download = selectedImage.name;
                    link.click();
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
