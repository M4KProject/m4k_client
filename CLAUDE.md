# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server at http://localhost:5173/ with host access for device testing
- `npm run build` - Build standard PWA for production, emitting to `dist/`
- `npm run build:apk` - Build single-file APK version (no PWA features)
- `npm run preview` - Start preview server at http://localhost:4173/ to test production build
- `npm run analyze` - Build APK version and analyze bundle with vite-bundle-analyzer
- `npm run analyze:open` - Build APK version and open bundle analysis in browser
- `npm run format` - Format code using Prettier
- `npm run format:check` - Check code formatting without changing files

### Linting and Type Checking

- `npx eslint .` - Run ESLint on the codebase
- `npx eslint . --fix` - Run ESLint and auto-fix issues
- `npx tsc --noEmit` - Type check TypeScript without emitting files

**Important:** Always run both linting and type checking after significant changes to ensure code quality.

**TypeScript Configuration:**

- Strict mode enabled with comprehensive checks
- `noUncheckedIndexedAccess: true` - Requires null checks for array/object access
- `jsx: "react-jsx"` with `jsxImportSource: "preact"` - Preact JSX transform
- Path aliases configured for `@/`, `@common/`, `fluxio/`, `pblite/`

### Build Modes

This application has a unique dual build system:

- **PWA Mode** (default): Full Progressive Web App with service worker, caching, and installability
- **APK Mode** (`npm run build:apk`): Single-file HTML build optimized for Android APK packaging
  - Uses `vite-plugin-singlefile` to bundle everything into one HTML file
  - Disables PWA features for compatibility with APK environments
  - Includes bundle analysis tools for optimization

## Architecture Overview

This is a multi-interface content management system with three main applications: admin interface, device interface, and content viewer. Built with Preact and TypeScript.

### Core Architecture

- **Framework**: Preact 10.26.9 with Vite 6.0.4 build system and React compatibility layer
- **Language**: TypeScript with comprehensive type checking and JSX
- **Workspace**: pnpm workspace with local packages (fluxio, pblite, common as Git submodules)
- **PWA**: Vite PWA plugin with Workbox for offline-first architecture (disabled in APK mode)
- **Styling**: Custom CSS-in-JS system using `useCss(componentName, css)` hook with `Css` type objects
- **State Management**: Custom message-based reactive system (`Flux<T>` class with `useFlux` hook and localStorage persistence)
- **Routing**: Custom router with lazy loading, pattern matching, and multi-app support
- **Data Layer**: Collection-based API with TypeScript models, authentication, and real-time updates (via `pblite` package)
- **Build Modes**: Dual build system - PWA mode for web deployment, APK mode for single-file Android packaging

### Application Structure

The application is split into three main interfaces, with routing determined at startup:

#### Routing Logic (`src/index.tsx`)

The main entry point determines which interface to load:

1. Checks `isDevice$` flux message (persisted in localStorage)
2. If unset, checks `m4k.isInterface` (Android kiosk detection)
3. Routes to either admin or device interface
4. Initializes service worker and responsive listeners

```typescript
// Routing pattern
const isDevice = isDevice$.get() || m4k.isInterface;
if (isDevice) {
  mountDevice(); // Load device interface
} else {
  mountAdmin(); // Load admin interface
}
```

#### 1. Admin Interface (`/admin/`)

- **Location**: `src/admin/`
- **Entry Point**: `src/admin/index.tsx` → `mountAdmin()`
- **Purpose**: Content management system administration
- **Pages**: Groups, Members, Devices, Contents, Medias, Account, Auth
- **Key Features**:
  - Device pairing with Dialog-based interface
  - Content management with CRUD operations
  - Group and member management
  - Media library with upload support

#### 2. Device Interface (`/device/`)

