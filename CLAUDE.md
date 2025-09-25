# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server at http://localhost:5173/ with host access for device testing
- `pnpm build` - Build standard PWA for production, emitting to `dist/`
- `pnpm build:apk` - Build single-file APK version (no PWA features)
- `pnpm preview` - Start preview server at http://localhost:4173/ to test production build
- `pnpm analyze` - Build APK version and analyze bundle with vite-bundle-analyzer
- `pnpm analyze:open` - Build APK version and open bundle analysis in browser
- `pnpm format` - Format code using Prettier
- `pnpm format:check` - Check code formatting without changing files

### Linting and Type Checking

- `npx eslint .` - Run ESLint on the codebase
- `npx tsc --noEmit` - Type check TypeScript without emitting files

**Important:** Always run both linting and type checking after significant changes to ensure code quality.

### Build Modes

This application has a unique dual build system:

- **PWA Mode** (default): Full Progressive Web App with service worker, caching, and installability
- **APK Mode** (`pnpm build:apk`): Single-file HTML build optimized for Android APK packaging
  - Uses `vite-plugin-singlefile` to bundle everything into one HTML file
  - Disables PWA features for compatibility with APK environments
  - Includes bundle analysis tools for optimization

## Architecture Overview

This is a multi-interface content management system with three main applications: admin interface, device interface, and content viewer. Built with Preact and TypeScript.

### Core Architecture

- **Framework**: Preact 10.26.9 with Vite 6.0.4 build system and React compatibility layer
- **Language**: TypeScript with comprehensive type checking and JSX
- **PWA**: Vite PWA plugin with Workbox for offline-first architecture (disabled in APK mode)
- **Styling**: Custom CSS-in-JS system using `useCss(componentName, css)` hook with `Css` type objects
- **State Management**: Custom message-based reactive system (`Msg<T>` class with `useMsg` hook and localStorage persistence)
- **Routing**: Custom router with lazy loading, pattern matching, and multi-app support
- **Data Layer**: Collection-based API with TypeScript models, authentication, and real-time updates
- **Build Modes**: Dual build system - PWA mode for web deployment, APK mode for single-file Android packaging

### Application Structure

The application is split into three main interfaces:

#### 1. Admin Interface (`/admin/`)

- **Location**: `src/admin/`
- **Entry Point**: `src/admin/index.tsx`
- **Purpose**: Content management system administration
- **Pages**: Groups, Members, Devices, Contents, Medias, Account, Auth
- **Key Features**:
  - Device pairing with Dialog-based interface
  - Content management with CRUD operations
  - Group and member management

#### 2. Device Interface (`/device/`)

- **Location**: `src/device/`
- **Entry Point**: `src/device/index.tsx`
- **Purpose**: Device control and configuration interface
- **Key Features**:
  - Automatic pairing mode when device has no group
  - Settings pages: Kiosk, Actions, Password, Playlist, Site, Debug, Events
  - Device key-based pairing system

#### 3. Contents Viewer (`/:contentKey`)

- **Location**: `src/contents/`
- **Entry Point**: `ContentViewer.tsx`
- **Purpose**: Content visualization for different content types
- **Supported Types**: empty, form, table, html, playlist, hiboutik

### Key Directories

- `src/index.tsx` - Main application routing between admin, device, and contents
- `src/admin/` - Admin interface components and pages
- `src/device/` - Device interface components and pages
- `src/contents/` - Content viewer components for different content types
- `src/controllers/` - Application logic and routing
- `src/messages/` - Reactive state management messages

### Shared Dependencies

- References `@common` shared library via path alias (`../common`)
- Uses `@common/api`, `@common/utils`, `@common/hooks`, and `@common/components`
- React compatibility layer for Preact (`react` and `react-dom` aliases point to `preact/compat`)

### Path Aliases

- `@/*` maps to `./src/*`
- `@common/*` maps to `./common/*`
- `react` and `react-dom` map to Preact compatibility layer

### Device Pairing System

Devices without an assigned group automatically display the `PairingPage` which:

- Shows the device's unique key as the pairing code
- Uses a spinner animation while waiting for pairing
- Integrates with the admin interface's device management

### Content System

The content viewer supports multiple content types:

- **Empty**: Basic empty content display
- **Form**: Interactive form content
- **Table**: Tabular data display
- **HTML**: Raw HTML content rendering
- **Playlist**: Media playlist interface
- **Hiboutik**: Integration with Hiboutik POS system

### State Management Pattern

Uses a custom reactive messaging system with persistent storage:

**Key Message Patterns:**

- `adminPage$` - Controls current admin page navigation
- `groupKey$` and `group$` - Manage selected group context across admin interface
- `contentKey$` and `content$` - Manage selected content context
- `device$` - Manages device state, pairing status, and online status
- `auth$` - Global authentication state with token management

**Message Creation Pattern:**

```typescript
export const message$ = new Msg<Type>(defaultValue, 'storageKey', persist?, validator?);
const value = useMsg(message$); // Auto-reactive in components
message$.set(newValue); // Update from anywhere
```

**Router Integration:** Router updates automatically trigger state changes via message subscriptions, enabling deep-linking and browser history support.

### CSS-in-JS Pattern

This codebase uses a custom CSS-in-JS system with powerful utility functions:

```typescript
const css = Css('ComponentName', {
  '': { 
    fCol: 1,           // display: flex; flex-direction: column
    p: 2,              // padding: 2em
    bg: 'primary'      // background-color: var(--primary-color)
  },
  'Container': { 
    fRow: ['center', 'space-between'], // flex-row with alignment
    w: 20,             // width: 20em
    elevation: 2       // box-shadow with depth
  }
});

const Component = () => {
  const c = useCss('ComponentName', css);
  return (
    <div class={c()}>           {/* Root component class */}
      <div class={c('Container')}>Content</div>  {/* Nested element */}
    </div>
  );
};
```

#### Available CSS Utility Functions

**Layout & Positioning:**
- `x`, `y`, `xy` - left/top positioning (em units)
- `l`, `t`, `r`, `b` - individual sides (em units) 
- `inset` - all sides positioning
- `w`, `h`, `wh` - width/height (em units)
- `wMax`, `hMax`, `whMax` - max dimensions
- `wMin`, `hMin`, `whMin` - min dimensions

**Flexbox:**
- `fRow: 1 | [] | [align] | [align, justify]` - flex-direction: row
- `fCol: 1 | [] | [align] | [align, justify]` - flex-direction: column  
- `fCenter: 1 | [] | [direction]` - centered flex container

**Spacing:**
- `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` - margins (em units)
- `p`, `pt`, `pb`, `pl`, `pr`, `px`, `py` - padding (em units)

**Visual:**
- `bg: 'colorKey'` - background color from theme
- `fg: 'colorKey'` - text color from theme
- `elevation: number` - box-shadow with depth (0-10)
- `rounded: number` - border-radius (multiplied by 0.2em)
- `fontSize: number` - font size (em units)
- `bold: 1 | 0` - font-weight: bold

**Transforms & Animation:**
- `rotate`, `scale`, `scaleX`, `scaleY`, `translate`, `translateX`, `translateY`
- `transition: number | string | boolean` - CSS transitions
- `anim: AnimValue` - CSS animations with keyframes

**Background & Images:**
- `bgUrl: 'url'` - background-image
- `bgMode: 'contain' | 'cover' | 'fill'` - background sizing
- `itemFit: 'contain' | 'cover' | 'fill'` - object-fit for images/videos

#### Usage Examples:

```typescript
// Simple flex layout
const css = Css('MyComponent', {
  '': { fCol: 1, p: 2, bg: 'background' },
  'Header': { fRow: ['center', 'space-between'], pb: 1 },
  'Content': { fCol: ['stretch'], flex: 1 }
});

// Responsive sizing with elevation
const cardCss = Css('Card', {
  '': { 
    w: [20, 30],           // responsive width
    elevation: 2,          // shadow depth
    rounded: 3,            // border radius
    p: [1, 2],            // responsive padding
    transition: 0.2        // smooth transitions
  }
});
```

## PWA Configuration

The application is configured as a Progressive Web App (PWA) using Vite PWA plugin:

### Service Worker

- **Auto-generated**: Workbox generates service worker automatically
- **Auto-update**: Service worker updates automatically on new builds
- **Precaching**: All build assets are precached for offline access
- **Runtime caching**: External resources (fonts, media, scripts) are cached with appropriate strategies

### Caching Strategies

