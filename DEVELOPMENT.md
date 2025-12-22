# Development Guide

This document provides guidelines and best practices for developing the 3D Tattoo Web Application.

## Development Setup

### Prerequisites
- Node.js 14+ (16+ recommended)
- npm or yarn
- Code editor (VS Code recommended)
- Git

### Initial Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file from `.env.example` (optional)
4. Add 3D model to `public/models/human.glb`
5. Start dev server: `npm start`

## Code Standards

### Component Structure

```jsx
/**
 * Component Description
 * Additional details if needed
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * ComponentName component
 * @param {type} propName - Description
 */
const ComponentName = ({ propName }) => {
  // Component logic
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

ComponentName.propTypes = {
  propName: PropTypes.type.isRequired,
};

ComponentName.defaultProps = {
  propName: defaultValue,
};

export default ComponentName;
```

### File Naming

- Components: `PascalCase.jsx`
- Hooks: `camelCase.js` with `use` prefix
- Utilities: `camelCase.js`
- Constants: `index.js` or `camelCase.js`

### Best Practices

1. **Use Functional Components**: Always use functional components with hooks
2. **PropTypes**: Add PropTypes for all component props
3. **JSDoc Comments**: Document components and functions
4. **Error Handling**: Use error boundaries and try-catch blocks
5. **Performance**: Use `useCallback` and `useMemo` for expensive operations
6. **Accessibility**: Add ARIA labels and semantic HTML

## Project Structure

### Components

- **3D Components** (`src/components/3D/`): Three.js related components
- **UI Components** (`src/components/`): Reusable UI elements
- **Pages** (`src/pages/`): Route-level components

### State Management

- Use React hooks for local state
- Custom hooks for reusable state logic
- Context API for global state (if needed)

### Utilities

- **Error Handling** (`src/utils/errorHandler.js`): Error utilities
- **Model Preloading** (`src/utils/modelPreloader.js`): Model loading utilities

## 3D Development

### Working with Three.js

- Use React Three Fiber for React integration
- Use Drei helpers for common operations
- Optimize models for web (compressed textures, reasonable polygon count)

### Model Requirements

- Format: GLB or GLTF
- Recommended: GLB (binary, smaller file size)
- Texture format: PNG or JPEG
- Polygon count: < 50k triangles for good performance

### Decal Projection

- Tattoos are applied as decals using Three.js Decal geometry
- Decals project onto the model surface
- Use raycasting for click-to-place functionality

## Testing

### Manual Testing Checklist

- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Test error scenarios
- [ ] Test with different image sizes
- [ ] Test accessibility
- [ ] Test performance with large files

### Future: Automated Testing

- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Playwright or Cypress

## Debugging

### Common Issues

1. **Model not loading**
   - Check file path
   - Verify GLB/GLTF format
   - Check browser console

2. **Tattoo not appearing**
   - Verify texture URL
   - Check decal position
   - Ensure model is loaded

3. **Performance issues**
   - Check polygon count
   - Optimize textures
   - Use React DevTools Profiler

### Tools

- React DevTools
- Three.js Inspector
- Browser DevTools
- Performance Profiler

## Performance Optimization

1. **Code Splitting**: Use React.lazy() for route-level splitting
2. **Memoization**: Use useMemo and useCallback
3. **Model Optimization**: Compress models and textures
4. **Texture Compression**: Use compressed texture formats
5. **Cleanup**: Properly dispose of Three.js objects

## Accessibility

- Use semantic HTML
- Add ARIA labels
- Support keyboard navigation
- Ensure color contrast
- Test with screen readers

## Git Workflow

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes
3. Commit: `git commit -m "Description"`
4. Push: `git push origin feature/feature-name`
5. Create Pull Request

## Code Review Checklist

- [ ] Code follows style guidelines
- [ ] PropTypes are defined
- [ ] Error handling is implemented
- [ ] Performance considerations addressed
- [ ] Accessibility features included
- [ ] Documentation updated
- [ ] Tests pass (when available)

## Deployment

### Build Process

1. Run `npm run build`
2. Test build locally
3. Deploy `build/` folder to hosting service

### Recommended Hosting

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## Resources

- [React Documentation](https://react.dev)
- [Three.js Documentation](https://threejs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [React Three Drei](https://github.com/pmndrs/drei)

## Getting Help

- Check documentation
- Search existing issues
- Ask in discussions
- Create new issue with details

