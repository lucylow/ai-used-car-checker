# CarWise Frontend V2

A Cursor-ready React Native / Expo frontend redesign layer for the existing CarWise app.

## Size

The package contains roughly 4,230 lines of JavaScript frontend code, which is approximately 100 code-editor pages at a 40–45 line/page view. Your editor's wrapping/font settings will change the visual page count.

## Main entry point

```js
import { RedesignShell } from './src/redesign';
```

## Included

- complete visual system
- animated primitives
- market charts
- vehicle health map
- AI risk/finding components
- photo/video/voice/document composer
- camera studio
- evidence review
- report composer
- contract preview
- certificate experience
- negotiation experience
- paywall
- notifications
- garage/history
- profile/settings
- visual QA lab
- design-system reference screen
- demo journey
- presentation showcase
- App.js integration notes

## Start here in Cursor

1. Copy `src/redesign` into the CarWise repo.
2. Open `CURSOR_INTEGRATION_PROMPT.md`.
3. Ask Cursor to integrate `RedesignShell` into the existing `App.js` while preserving current business logic and service functions.
4. Read [`CARWISE_REDESIGN_INTEGRATION_MAP.md`](../../CARWISE_REDESIGN_INTEGRATION_MAP.md) for route, state, and action mappings.
5. Follow [`CARWISE_CURSOR_MIGRATION_CHECKLIST.md`](../../CARWISE_CURSOR_MIGRATION_CHECKLIST.md) for the phased migration and runtime QA.
6. Use `showcase`, `design-system`, and `visual-states` during QA.
7. Turn the redesign on behind a temporary feature flag before deleting old UI.

## Important

This package is a frontend redesign layer. It should call the existing CarWise handlers for real media capture, local persistence, AI analysis, report generation, and navigation.