- **M4K Fonts**: CacheFirst strategy for `https://fonts.m4k.fr/`
- **Media Files**: StaleWhileRevalidate with 7-day expiration for `/files/*.{jpg,png,pdf,mp4,etc}`
- **External Assets**: CacheFirst with 30-day expiration for external CSS/JS/fonts

### Offline Support

- **Full offline capability**: All application code and resources work without internet connection
- **Background updates**: New versions downloaded in background and activated on next visit

### PWA Integration

- **Admin & Device apps**: Service worker registration via `usePWA()` hook in App components
- **Automatic registration**: PWA registers automatically on app load
- **Update notifications**: Can be extended to show update prompts to users

### Build Process

- **Asset optimization**: All assets optimized and fingerprinted for caching
- **Manifest generation**: Web app manifest generated for installability

## Data Layer Architecture

### API Collection Pattern

The codebase uses a collection-based API system with type-safe operations:

```typescript
// Collection usage pattern
const items = await contentColl.find({ group: groupId });
const item = await contentColl.get(id);
const newItem = await contentColl.create({ name: 'New Item', group: groupId });
await contentColl.update(id, { name: 'Updated Name' });
await contentColl.delete(id);
```

**Available Collections:**

- `contentColl` - Content management (forms, tables, HTML, playlists)
- `deviceColl` - Device registration, status, and control
- `mediaColl` - File and media management with upload support
- `groupColl` - Organization and access control
- `memberColl` - User-group relationships with role-based permissions
- `userColl` - User management and authentication

### Model Generation System

Models are generated in `common/api/models.generated.ts` from backend schema:

- **Base interfaces** (prefixed with `_`) contain raw API fields
- **Extended interfaces** add client-specific typing and computed properties
- **Role-based access** via `Role.admin > Role.editor > Role.viewer` hierarchy

### Authentication Flow

```typescript
// Authentication pattern
const auth = useMsg(auth$); // { id, email, token, ...UserModel }
if (!auth) {
  // Redirect to login or show auth UI
  return <AuthPage />;
}
// User is authenticated, proceed with app
```

## Device Integration Architecture

### Device Pairing System

- **Automatic pairing mode**: Devices without groups show `PairingPage`
- **Unique device keys**: Generated UUID-based pairing codes
- **Real-time status**: Online/offline tracking with heartbeat system
- **Action execution**: Remote command system for device control

### Device Communication Patterns

- **Heartbeat system**: Regular status updates every 10 seconds
- **Command execution**: `action` and `input` fields for remote operations
- **Result handling**: Structured response with success/error states
- **Media synchronization**: Playlist and content caching system

## Development Patterns

### Component Creation Pattern

```typescript

import { Css } from '@common/utils';
import { Button } from '@common/components';

const c = Css('', {
  '': { /* component root */ },
  'Item': { /* nested element */ }
};

export const MyComponent = ({ children }: { children?: any }) => {
  const c = useCss('MyComponent', css);
  return (
    <div  class={c()}>
      <div class={c('Item')}>
        {children}
      </div>
    </div>
  );
};
```

### Adding New Content Types

1. Define interface in `common/api/models.ts`:

```typescript
export interface MyContentModel extends ContentModel {
  type: 'my-type';
  data: { customField: string };
}
```

2. Create viewer in `src/contents/MyTypeContent.tsx`
3. Register in `src/contents/index.tsx` content type mapping

### Error Handling Patterns

- **API errors**: Use `.catch(showError)` for user-friendly error display
- **Form validation**: Integrated with `Field` component validation system
- **Network resilience**: Automatic retry logic and offline queue management

## Important Development Guidelines

**Code Changes:**
- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary for achieving your goal
- ALWAYS prefer editing existing files to creating new ones
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested

**Code Quality:**
- NEVER add comments unless specifically asked
- Always run linting and type checking after significant changes
- Follow existing code conventions and patterns in the codebase
- Use TypeScript types consistently throughout the codebase

**Component Patterns:**
- Use `useCss('ComponentName', css)` hook for styling with `Css` objects
- Follow the established message-based reactive state management pattern
- Prefer `preact/hooks` imports over React equivalents due to compatibility layer
- Use `class` prop instead of `className` for Preact compatibility

**Utility Functions:**
- The codebase uses custom utility functions in `common/utils/` 
- List manipulation functions like `addItem`, `removeIndex`, `moveIndex`, `setItemIndex` support circular indexing
- Use `normalizeIndex` for safe array index calculations with negative values and overflow handling
