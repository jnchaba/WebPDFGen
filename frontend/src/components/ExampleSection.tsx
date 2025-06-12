import React from 'react';
import './ExampleSection.css';

interface ExampleFile {
  name: string;
  title: string;
  description: string;
  filename: string;
}

interface ExampleSectionProps {
  onExampleSelect: (filename: string, title: string) => void;
  disabled?: boolean;
}

const examples: ExampleFile[] = [
  {
    name: 'simple-document',
    title: 'Simple Document',
    description: 'Basic HTML document with text formatting, lists, and styled elements.',
    filename: 'simple-document.html'
  },
  {
    name: 'complex-layout',
    title: 'Complex Layout',
    description: 'Advanced layout with grids, tables, progress bars, and modern styling.',
    filename: 'complex-layout.html'
  },
  {
    name: 'invoice-template',
    title: 'Invoice Template',
    description: 'Professional invoice template with billing information and calculations.',
    filename: 'invoice-template.html'
  }
];

const ExampleSection: React.FC<ExampleSectionProps> = ({ onExampleSelect, disabled = false }) => {
  const handleExampleClick = (example: ExampleFile) => {
    if (!disabled) {
      onExampleSelect(example.filename, example.title);
    }
  };

  return (
    <div className="example-section">
      <h2>Try Our Examples</h2>
      <p>Test the converter with our sample HTML files</p>
      
      <div className="examples-grid">
        {examples.map((example) => (
          <div 
            key={example.name}
            className={`example-card ${disabled ? 'disabled' : ''}`}
            onClick={() => handleExampleClick(example)}
          >
            <div className="example-header">
              <h3>{example.title}</h3>
              <span className="example-filename">{example.filename}</span>
            </div>
            <p className="example-description">{example.description}</p>
            <div className="example-action">
              <button 
                className="example-button"
                disabled={disabled}
              >
                {disabled ? 'Processing...' : 'Try This Example'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExampleSection;