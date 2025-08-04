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

This is a Preact-based admin interface for a content management system with the following structure:

### Core Architecture

- **Framework**: Preact with Vite build system
- **Language**: TypeScript with JSX
- **Styling**: CSS-in-JS approach using a custom styling system
- **State Management**: Custom message-based reactive system (`Msg` class)
- **Routing**: Custom router implementation in `src/controllers/Router.ts`

### Key Directories

- `src/app.ts` - Main application entry point that combines API, helpers, messages, and controllers
- `src/components/` - Reusable UI components including main App component
- `src/pages/` - Page-level components (Groups, Members, Contents, Devices, Medias, Account, Auth)
- `src/controllers/` - Application logic and routing
- `src/messages/` - Reactive state management messages
- `src/pages/Content/` - Specialized content type components

### Shared Dependencies

- References `@common` shared library via path alias (`../common`)
- Uses `@common/api`, `@common/helpers`, `@common/hooks`, and `@common/components`
- React compatibility layer for Preact (`react` and `react-dom` aliases point to `preact/compat`)

### Path Aliases

- `@/*` maps to `./src/*`
- `@common/*` maps to `./common/*`
- `react` and `react-dom` map to Preact compatibility layer

### Admin Pages

The application supports these admin pages via routing:
- `account` - User account management
- `groups` - Group management
- `members` - Member management per group
- `devices` - Device management per group  
- `contents` - Content listing and management per group
- `content` - Individual content editing
- `medias` - Media management per group

### State Management Pattern

Uses a custom reactive messaging system where:
- `adminPage$` controls current admin page
- `groupKey$` and `group$` manage selected group context
- `contentKey$` and `content$` manage selected content context
- Router updates trigger state changes via message subscriptions