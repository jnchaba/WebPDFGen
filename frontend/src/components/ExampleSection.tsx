import React, { useState } from 'react';
import './ExampleSection.css';
import HtmlModal from './HtmlModal';

interface ExampleFile {
  name: string;
  title: string;
  description: string;
  filename: string;
  htmlContent: string;
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
    filename: 'simple-document.html',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Document</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #34495e;
            margin-top: 30px;
        }
        .highlight {
            background-color: #f1c40f;
            padding: 2px 4px;
        }
        .info-box {
            background-color: #ecf0f1;
            border-left: 4px solid #3498db;
            padding: 15px;
            margin: 20px 0;
        }
        ul {
            margin: 15px 0;
        }
        li {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <h1>Sample Document for PDF Conversion</h1>
    
    <p>This is a <strong>simple HTML document</strong> designed to test the HTML to PDF conversion functionality. It includes various HTML elements to demonstrate how they render in the PDF output.</p>
    
    <h2>Features Demonstrated</h2>
    
    <ul>
        <li>Basic text formatting (<strong>bold</strong>, <em>italic</em>)</li>
        <li>Headings of different levels</li>
        <li>Lists (both ordered and unordered)</li>
        <li>Styled elements with CSS</li>
        <li>Color and background styling</li>
    </ul>
    
    <h2>Important Information</h2>
    
    <div class="info-box">
        <p><strong>Note:</strong> This document contains styled elements that should be preserved in the PDF conversion. The <span class="highlight">highlighted text</span> and styled boxes should appear correctly in the final PDF.</p>
    </div>
    
    <h2>Sample Content</h2>
    
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    
    <ol>
        <li>First ordered list item</li>
        <li>Second ordered list item</li>
        <li>Third ordered list item with more content to test text wrapping and line spacing</li>
    </ol>
    
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    
    <h2>Conclusion</h2>
    
    <p>This document serves as a basic test case for the HTML to PDF conversion system. If you can see this text in the generated PDF with proper formatting, the conversion was successful!</p>
    
    <div class="info-box">
        <p><strong>Test passed!</strong> ✅ The HTML to PDF converter is working correctly.</p>
    </div>
</body>
</html>`
  },
  {
    name: 'complex-layout',
    title: 'Complex Layout',
    description: 'Advanced layout with grids, tables, progress bars, and modern styling.',
    filename: 'complex-layout.html',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complex Layout Test</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            min-height: 100vh;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header p {
            margin: 10px 0 0 0;
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin: 30px 0;
        }
        
        .card {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .card h3 {
            color: #495057;
            margin-top: 0;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
        }
        
        .stats {
            display: flex;
            justify-content: space-around;
            margin: 30px 0;
            background: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #1976d2;
        }
        
        .stat-label {
            font-size: 0.9em;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .table-container {
            margin: 30px 0;
            overflow-x: auto;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            background-color: #007bff;
            color: white;
            font-weight: 600;
        }
        
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        .progress-bar {
            width: 100%;
            height: 20px;
            background-color: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
            margin: 20px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
            border-radius: 10px;
            transition: width 0.3s ease;
        }
        
        .progress-fill.width-75 {
            width: 75%;
        }
        
        .progress-fill.width-60 {
            width: 60%;
        }
        
        .progress-fill.width-90 {
            width: 90%;
        }
        
        .alert {
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            border-left: 4px solid;
        }
        
        .alert-success {
            background-color: #d4edda;
            border-color: #28a745;
            color: #155724;
        }
        
        .alert-warning {
            background-color: #fff3cd;
            border-color: #ffc107;
            color: #856404;
        }
        
        .alert-info {
            background-color: #d1ecf1;
            border-color: #17a2b8;
            color: #0c5460;
        }
        
        .footer {
            background: #343a40;
            color: white;
            padding: 30px 40px;
            text-align: center;
        }
        
        .code-block {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            overflow-x: auto;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Complex Layout Test Document</h1>
            <p>Testing advanced HTML to PDF conversion with complex layouts</p>
        </div>
        
        <div class="content">
            <h2>Project Overview</h2>
            <p>This document demonstrates a complex layout that includes grids, tables, progress bars, and various styled components. It's designed to test the robustness of the HTML to PDF conversion system.</p>
            
            <div class="stats">
                <div class="stat">
                    <div class="stat-number">128</div>
                    <div class="stat-label">Files Processed</div>
                </div>
                <div class="stat">
                    <div class="stat-number">95%</div>
                    <div class="stat-label">Success Rate</div>
                </div>
                <div class="stat">
                    <div class="stat-number">42</div>
                    <div class="stat-label">Users Active</div>
                </div>
                <div class="stat">
                    <div class="stat-number">2.3s</div>
                    <div class="stat-label">Avg. Processing</div>
                </div>
            </div>
            
            <div class="grid">
                <div class="card">
                    <h3>Feature Analysis</h3>
                    <p>The system supports various HTML features including CSS grid layouts, flexbox, and modern styling techniques.</p>
                    <ul>
                        <li>Responsive grid layouts</li>
                        <li>Custom CSS styling</li>
                        <li>Progressive enhancement</li>
                        <li>Modern typography</li>
                    </ul>
                </div>
                
                <div class="card">
                    <h3>Performance Metrics</h3>
                    <p>Current system performance shows excellent results across all key indicators.</p>
                    
                    <div>
                        <strong>Conversion Speed:</strong>
                        <div class="progress-bar">
                            <div class="progress-fill width-90"></div>
                        </div>
                    </div>
                    
                    <div>
                        <strong>Quality Score:</strong>
                        <div class="progress-bar">
                            <div class="progress-fill width-75"></div>
                        </div>
                    </div>
                    
                    <div>
                        <strong>Reliability:</strong>
                        <div class="progress-bar">
                            <div class="progress-fill width-60"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>HTML to PDF Converter Test Document • Generated with advanced styling</p>
        </div>
    </div>
</body>
</html>`
  },
  {
    name: 'invoice-template',
    title: 'Invoice Template',
    description: 'Professional invoice template with billing information and calculations.',
    filename: 'invoice-template.html',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #INV-2024-001</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            background: white;
        }
        
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            padding: 0;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            position: relative;
        }
        
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        
        .invoice-number {
            position: absolute;
            top: 30px;
            right: 30px;
            text-align: right;
        }
        
        .invoice-number h2 {
            margin: 0;
            font-size: 1.5em;
            opacity: 0.9;
        }
        
        .invoice-number p {
            margin: 5px 0 0 0;
            opacity: 0.8;
        }
        
        .content {
            padding: 30px;
        }
        
        .billing-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin: 30px 0;
        }
        
        .bill-to, .bill-from {
            padding: 20px;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            background: #f8f9fa;
        }
        
        .bill-to h3, .bill-from h3 {
            margin: 0 0 15px 0;
            color: #495057;
            font-size: 1.2em;
            border-bottom: 2px solid #007bff;
            padding-bottom: 8px;
        }
        
        .company-info {
            line-height: 1.6;
        }
        
        .invoice-details {
            margin: 30px 0;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #28a745;
        }
        
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
        }
        
        .detail-item {
            text-align: center;
        }
        
        .detail-label {
            font-weight: bold;
            color: #666;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .detail-value {
            font-size: 1.2em;
            color: #333;
            margin-top: 5px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .items-table th {
            background: #495057;
            color: white;
            padding: 15px 10px;
            text-align: left;
            font-weight: 600;
        }
        
        .items-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #dee2e6;
        }
        
        .items-table tr:nth-child(even) {
            background: #f8f9fa;
        }
        
        .items-table tr:hover {
            background: #e9ecef;
        }
        
        .text-right {
            text-align: right;
        }
        
        .text-center {
            text-align: center;
        }
        
        .totals-section {
            margin: 30px 0;
            float: right;
            width: 300px;
        }
        
        .totals-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .totals-table td {
            padding: 8px 15px;
            border-bottom: 1px solid #dee2e6;
        }
        
        .totals-table .total-label {
            font-weight: 600;
            text-align: right;
            background: #f8f9fa;
        }
        
        .totals-table .total-amount {
            text-align: right;
            width: 120px;
        }
        
        .grand-total {
            background: #495057 !important;
            color: white !important;
            font-weight: bold !important;
            font-size: 1.1em !important;
        }
        
        .clearfix::after {
            content: "";
            display: table;
            clear: both;
        }
        
        .footer {
            margin-top: 40px;
            padding: 20px;
            background: #343a40;
            color: white;
            text-align: center;
            border-radius: 8px;
        }
        
        .footer p {
            margin: 5px 0;
        }
        
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .status-pending {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>INVOICE</h1>
            <div class="invoice-number">
                <h2>INV-2024-001</h2>
                <p>Issue Date: March 15, 2024</p>
                <p>Due Date: April 14, 2024</p>
                <span class="status-badge status-pending">Pending</span>
            </div>
        </div>
        
        <div class="content">
            <div class="billing-info">
                <div class="bill-from">
                    <h3>Bill From:</h3>
                    <div class="company-info">
                        <strong>TechSolutions Inc.</strong><br>
                        123 Innovation Drive<br>
                        San Francisco, CA 94107<br>
                        United States<br><br>
                        <strong>Phone:</strong> +1 (555) 123-4567<br>
                        <strong>Email:</strong> billing@techsolutions.com<br>
                        <strong>Tax ID:</strong> 123-45-6789
                    </div>
                </div>
                
                <div class="bill-to">
                    <h3>Bill To:</h3>
                    <div class="company-info">
                        <strong>Acme Corporation</strong><br>
                        456 Business Plaza<br>
                        New York, NY 10001<br>
                        United States<br><br>
                        <strong>Contact:</strong> John Smith<br>
                        <strong>Phone:</strong> +1 (555) 987-6543<br>
                        <strong>Email:</strong> john.smith@acme.com
                    </div>
                </div>
            </div>
            
            <div class="invoice-details">
                <div class="details-grid">
                    <div class="detail-item">
                        <div class="detail-label">Payment Terms</div>
                        <div class="detail-value">Net 30</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Project</div>
                        <div class="detail-value">Web Development</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Purchase Order</div>
                        <div class="detail-value">PO-2024-0089</div>
                    </div>
                </div>
            </div>
            
            <table class="items-table">
                <thead>
                    <tr>
                        <th style="width: 50%;">Description</th>
                        <th class="text-center" style="width: 10%;">Qty</th>
                        <th class="text-right" style="width: 15%;">Rate</th>
                        <th class="text-right" style="width: 15%;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <strong>Frontend Development</strong><br>
                            <small>React.js application development with modern UI/UX design patterns, responsive layout implementation, and cross-browser compatibility.</small>
                        </td>
                        <td class="text-center">40 hrs</td>
                        <td class="text-right">$125.00</td>
                        <td class="text-right">$5,000.00</td>
                    </tr>
                    <tr>
                        <td>
                            <strong>Backend API Development</strong><br>
                            <small>RESTful API design and implementation using Node.js and Express, including database integration and authentication systems.</small>
                        </td>
                        <td class="text-center">32 hrs</td>
                        <td class="text-right">$135.00</td>
                        <td class="text-right">$4,320.00</td>
                    </tr>
                </tbody>
            </table>
            
            <div class="clearfix">
                <div class="totals-section">
                    <table class="totals-table">
                        <tr>
                            <td class="total-label">Subtotal:</td>
                            <td class="total-amount">$9,320.00</td>
                        </tr>
                        <tr>
                            <td class="total-label">Tax (8.25%):</td>
                            <td class="total-amount">$768.90</td>
                        </tr>
                        <tr>
                            <td class="total-label grand-total">Total:</td>
                            <td class="total-amount grand-total">$10,088.90</td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Thank you for your business!</strong></p>
                <p>If you have any questions about this invoice, please contact us at billing@techsolutions.com</p>
                <p>TechSolutions Inc. • 123 Innovation Drive • San Francisco, CA 94107</p>
            </div>
        </div>
    </div>
</body>
</html>`
  }
];

const ExampleSection: React.FC<ExampleSectionProps> = ({ onExampleSelect, disabled = false }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExample, setSelectedExample] = useState<ExampleFile | null>(null);

  const handleExampleClick = (example: ExampleFile) => {
    if (!disabled) {
      onExampleSelect(example.filename, example.title);
    }
  };

  const handlePreviewClick = (e: React.MouseEvent, example: ExampleFile) => {
    e.stopPropagation();
    setSelectedExample(example);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedExample(null);
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
              <div className="example-header-actions">
                <span className="example-filename">{example.filename}</span>
                <button 
                  className="preview-button"
                  onClick={(e) => handlePreviewClick(e, example)}
                  title="Preview HTML"
                  disabled={disabled}
                >
                  <i className="fas fa-eye"></i>
                </button>
              </div>
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
      
      <HtmlModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={selectedExample?.title || ''}
        htmlContent={selectedExample?.htmlContent || ''}
      />
    </div>
  );
};

export default ExampleSection;