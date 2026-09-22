# Cursor Prompt Addendum — CarWise V4 Mock Data + Multimodal Animation Layer

You are integrating an additive visual/demo layer into the existing CarWise React Native / Expo app.

Do NOT replace backend/state logic. Do NOT rewrite the app from scratch.

## Source of truth

Keep the existing CarWise state, navigation, API services, Context state, persistence and inspection logic as the production source of truth. The V4 package supplies visual fixtures, demonstration states, animation recipes and screen examples.

## Files

Copy:

`src/redesign-v4/**`

from this package into the project.

Start with:

`src/redesign-v4/index.js`

and:

`src/redesign-v4/V4ShowcaseScreens.js`

## Immediate goal

Make the existing app look like a premium mobile automotive product while keeping the current features working.

Use V4 fixtures to populate:

- Home hero
- VIN scanner
- Market intelligence
- photo capture
- video evidence
- voice notes
- document center
- AI analysis
- vehicle health map
- report
- negotiation
- copilot
- certificate
- contract/signature
- paywall
- notifications
- empty/loading/error/offline states

## Visual rules

1. Prefer real vehicle photography in cards and evidence surfaces.
2. Use the vehicle health map as the main visual abstraction for condition.
3. Link every AI finding to one or more evidence IDs.
4. Use charts instead of raw numeric dumps.
5. Make loading states meaningful: scanning, fetching, analyzing, generating.
6. Make errors recoverable without losing inspection progress.
7. Use the motion recipes instead of inventing arbitrary animation per screen.
8. Respect reduced-motion settings.
9. Never present mock AI output as factual production output.
10. Keep human signature approval visually distinct from AI generation.

## Integration strategy

Create adapters/selectors where necessary:

`realInspection -> UI view model -> V4 reusable component`

Do not make reusable V4 components know about Context internals.

## Demo mode

Add a hidden or development-only route called:

`/design-system-v4`

or the closest equivalent supported by the current navigation.

Use `ShowcaseIndex` as the landing screen.

This route must be removed from the production tab bar before App Store submission unless deliberately retained as an internal QA surface.

Repository status: `App.js` currently exposes the V4 `ShowcaseIndex` through the development-only `design-system-v4` screen route. The route is not part of the consumer bottom navigation and exits back to `home`. The V4 package remains fixture-driven; do not promote its screens into the default V2/V3 paths until real state selectors and action adapters are connected.

## App Store polish

Before shipping, replace mock media and prices with production data; verify subscription legal copy and purchase behavior; verify permission prompts; test dynamic type; test reduced motion; test offline recovery; test every screen on physical iPhones.
