# UI Components Feature Flags

This system allows you to enable/disable individual UI components via environment variables, giving you control over which components are available in your application.

## Setup

### 1. Create a `.env` file in the project root

Copy from `.env.example`:

```bash
cp .env.example .env
```

Or manually create it with the variables you want to override:

```env
VITE_UI_BUTTON=true
VITE_UI_DIALOG=false
VITE_UI_ACCORDION=true
```

### 2. Environment Variables

All UI component flags use the `VITE_` prefix (required for Vite to expose them):

| Component | Environment Variable | Default |
|-----------|----------------------|---------|
| Accordion | `VITE_UI_ACCORDION` | `true` |
| Alert Dialog | `VITE_UI_ALERT_DIALOG` | `true` |
| Alert | `VITE_UI_ALERT` | `true` |
| Button | `VITE_UI_BUTTON` | `true` |
| Collapsible | `VITE_UI_COLLAPSIBLE` | `true` |
| Context Menu | `VITE_UI_CONTEXT_MENU` | `true` |
| Dialog | `VITE_UI_DIALOG` | `true` |
| Dropdown Menu | `VITE_UI_DROPDOWN_MENU` | `true` |
| Global Tooltip | `VITE_UI_GLOBAL_TOOLTIP` | `true` |
| Input | `VITE_UI_INPUT` | `true` |
| Label | `VITE_UI_LABEL` | `true` |
| Progress | `VITE_UI_PROGRESS` | `true` |
| Resizable | `VITE_UI_RESIZABLE` | `true` |
| Scroll Area | `VITE_UI_SCROLL_AREA` | `true` |
| Select | `VITE_UI_SELECT` | `true` |
| Separator | `VITE_UI_SEPARATOR` | `true` |
| Slider | `VITE_UI_SLIDER` | `true` |
| Sonner | `VITE_UI_SONNER` | `true` |
| Switch | `VITE_UI_SWITCH` | `true` |
| Tabs | `VITE_UI_TABS` | `true` |
| Textarea | `VITE_UI_TEXTAREA` | `true` |
| Tooltip | `VITE_UI_TOOLTIP` | `true` |

## Usage

### Import the config

```typescript
import { 
  isUIComponentEnabled, 
  withUIComponentFeatureFlag, 
  UI_COMPONENTS 
} from '@/config/ui-components';
```

### Method 1: Direct condition check

```typescript
if (isUIComponentEnabled('button')) {
  // Component is enabled
}
```

### Method 2: Conditional JSX rendering

```typescript
export function MyComponent() {
  return (
    <div>
      {isUIComponentEnabled('dialog') && (
        <Dialog>Dialog content</Dialog>
      )}
    </div>
  );
}
```

### Method 3: Using wrapper helper

```typescript
export function MyComponent() {
  return (
    <div>
      {withUIComponentFeatureFlag('tabs', (
        <Tabs>Tabs content</Tabs>
      ))}
    </div>
  );
}
```

### Method 4: Access all flags directly

```typescript
console.log(UI_COMPONENTS);
// {
//   accordion: true,
//   button: false,
//   dialog: true,
//   ...
// }
```

## Examples

### Disable all UI components except essentials

```env
VITE_UI_ACCORDION=false
VITE_UI_ALERT_DIALOG=false
VITE_UI_ALERT=true
VITE_UI_BUTTON=true
VITE_UI_COLLAPSIBLE=false
VITE_UI_CONTEXT_MENU=false
VITE_UI_DIALOG=true
VITE_UI_DROPDOWN_MENU=false
VITE_UI_GLOBAL_TOOLTIP=false
VITE_UI_INPUT=true
VITE_UI_LABEL=true
VITE_UI_PROGRESS=false
VITE_UI_RESIZABLE=false
VITE_UI_SCROLL_AREA=true
VITE_UI_SELECT=false
VITE_UI_SEPARATOR=false
VITE_UI_SLIDER=false
VITE_UI_SONNER=false
VITE_UI_SWITCH=false
VITE_UI_TABS=false
VITE_UI_TEXTAREA=false
VITE_UI_TOOLTIP=false
```

### Different environments

Create separate `.env` files:
- `.env.local` - for local development
- `.env.staging` - for staging builds
- `.env.production` - for production builds

The build process can use these appropriately.

## Key Files

- `src/config/ui-components.ts` - Main configuration file
- `src/config/ui-components.example.ts` - Usage examples
- `.env.example` - Template with all available variables
- `.env` - Local configuration (create this, don't commit it)

## Notes

- All environment variables default to `true` if not specified
- Accepted boolean values: `'true'`, `'1'`, `'yes'` (case-sensitive)
- Changes to `.env` require restarting the dev server
- The feature flags are resolved at build time, enabling tree-shaking of disabled components