- **Location**: `src/device/`
- **Entry Point**: `src/device/index.tsx` → `mountDevice()`
- **Purpose**: Device control and configuration interface
- **Key Features**:
  - Automatic pairing mode when device has no group
  - Settings pages: Kiosk, Actions, Password, Playlist, Site, Debug, Events
  - Device key-based pairing system
  - Content playback and playlist management

#### 3. Contents Viewer (Future/Planned)

- **Location**: `src/contents/` (referenced but not fully implemented)
- **Purpose**: Content visualization for different content types
- **Supported Types**: empty, form, table, html, playlist, hiboutik

### Key Directories

- `src/index.tsx` - Main application entry point (routes between admin/device based on `isDevice$`)
- `src/admin/` - Admin interface components and pages
  - `components/` - Admin-specific components (Apps, Errors, GroupGrid, MemberGrid, SideBar, etc.)
  - `pages/` - Admin page components
- `src/device/` - Device interface components and pages
  - `pages/` - Device pages (KioskPage, PairingPage, PlaylistPage, ActionsPage, etc.)
- `src/components/` - Shared components used across interfaces (AuthForm, medias/)
- `src/shared/` - Legacy shared code (prefer `@common` for new shared code)
- `src/router/` - Custom routing logic

### Shared Dependencies

- References `@common` shared library via path alias (`../common`)
- Uses `@common/api`, `fluxio`, `@common/hooks`, and `@common/components`
- React compatibility layer for Preact (`react` and `react-dom` aliases point to `preact/compat`)

### Path Aliases

- `@/*` maps to `./src/*`
- `@common/*` maps to `./common/*` (Git submodule)
- `pblite` and `pblite/*` map to `./pblite/src` (Git submodule)
- `fluxio` and `fluxio/*` map to `./fluxio/src` (Git submodule)
- `react` and `react-dom` map to Preact compatibility layer (`preact/compat`)

### Local Packages & Git Submodules

This project uses three local packages as Git submodules:

**fluxio** - Lightweight reactive state management and CSS-in-JS utilities

- Zero runtime dependencies
- Exports: `Flux`, `flux`, `Css`, `useCss`, array/string/object utilities, logger, etc.
- See [fluxio/CLAUDE.md](fluxio/CLAUDE.md) for detailed documentation

**pblite** - PocketBase client for API communication

- Type-safe collection-based API client
- Real-time subscriptions and authentication

**common** - Shared UI component library and utilities ([@common](common/))

- 18 production-ready Preact components (Button, Field, Dialog, Table, etc.)
- Custom hooks (useFlux, useAsync, usePromise, etc.)
- M4K Android kiosk device integration
- Theme system and responsive design utilities
- See [common/CLAUDE.md](common/CLAUDE.md) for detailed documentation

**Submodule Management:**

```bash
# Update submodules
git submodule update --remote

# Update specific submodule
cd common && git pull origin main && cd ..
git add common && git commit -m "Update common submodule"
```

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
export const message$ = fluxStored<Type>(defaultValue, 'storageKey', persist?, validator?);
const value = useFlux(message$); // Auto-reactive in components
message$.set(newValue); // Update from anywhere
```

**Router Integration:** Router updates automatically trigger state changes via message subscriptions, enabling deep-linking and browser history support.

### CSS-in-JS Pattern

This codebase uses a custom CSS-in-JS system with powerful utility functions:

```typescript
const css = Css('ComponentName', {
  '': {
    col: 1,           // display: flex; flex-direction: column
    p: 2,              // padding: 2px
    bg: 'primary'      // background-color: var(--primary-color)
  },
  'Container': {
    row: ['center', 'between'], // flex-row with alignment
    w: 160,             // width: 20px
    elevation: 2       // box-shadow with depth
  }
});

const Component = () => {
  const c = useCss('ComponentName', css);
  return (
    <div {...c()}>           {/* Root component class */}
      <div {...c('Container')}>Content</div>  {/* Nested element */}
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

- `row: [] | [] | [align] | [align, justify]` - flex-direction: row
- `col: [] | [] | [align] | [align, justify]` - flex-direction: column
- `center: [] | [] | [direction]` - centered flex container

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
  '': { col: 1, p: 2, bg: 'background' },
  Header: { row: ['center', 'space-between'], pb: 1 },
  Content: { col: ['stretch'], flex: 1 },
});

