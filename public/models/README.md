# 3D Models Directory

Place your 3D human model files here.

## Requirements

- **Format**: GLB or GLTF format
- **Recommended**: GLB (binary format, smaller file size)
- **File name**: `human.glb` (or update the path in `ModelViewer.jsx`)
- **Optimization**: 
  - Compress textures
  - Keep polygon count reasonable (< 50k triangles for good performance)
  - Use compressed texture formats when possible

## Where to Find Models

- [Sketchfab](https://sketchfab.com) - Search for "human model" or "character model"
- [Poly Haven](https://polyhaven.com) - Free 3D assets
- [Free3D](https://free3d.com) - Free 3D models
- [Mixamo](https://www.mixamo.com) - Character models (may need conversion)

## Model Setup Tips

1. **Scale**: Ensure the model is properly scaled (typically 1-2 units tall)
2. **Position**: Model should be centered at origin (0, 0, 0)
3. **Textures**: Include texture files or embed in GLB
4. **Format**: GLB is preferred over GLTF for single-file distribution

## Example

```
public/
  models/
    human.glb          # Main model file
    human_texture.png  # Texture (if not embedded)
```

## Testing

After adding a model, test it by:
1. Starting the dev server: `npm start`
2. Navigating to the Create New page
3. Verifying the model loads correctly
4. Checking browser console for any errors

## Troubleshooting

- **Model not loading**: Check file path and format
- **Model appears too large/small**: Adjust camera position in `ModelViewer.jsx`
- **Model appears dark**: Check lighting setup in `ModelViewer.jsx`
- **Performance issues**: Optimize model (reduce polygons, compress textures)

