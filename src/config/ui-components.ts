/**
 * UI Components Feature Flags
 * Control visibility and functionality of UI components via environment variables
 * 
 * Environment variables (prefix with VITE_ for Vite):
 * VITE_UI_ACCORDION=true|false
 * VITE_UI_ALERT_DIALOG=true|false
 * VITE_UI_ALERT=true|false
 * VITE_UI_BUTTON=true|false
 * VITE_UI_COLLAPSIBLE=true|false
 * VITE_UI_CONTEXT_MENU=true|false
 * VITE_UI_DIALOG=true|false
 * VITE_UI_DROPDOWN_MENU=true|false
 * VITE_UI_GLOBAL_TOOLTIP=true|false
 * VITE_UI_INPUT=true|false
 * VITE_UI_LABEL=true|false
 * VITE_UI_PROGRESS=true|false
 * VITE_UI_RESIZABLE=true|false
 * VITE_UI_SCROLL_AREA=true|false
 * VITE_UI_SELECT=true|false
 * VITE_UI_SEPARATOR=true|false
 * VITE_UI_SLIDER=true|false
 * VITE_UI_SONNER=true|false
 * VITE_UI_SWITCH=true|false
 * VITE_UI_TABS=true|false
 * VITE_UI_TEXTAREA=true|false
 * VITE_UI_TOOLTIP=true|false
 */

const parseBoolean = (value: string | undefined, defaultValue: boolean = true): boolean => {
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1' || value === 'yes';
};

export const UI_COMPONENTS = {
  accordion: parseBoolean(import.meta.env.VITE_UI_ACCORDION),
  alertDialog: parseBoolean(import.meta.env.VITE_UI_ALERT_DIALOG),
  alert: parseBoolean(import.meta.env.VITE_UI_ALERT),
  button: parseBoolean(import.meta.env.VITE_UI_BUTTON),
  collapsible: parseBoolean(import.meta.env.VITE_UI_COLLAPSIBLE),
  contextMenu: parseBoolean(import.meta.env.VITE_UI_CONTEXT_MENU),
  dialog: parseBoolean(import.meta.env.VITE_UI_DIALOG),
  dropdownMenu: parseBoolean(import.meta.env.VITE_UI_DROPDOWN_MENU),
  globalTooltip: parseBoolean(import.meta.env.VITE_UI_GLOBAL_TOOLTIP),
  input: parseBoolean(import.meta.env.VITE_UI_INPUT),
  label: parseBoolean(import.meta.env.VITE_UI_LABEL),
  progress: parseBoolean(import.meta.env.VITE_UI_PROGRESS),
  resizable: parseBoolean(import.meta.env.VITE_UI_RESIZABLE),
  scrollArea: parseBoolean(import.meta.env.VITE_UI_SCROLL_AREA),
  select: parseBoolean(import.meta.env.VITE_UI_SELECT),
  separator: parseBoolean(import.meta.env.VITE_UI_SEPARATOR),
  slider: parseBoolean(import.meta.env.VITE_UI_SLIDER),
  sonner: parseBoolean(import.meta.env.VITE_UI_SONNER),
  switch: parseBoolean(import.meta.env.VITE_UI_SWITCH),
  tabs: parseBoolean(import.meta.env.VITE_UI_TABS),
  textarea: parseBoolean(import.meta.env.VITE_UI_TEXTAREA),
  tooltip: parseBoolean(import.meta.env.VITE_UI_TOOLTIP),
} as const;

/**
 * Check if a UI component is enabled
 * @param component - The component name (key in UI_COMPONENTS)
 * @returns true if enabled, false if disabled
 */
export const isUIComponentEnabled = (
  component: keyof typeof UI_COMPONENTS
): boolean => {
  return UI_COMPONENTS[component];
};

/**
 * Conditionally render based on component enabled status
 * @param component - The component name
 * @param children - Element to render if component is enabled
 * @returns Element if enabled, null if disabled
 */
export const withUIComponentFeatureFlag = (
  component: keyof typeof UI_COMPONENTS,
  children: React.ReactNode
): React.ReactNode => {
  return isUIComponentEnabled(component) ? children : null;
};
