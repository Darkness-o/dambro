/**
 * Feature Flags Configuration
 * Control visibility and functionality of major features via environment variables
 * 
 * Environment variables (prefix with VITE_ for Vite):
 * VITE_FEATURE_MEDIA_LIBRARY=true|false - Import and manage media
 * VITE_FEATURE_TIMELINE=true|false - Timeline editing
 * VITE_FEATURE_EFFECTS=true|false - Add and manage effects
 * VITE_FEATURE_PLAYER=true|false - Video preview/playback
 * VITE_FEATURE_TEXT=true|false - Add text overlays
 * VITE_FEATURE_SHAPES=true|false - Add shapes
 * VITE_FEATURE_TRANSITIONS=true|false - Add transitions
 * VITE_FEATURE_KEYFRAMES=true|false - Keyframe animation editor
 * VITE_FEATURE_EXPORT=true|false - Export/render videos
 * VITE_FEATURE_SETTINGS=true|false - Project and app settings
 * VITE_FEATURE_PROJECT_BUNDLE=true|false - Project bundling
 * VITE_FEATURE_COMPOSITION_RUNTIME=true|false - Composition runtime
 */

const parseBoolean = (value: string | undefined, defaultValue: boolean = true): boolean => {
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1' || value === 'yes';
};

export const FEATURES = {
  mediaLibrary: parseBoolean(import.meta.env.VITE_FEATURE_MEDIA_LIBRARY),
  timeline: parseBoolean(import.meta.env.VITE_FEATURE_TIMELINE),
  effects: parseBoolean(import.meta.env.VITE_FEATURE_EFFECTS),
  player: parseBoolean(import.meta.env.VITE_FEATURE_PLAYER),
  text: parseBoolean(import.meta.env.VITE_FEATURE_TEXT),
  shapes: parseBoolean(import.meta.env.VITE_FEATURE_SHAPES),
  transitions: parseBoolean(import.meta.env.VITE_FEATURE_TRANSITIONS),
  keyframes: parseBoolean(import.meta.env.VITE_FEATURE_KEYFRAMES),
  export: parseBoolean(import.meta.env.VITE_FEATURE_EXPORT),
  settings: parseBoolean(import.meta.env.VITE_FEATURE_SETTINGS),
  projectBundle: parseBoolean(import.meta.env.VITE_FEATURE_PROJECT_BUNDLE),
  compositionRuntime: parseBoolean(import.meta.env.VITE_FEATURE_COMPOSITION_RUNTIME),
} as const;

/**
 * Check if a feature is enabled
 * @param feature - The feature name (key in FEATURES)
 * @returns true if enabled, false if disabled
 */
export const isFeatureEnabled = (
  feature: keyof typeof FEATURES
): boolean => {
  return FEATURES[feature];
};

/**
 * Conditionally render based on feature enabled status
 * @param feature - The feature name
 * @param children - Element to render if feature is enabled
 * @returns Element if enabled, null if disabled
 */
export const withFeatureFlag = (
  feature: keyof typeof FEATURES,
  children: React.ReactNode
): React.ReactNode => {
  return isFeatureEnabled(feature) ? children : null;
};
