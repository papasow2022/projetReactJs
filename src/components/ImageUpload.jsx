import React, { useState, useRef } from 'react';
import { BiUpload, BiX, BiImage } from 'react-icons/bi';

const ImageUpload = ({ 
  onImageChange, 
  currentImage, 
  maxImages = 6, 
  aspectRatio = 1,
  showPreview = true,
  className = ""
}) => {
  const normalizeInitial = (img) => {
    if (!img) return [];
    if (typeof img === 'string') {
      return [{ id: `initial-${Date.now()}`, url: img, file: null, name: 'initial' }];
    }
    if (typeof img === 'object' && img.url) {
      return [{ id: img.id || `initial-${Date.now()}`, url: img.url, file: img.file || null, name: img.name || 'image' }];
    }
    return [];
  };

  const [images, setImages] = useState(normalizeInitial(currentImage));
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) {
      alert('Veuillez sélectionner des images valides (JPG, PNG, GIF) de moins de 5MB');
      return;
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: `${Date.now()}-${file.name}-${Math.random()}`,
          url: e.target.result,
          file: file,
          name: file.name
        };
        
        setImages(prev => {
          const updated = [...prev, newImage].slice(0, maxImages);
          // Utiliser setTimeout pour éviter setState pendant le render
          setTimeout(() => onImageChange(updated), 0);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (imageId) => {
    setImages(prev => {
      const updated = prev.filter(img => (img && (img.id || img.url)) !== imageId);
      // Utiliser setTimeout pour éviter setState pendant le render
      setTimeout(() => onImageChange(updated), 0);
      return updated;
    });
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`image-upload-container ${className}`}>
      {/* Zone de drop */}
      <div
        className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
        style={{
          border: '2px dashed #ddd',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragOver ? '#f8f9fa' : '#fff',
          borderColor: dragOver ? '#007bff' : '#ddd',
          transition: 'all 0.2s ease'
        }}
      >
        <BiUpload size={48} color="#6c757d" />
        <p style={{ margin: '1rem 0 0.5rem 0', color: '#6c757d' }}>
          Glissez-déposez vos images ici
        </p>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#adb5bd' }}>
          ou cliquez pour sélectionner (JPG, PNG, GIF - max 5MB)
        </p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#adb5bd' }}>
          Maximum {maxImages} image{maxImages > 1 ? 's' : ''}
        </p>
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        style={{ display: 'none' }}
      />

      {/* Prévisualisation des images */}
      {showPreview && images.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h6 style={{ marginBottom: '1rem', color: '#495057' }}>
            Images sélectionnées ({images.length}/{maxImages})
          </h6>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
            gap: '1rem' 
          }}>
            {images.map((image, index) => {
              const key = (image && image.id) ? image.id : (image && image.url) ? `url-${image.url}` : `idx-${index}`;
              const url = (image && image.url) ? image.url : (typeof image === 'string' ? image : '');
              return (
                <div
                  key={key}
                  style={{
                    position: 'relative',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    aspectRatio: aspectRatio
                  }}
                >
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage((image && image.id) ? image.id : (image && image.url) ? `url-${image.url}` : `idx-${index}`);
                    }}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    <BiX />
                  </button>
                  {index === 0 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: '4px',
                      background: '#28a745',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600'
                    }}>
                      Principal
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Aperçu de l'image principale */}
      {images.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h6 style={{ marginBottom: '0.5rem', color: '#495057' }}>
            Image principale
          </h6>
          <div style={{
            width: '200px',
            height: '200px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa'
          }}>
            <img
              src={(images[0] && images[0].url) ? images[0].url : (typeof images[0] === 'string' ? images[0] : '')}
              alt="Image principale"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;