import React, { useCallback, useState } from 'react';
import { PDFOptions } from '../types';
import './FileUploader.css';

interface FileUploaderProps {
  onFileSelect: (file: File, options?: PDFOptions) => void;
  isUploading: boolean;
  disabled?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, isUploading, disabled }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfOptions, setPdfOptions] = useState<PDFOptions>({
    format: 'A4',
    orientation: 'portrait',
    printBackground: true,
    margin: {
      top: '1cm',
      right: '1cm',
      bottom: '1cm',
      left: '1cm'
    }
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === 'text/html' || file.name.toLowerCase().endsWith('.html')) {
        setSelectedFile(file);
      } else {
        alert('Please select an HTML file');
      }
    }
  }, [disabled, isUploading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || isUploading) return;

    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === 'text/html' || file.name.toLowerCase().endsWith('.html')) {
        setSelectedFile(file);
      } else {
        alert('Please select an HTML file');
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile && !disabled && !isUploading) {
      onFileSelect(selectedFile, pdfOptions);
    }
  };

  const handleOptionChange = (key: keyof PDFOptions, value: any) => {
    setPdfOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleMarginChange = (side: string, value: string) => {
    setPdfOptions(prev => ({
      ...prev,
      margin: {
        ...prev.margin,
        [side]: value
      }
    }));
  };

  return (
    <div className="file-uploader">
      <div
        className={`drop-zone ${dragActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="drop-zone-content">
          {selectedFile ? (
            <div className="file-selected">
              <div className="file-icon">📄</div>
              <div className="file-info">
                <div className="file-name">{selectedFile.name}</div>
                <div className="file-size">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </div>
              </div>
              <button
                className="remove-file"
                onClick={() => setSelectedFile(null)}
                disabled={disabled || isUploading}
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <div className="upload-icon">📁</div>
              <p className="upload-text">
                Drag and drop your HTML file here, or{' '}
                <label className="file-input-label">
                  browse
                  <input
                    type="file"
                    accept=".html,text/html"
                    onChange={handleFileChange}
                    disabled={disabled || isUploading}
                    style={{ display: 'none' }}
                  />
                </label>
              </p>
              <p className="upload-hint">Only HTML files are supported (max 5MB)</p>
            </>
          )}
        </div>
      </div>

      {selectedFile && (
        <div className="pdf-options">
          <h3>PDF Options</h3>
          
          <div className="option-group">
            <label>Page Format:</label>
            <select
              value={pdfOptions.format}
              onChange={(e) => handleOptionChange('format', e.target.value)}
              disabled={disabled || isUploading}
            >
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
            </select>
          </div>

          <div className="option-group">
            <label>Orientation:</label>
            <select
              value={pdfOptions.orientation}
              onChange={(e) => handleOptionChange('orientation', e.target.value)}
              disabled={disabled || isUploading}
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          <div className="option-group">
            <label>
              <input
                type="checkbox"
                checked={pdfOptions.printBackground}
                onChange={(e) => handleOptionChange('printBackground', e.target.checked)}
                disabled={disabled || isUploading}
              />
              Print Background Graphics
            </label>
          </div>

          <div className="margins-group">
            <h4>Margins</h4>
            <div className="margin-inputs">
              <div className="margin-input">
                <label>Top:</label>
                <input
                  type="text"
                  value={pdfOptions.margin?.top || '1cm'}
                  onChange={(e) => handleMarginChange('top', e.target.value)}
                  disabled={disabled || isUploading}
                  placeholder="1cm"
                />
              </div>
              <div className="margin-input">
                <label>Right:</label>
                <input
                  type="text"
                  value={pdfOptions.margin?.right || '1cm'}
                  onChange={(e) => handleMarginChange('right', e.target.value)}
                  disabled={disabled || isUploading}
                  placeholder="1cm"
                />
              </div>
              <div className="margin-input">
                <label>Bottom:</label>
                <input
                  type="text"
                  value={pdfOptions.margin?.bottom || '1cm'}
                  onChange={(e) => handleMarginChange('bottom', e.target.value)}
                  disabled={disabled || isUploading}
                  placeholder="1cm"
                />
              </div>
              <div className="margin-input">
                <label>Left:</label>
                <input
                  type="text"
                  value={pdfOptions.margin?.left || '1cm'}
                  onChange={(e) => handleMarginChange('left', e.target.value)}
                  disabled={disabled || isUploading}
                  placeholder="1cm"
                />
              </div>
            </div>
          </div>

          <button
            className="convert-button"
            onClick={handleUpload}
            disabled={!selectedFile || disabled || isUploading}
          >
            {isUploading ? 'Converting...' : 'Convert to PDF'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;