// Responsive sizing with elevation
const cardCss = Css('Card', {
  '': {
    w: [20, 30], // responsive width
    elevation: 2, // shadow depth
    rounded: 3, // border radius
    p: [1, 2], // responsive padding
    transition: 0.2, // smooth transitions
  },
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

The codebase uses a collection-based API system with type-safe operations via the `pblite` PocketBase client:

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

### PocketBase Client Configuration

The API URL is dynamically configured in `src/index.tsx`:

- **Development** (localhost with port): Uses `https://i.m4k.fr/api/`
- **Production**: Uses the configured PocketBase URL

Access the client with:

```typescript
import { getPbClient } from 'pblite';
const pbClient = getPbClient();
```

### Model Generation System

Models are auto-generated using the `generator.ts` script:

- Run manually when backend schema changes
- Outputs TypeScript interfaces to appropriate model files
- **Base interfaces** (prefixed with `_`) contain raw API fields
- **Extended interfaces** add client-specific typing and computed properties
- **Role-based access** via `Role.admin > Role.editor > Role.viewer` hierarchy

### Authentication Flow

```typescript
// Authentication pattern
const auth = useFlux(auth$); // { id, email, token, ...UserModel }
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
import { Css, useCss } from 'fluxio';
import { DivProps } from '@common/components';

const css = Css('MyComponent', {
  '': { col: 1, p: 2 },
  'Item': { row: ['center'], p: 1 }
});

export interface MyComponentProps extends DivProps {
  variant?: 'primary' | 'secondary';
}

export const MyComponent = ({ children, variant, ...props }: MyComponentProps) => {
  const c = useCss('MyComponent', css);
  return (
    <div {...props} {...c('', variant)}>
      <div {...c('Item')}>
        {children}
      </div>
    </div>
  );
};
```

**Important Notes:**

- Define `css` constant outside component (not inside)
- Call `useCss` inside component to get class name function
- Spread `{...props}` first, then `{...c()}` to allow prop overrides
- Extend `DivProps` for HTML attributes support
- Use Preact's `class` prop (not `className`)

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
- NEVER proactively create documentation files (\*.md) or README files unless explicitly requested

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

Fluxio provides comprehensive utility functions organized by category:

- **Array**: `addItem`, `removeIndex`, `moveIndex`, `setItemIndex`, `normalizeIndex` (circular indexing support)
- **Object**: `deepClone`, `deepMerge`, `pick`, `omit`, `mapValues`
- **String**: `capitalize`, `kebabCase`, `camelCase`, `snakeCase`, `truncate`
- **Async**: `debounce`, `throttle`, `sleep`, `retry`, `withTimeout`
- **Type Checking**: `isNil`, `isString`, `isNumber`, `isArray`, `isObject`, etc.
- **Casting**: `toNumber`, `toString`, `toArray`, `toBool`
- **Logger**: `logger('tag')` creates tagged loggers with automatic instance counting

Import from fluxio:

```typescript
import { normalizeIndex, deepClone, debounce, isNil, logger } from 'fluxio';
```

**M4K Android Integration:**

The `@common/m4k` module provides Android kiosk device integration:

```typescript
import { m4k } from '@common/m4k';

// Logging to Android device
m4k.d('Debug message');
m4k.i('Info message');
m4k.w('Warning');
m4k.e('Error');

// Device detection
if (m4k.isInterface) {
  // Running on M4K Android kiosk
}

// Event system
m4k.subscribe((event) => console.log(event));
m4k.signal({ type: 'custom', data: {} });
```

Supports M4K Bridge, Fully Kiosk Browser, and fallback for web browsers.
