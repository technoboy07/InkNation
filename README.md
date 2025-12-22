# 3D Tattoo Web Application

A modern, interactive web application that allows users to preview tattoos on a 3D human model. Users can upload tattoo images, place them on a 3D model, and manipulate them (move, rotate, scale) in real-time using an intuitive interface.

## Features

- **3D Model Viewer**: Interactive 3D human model with camera controls (pan, zoom, rotate)
- **Tattoo Upload**: Upload PNG/JPEG images (max 10MB) as tattoo designs
- **Tattoo Placement**: Click-to-place tattoos on the 3D model surface
- **Tattoo Manipulation**: 
  - Move: Drag tattoos on the model surface
  - Rotate: Adjust rotation with slider controls
  - Scale: Resize tattoos with slider controls
- **Model Controls**: Lock/unlock model rotation and zoom
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Comprehensive error boundaries and user feedback

## Technology Stack

- **React 18.2.0** - Modern UI library
- **Three.js 0.177.0** - Core 3D graphics library
- **React Three Fiber 9.1.2** - React renderer for Three.js
- **React Three Drei 10.3.0** - Useful helpers and abstractions for R3F
- **@use-gesture/react 10.3.1** - Advanced gesture handling
- **React Router DOM 6.x** - Client-side routing
- **Lucide React 0.525.0** - Modern icon library

## Prerequisites

- Node.js 14+ (Node.js 16+ recommended)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 3dtattooweb
```

2. Install dependencies:
```bash
npm install
```

3. Add a 3D model:
   - Place a GLB/GLTF model file in the `public/models/` directory
   - Name it `human.glb` (or update the path in `ModelViewer.jsx`)
   - You can find free 3D human models on sites like:
     - [Sketchfab](https://sketchfab.com)
     - [Poly Haven](https://polyhaven.com)
     - [Free3D](https://free3d.com)

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
3dtattooweb/
├── public/                    # Static assets
│   ├── models/               # 3D model files (GLB/GLTF)
│   └── index.html            # HTML entry point
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── 3D/               # 3D-specific components
│   │   ├── ErrorBoundary.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   └── TattooControls.jsx
│   ├── constants/            # Application constants
│   ├── config/               # Configuration files
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Page-level components
│   ├── utils/                # Utility functions
│   ├── App.jsx               # Main app component
│   └── main.jsx               # Application entry point
├── package.json
└── README.md
```

## Available Scripts

- `npm start` - Runs the app in development mode (port 3000)
- `npm run build` - Builds the app for production to the `build` folder
- `npm test` - Launches the test runner
- `npm run lint` - Runs ESLint

## Environment Variables

Create a `.env` file in the root directory (optional):

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_ERROR_TRACKING=false
REACT_APP_NAME=3D Tattoo Web
REACT_APP_VERSION=1.0.0
```

**Note**: In Create React App, environment variables must be prefixed with `REACT_APP_` to be accessible in the code.

## Usage

1. **Upload a Tattoo**: Click "Upload Tattoo" and select a PNG or JPEG image (max 10MB)
2. **Place the Tattoo**: Click anywhere on the 3D model to place the tattoo
3. **Adjust the Tattoo**: 
   - Use the rotation slider to rotate the tattoo
   - Use the scale slider to resize the tattoo
   - Drag the tattoo to move it on the model surface
4. **Control the Model**: 
   - Use mouse/touch to rotate, zoom, and pan the model
   - Lock rotation or zoom using the control buttons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires WebGL support.

## Performance

- Initial load: < 3 seconds
- Model load: < 2 seconds
- Interaction response: < 100ms

## Future Enhancements

- Save/load tattoo designs
- Multiple model options (male/female)
- Export designs as images
- User authentication
- Design gallery
- Backend API integration
- Real-time collaboration
- Tattoo design templates
- Color adjustment tools
- Multiple tattoo layers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - Open source project

## Troubleshooting

### Model not loading
- Ensure the model file is in `public/models/human.glb`
- Check the browser console for errors
- Verify the model file is a valid GLB/GLTF format

### Tattoo not appearing
- Ensure the image file is PNG or JPEG
- Check file size is under 10MB
- Verify the image has transparency (PNG) for best results

### Performance issues
- Use optimized 3D models (lower polygon count)
- Compress texture images
- Close other browser tabs

## Support

For issues and questions, please open an issue on the GitHub repository.

