# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server at http://localhost:5173/
- `pnpm build` - Build for production, emitting to `dist/`
- `pnpm preview` - Start preview server at http://localhost:4173/ to test production build

### Linting and Type Checking

- `npx eslint .` - Run ESLint on the codebase
- `npx tsc --noEmit` - Type check TypeScript without emitting files

## Architecture Overview

This is a multi-interface content management system with three main applications: admin interface, device interface, and content viewer. Built with Preact and TypeScript.

### Core Architecture

- **Framework**: Preact with Vite build system
- **Language**: TypeScript with JSX
- **PWA**: Vite PWA plugin with Workbox for service worker generation and offline support
- **Styling**: CSS-in-JS approach using a custom styling system with `useCss` hook and `Css` objects
- **State Management**: Custom message-based reactive system (`Msg` class with `useMsg` hook)
- **Routing**: Custom router implementation handling multiple application routes

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
- Uses `@common/api`, `@common/helpers`, `@common/hooks`, and `@common/components`
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

Uses a custom reactive messaging system where:

- `adminPage$` controls current admin page
- `groupKey$` and `group$` manage selected group context
- `contentKey$` and `content$` manage selected content context
- `device$` manages device state and pairing status
- Router updates trigger state changes via message subscriptions

### CSS-in-JS Pattern

Components use the `useCss` hook with `Css` objects:

```typescript
const css: Css = {
  '&': { /* component root styles */ },
  '&Container': { /* nested element styles */ },
  '&Title': { /* title styles */ }
};

const Component = () => {
  const c = useCss('ComponentName', css);
  return <Div cls={c}>Content</Div>;
};
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
