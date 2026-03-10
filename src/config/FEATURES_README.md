# Feature Flags Configuration

This system allows you to enable/disable major features via environment variables, giving you complete control over which sections of the application are visible and functional.

## Quick Start

The default `.env.example` is pre-configured to show only:
- **Media Library** - Import and manage media files
- **Timeline** - Edit timeline composition
- **Effects** - Add and manage effects
- **Player** - Preview/playback video

All other features are disabled.

## Features Available

| Feature | Environment Variable | Default | Purpose |
|---------|----------------------|---------|---------|
| Media Library | `VITE_FEATURE_MEDIA_LIBRARY` | `true` | Import and manage media clips |
| Timeline | `VITE_FEATURE_TIMELINE` | `true` | Main timeline editing interface |
| Effects | `VITE_FEATURE_EFFECTS` | `true` | Add and configure effects |
| Player | `VITE_FEATURE_PLAYER` | `true` | Video preview and playback |
| Keyframes | `VITE_FEATURE_KEYFRAMES` | `false` | Keyframe animation editor |
| Export | `VITE_FEATURE_EXPORT` | `false` | Export/render videos |
| Settings | `VITE_FEATURE_SETTINGS` | `false` | Project and app settings |
| Project Bundle | `VITE_FEATURE_PROJECT_BUNDLE` | `false` | Project bundling |
| Composition Runtime | `VITE_FEATURE_COMPOSITION_RUNTIME` | `false` | Composition runtime system |

## Setup

### 1. Create a `.env` file

```bash
cp .env.example .env
```

### 2. Configure Features

Edit `.env` and set the features you want:

```env
VITE_FEATURE_MEDIA_LIBRARY=true
VITE_FEATURE_TIMELINE=true
VITE_FEATURE_EFFECTS=true
VITE_FEATURE_PLAYER=true
VITE_FEATURE_KEYFRAMES=false
VITE_FEATURE_EXPORT=false
VITE_FEATURE_SETTINGS=false
VITE_FEATURE_PROJECT_BUNDLE=false
VITE_FEATURE_COMPOSITION_RUNTIME=false
```

### 3. Restart Dev Server

```bash
npm run dev
```

## Usage in Code

### Import the config

```typescript
import { 
  isFeatureEnabled, 
  withFeatureFlag, 
  FEATURES 
} from '@/config/features';
```

### Method 1: Direct condition check

```typescript
if (isFeatureEnabled('mediaLibrary')) {
  // Feature is enabled, render the component
}
```

### Method 2: Conditional JSX rendering

```typescript
export function EditorLayout() {
  return (
    <div>
      {isFeatureEnabled('timeline') && (
        <Timeline />
      )}
      
      {isFeatureEnabled('effects') && (
        <EffectsPanel />
      )}
    </div>
  );
}
```

### Method 3: Using wrapper helper

```typescript
export function PreviewSection() {
  return (
    <div>
      {withFeatureFlag('player', (
        <VideoPlayer />
      ))}
    </div>
  );
}
```

### Method 4: Access all flags

```typescript
console.log(FEATURES);
// {
//   mediaLibrary: true,
//   timeline: true,
//   effects: true,
//   player: true,
//   keyframes: false,
//   ...
// }
```

## Common Configurations

### Minimal Setup (Import + Preview + Effects)
```env
VITE_FEATURE_MEDIA_LIBRARY=true
VITE_FEATURE_TIMELINE=true
VITE_FEATURE_EFFECTS=true
VITE_FEATURE_PLAYER=true
VITE_FEATURE_KEYFRAMES=false
VITE_FEATURE_EXPORT=false
VITE_FEATURE_SETTINGS=false
VITE_FEATURE_PROJECT_BUNDLE=false
VITE_FEATURE_COMPOSITION_RUNTIME=false
```

### Full Developer Setup (All features enabled)
```env
VITE_FEATURE_MEDIA_LIBRARY=true
VITE_FEATURE_TIMELINE=true
VITE_FEATURE_EFFECTS=true
VITE_FEATURE_PLAYER=true
VITE_FEATURE_KEYFRAMES=true
VITE_FEATURE_EXPORT=true
VITE_FEATURE_SETTINGS=true
VITE_FEATURE_PROJECT_BUNDLE=true
VITE_FEATURE_COMPOSITION_RUNTIME=true
```

### Export-Only Setup
```env
VITE_FEATURE_MEDIA_LIBRARY=false
VITE_FEATURE_TIMELINE=false
VITE_FEATURE_EFFECTS=false
VITE_FEATURE_PLAYER=true
VITE_FEATURE_EXPORT=true
VITE_FEATURE_SETTINGS=false
VITE_FEATURE_PROJECT_BUNDLE=false
VITE_FEATURE_COMPOSITION_RUNTIME=false
```

## Key Files

- `src/config/features.ts` - Main feature flags configuration
- `src/config/features.example.ts` - Usage examples
- `.env.example` - Template with all available features
- `.env` - Local configuration (create this, don't commit it)

## Notes

- All environment variables default to `true` if not specified
- Accepted boolean values: `'true'`, `'1'`, `'yes'` (case-sensitive)
- Changes to `.env` require restarting the dev server
- Features are disabled at runtime, not removed from the bundle (use for UI control, not bundle size)
- For production builds, consider using different `.env` files for different environments

## Combining with UI Component Flags

You can combine feature flags with UI component flags for fine-grained control:

```typescript
// Feature flag: Is the export feature enabled?
import { isFeatureEnabled as isFeatureEnabled } from '@/config/features';

// UI component flag: Is the button UI component enabled?
import { isUIComponentEnabled } from '@/config/ui-components';

export function ExportButton() {
  const canExport = isFeatureEnabled('export') && isUIComponentEnabled('button');
  
  return canExport ? <Button>Export</Button> : null;
}
```
