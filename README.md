# WebPDFGen

A full-stack TypeScript application that converts HTML files to PDF with real-time progress tracking using WebSockets.

## Features

- 📁 **File Upload**: Drag-and-drop HTML file upload interface
- ⚡ **Real-time Progress**: WebSocket-powered progress updates
- 🎛️ **Configurable Options**: Customizable PDF settings (format, orientation, margins)
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔒 **Secure**: File validation and error handling
- 🚀 **Fast Processing**: Puppeteer-based PDF generation
- 📊 **Modern UI**: Clean, professional interface with visual feedback
- 👁️ **HTML Preview**: View example HTML files with Font Awesome icons
- 🎯 **Example Templates**: Pre-built HTML templates for testing and reference

## Architecture

### Backend (Node.js + TypeScript)
- **Express.js** server with TypeScript
- **Puppeteer** for PDF generation
- **Multer** for file upload handling
- **Socket.io** for real-time WebSocket communication
- **RESTful API** endpoints for conversion operations

### Frontend (React + TypeScript)
- **React** application with TypeScript
- **Drag-and-drop** file upload component
- **Real-time progress** tracking via WebSocket
- **PDF preview** and download functionality
- **HTML preview modal** with raw code display
- **Font Awesome icons** for enhanced UI
- **Responsive design** with modern CSS

## Project Structure

```
WebPDFGen/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── middleware.ts     # Multer file upload middleware
│   │   │   └── routes.ts         # Express API routes
│   │   ├── services/
│   │   │   ├── pdfGenerator.ts   # Puppeteer PDF generation
│   │   │   ├── websocket.ts      # Socket.io WebSocket setup
│   │   │   └── jobManager.ts     # Job tracking and management
│   │   ├── types/
│   │   │   └── index.ts          # Backend TypeScript types
│   │   └── index.ts              # Express server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUploader.tsx     # Drag-and-drop upload component
│   │   │   ├── ProgressBar.tsx      # Real-time progress display
│   │   │   ├── DownloadSection.tsx  # PDF download and preview
│   │   │   ├── ExampleSection.tsx   # HTML example templates with preview
│   │   │   ├── HtmlModal.tsx        # Modal for HTML code preview
│   │   │   ├── FileUploader.css     # FileUploader styles
│   │   │   ├── ProgressBar.css      # ProgressBar styles
│   │   │   ├── DownloadSection.css  # DownloadSection styles
│   │   │   ├── ExampleSection.css   # ExampleSection styles
│   │   │   └── HtmlModal.css        # HtmlModal styles
│   │   ├── services/
│   │   │   ├── api.ts               # API client for backend communication
│   │   │   └── websocket.ts         # WebSocket client service
│   │   ├── types/
│   │   │   └── index.ts             # Frontend TypeScript types
│   │   ├── App.tsx                  # Main React application
│   │   ├── App.css                  # Application styles
│   │   ├── index.tsx                # React entry point
│   │   └── index.css                # Global styles
│   ├── public/
│   │   ├── index.html               # HTML template
│   │   └── favicon.ico              # Application favicon
│   ├── package.json
│   └── tsconfig.json
├── examples/                     # Sample HTML files for testing
│   ├── simple-document.html
│   ├── complex-layout.html
│   └── invoice-template.html
├── package.json                  # Root package.json with scripts
└── README.md
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WebPDFGen
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 3001) and frontend development server (port 3000) concurrently.

## Usage

1. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - The backend API runs on `http://localhost:3001`

2. **Convert HTML to PDF**
   - Drag and drop an HTML file into the upload area, or click to browse
   - Configure PDF options (format, orientation, margins, etc.)
   - Click "Convert to PDF" to start the conversion
   - Watch real-time progress updates
   - Download or preview the generated PDF when complete

3. **Test with examples**
   - Use the sample HTML files in the `examples/` directory via the "Try Our Examples" section
   - Click the eye icon (👁️) next to any example to preview the raw HTML code
   - Try `simple-document.html` for basic conversion testing
   - Use `complex-layout.html` to test advanced CSS features
   - Test `invoice-template.html` for professional document formatting

## API Endpoints

### File Upload & Conversion
- `POST /api/convert` - Upload and convert HTML file
- `POST /api/convert-content` - Convert HTML content directly

### Job Management
- `GET /api/job/:jobId` - Get job status and details
- `GET /api/jobs` - Get all jobs
- `DELETE /api/job/:jobId` - Delete job and associated files

### File Download & Preview
- `GET /api/download/:jobId` - Download generated PDF (attachment)
- `GET /api/download/:jobId?preview=true` - Preview PDF inline in browser
- `GET /outputs/:filename` - Direct file access

### Examples
- `GET /api/example/:filename` - Get example HTML file content (for preview)

### System
- `GET /health` - Health check endpoint

## WebSocket Events

### Client → Server
- `join-job` - Join a specific job room for updates
- `leave-job` - Leave a job room

### Server → Client
- `connected` - Connection confirmation
- `progress` - Real-time progress updates
- `job-update` - General job status updates

## Configuration

### PDF Options
```typescript
{
  format: 'A4' | 'A3' | 'Letter' | 'Legal',
  orientation: 'portrait' | 'landscape',
  margin: {
    top: string,
    right: string,
    bottom: string,
    left: string
  },
  printBackground: boolean,
  displayHeaderFooter: boolean,
  headerTemplate: string,
  footerTemplate: string
}
```

### Environment Variables
- `PORT` - Backend server port (default: 5000)
- `REACT_APP_API_URL` - Backend API URL for frontend
- `REACT_APP_WS_URL` - WebSocket URL for frontend

## Development Scripts

```bash
# Install all dependencies
npm run install:all

# Start development servers (both frontend and backend)
npm run dev

# Start only backend development server
npm run backend:dev

# Start only frontend development server
npm run frontend:dev

# Build for production
npm run build

# Start production server (backend only)
npm start

# Run tests
npm test

# Clean all build artifacts and node_modules
npm run clean
```

## Features in Detail

### Real-time Progress Tracking
- WebSocket connection provides instant updates
- Progress bar shows conversion status
- Detailed progress messages (e.g., "Loading HTML content...", "Generating PDF...")
- Fallback to polling if WebSocket connection fails

### File Upload Security
- File type validation (HTML only)
- File size limits (5MB maximum)
- Secure file handling with automatic cleanup
- Error handling for invalid files

### PDF Generation Options
- Multiple page formats (A4, A3, Letter, Legal)
- Portrait and landscape orientations
- Customizable margins
- Background graphics printing
- Header and footer support

### User Experience
- Drag-and-drop file upload
- Visual progress indicators
- Error handling with user-friendly messages
- PDF preview in new tab (inline viewing)
- Direct download functionality
- HTML code preview in modal dialogs
- Example templates with preview functionality
- Font Awesome icons for enhanced visual appeal
- Responsive design for all devices

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Dependencies

### Backend
- `express` - Web application framework
- `puppeteer` - Headless Chrome PDF generation
- `multer` - File upload middleware
- `socket.io` - Real-time WebSocket communication
- `cors` - Cross-origin resource sharing
- `uuid` - Unique identifier generation

### Frontend
- `react` - UI library
- `typescript` - Type safety
- `socket.io-client` - WebSocket client
- `axios` - HTTP client
- `@fontawesome/fontawesome-free` - Icon library for UI enhancement

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions, please open an issue on the GitHub repository.