# Quick Start Guide

Get up and running with the 3D Tattoo Web Application in minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Add a 3D Model

1. Create the models directory:
```bash
mkdir -p public/models
```

2. Add a GLB/GLTF human model file:
   - Download a free 3D human model from [Sketchfab](https://sketchfab.com) or [Mixamo](https://www.mixamo.com)
   - Save it as `human.glb` in the `public/models/` directory
   - Or update the model path in `src/components/3D/ModelViewer.jsx`

## Step 3: Start the Development Server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Step 4: Use the Application

1. **Upload a Tattoo**: 
   - Click "Upload Tattoo" button
   - Select a PNG or JPEG image (max 10MB)
   - Transparent PNGs work best

2. **Place the Tattoo**:
   - Click anywhere on the 3D model to place the tattoo
   - The tattoo will appear at the clicked location

3. **Adjust the Tattoo**:
   - Use the **Rotation** slider to rotate the tattoo
   - Use the **Scale** slider to resize the tattoo
   - Drag the tattoo to move it on the model surface

4. **Control the Model**:
   - **Rotate**: Click and drag to rotate the model
   - **Zoom**: Scroll or pinch to zoom
   - **Pan**: Right-click and drag (or middle mouse button)
   - **Lock Controls**: Use the lock buttons to disable rotation or zoom

## Troubleshooting

### Model Not Loading?
- Check that `public/models/human.glb` exists
- Verify the file is a valid GLB/GLTF format
- Check browser console for errors

### Tattoo Not Appearing?
- Ensure image is PNG or JPEG format
- Check file size is under 10MB
- Verify image uploaded successfully (check for success message)

### Performance Issues?
- Use optimized 3D models (lower polygon count)
- Compress texture images before uploading
- Close other browser tabs

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [DEVELOPMENT.md](DEVELOPMENT.md) for development guidelines
- See [IMPROVEMENTS.md](IMPROVEMENTS.md) for planned features

## Need Help?

- Check the browser console for error messages
- Review the documentation files
- Open an issue on GitHub

Happy tattooing! 🎨

