# CARWISE FRONTEND V3 — CURSOR INTEGRATION PROMPT

You are integrating a production-facing visual redesign into the existing CarWise Expo React Native application.

## Non-negotiable integration rule

Do NOT replace the existing backend, API service layer, persistence model, Context state, or inspection business logic just to install the redesign.

The V3 package under `src/redesign-v3` is a presentation layer and visual system. Connect existing state/actions into it.

The current product journey is VIN → market intelligence → evidence capture → AI analysis → checklist → costs → negotiation → report → contract → human signature → certificate. Preserve that sequence and data continuity.

## First pass

1. Copy `src/redesign-v3` into the existing React Native repository.
2. Import `RedesignV3Shell` from `src/redesign-v3` into a development-only route in `App.js`.
3. Launch with `initialRoute="home"` and verify navigation.
4. Replace demo callbacks one at a time with existing App.js functions.
5. Keep current sponsor/API services intact.
6. Remove demo-only content before release.

## Integration mapping

Map existing application state into the V3 props:

- vehicle → VehicleHero, report, certificate, contract
- inspection progress → progress bars / timeline
- findings → AIInsight / report / negotiation
- evidence → MediaTile / EvidenceStack / EvidenceCount
- market results → comparable cards / price range / market charts
- document extraction → document review / confidence UI
- contract data → ContractSummary / Contract screen
- human signature status → Signature screen
- certificate data → Certificate screen

## Visual goals

Make the mobile UI feel like a premium automotive product, not a generic CRUD dashboard.

Prioritize:

- real vehicle photography
- large automotive hero imagery
- clear evidence cards
- interactive health visualizations
- AI confidence + evidence explanations
- multimodal capture
- strong progress feedback
- generous whitespace
- restrained navy / cyan / mint / amber / coral system
- consistent 44pt+ touch targets
- iOS-friendly navigation and bottom sheets

## Multimodal behavior

Every major inspection item should expose Photo / Video / Voice / Document actions where the underlying feature exists.

Do not fake camera, microphone, document, or e-sign permissions. Connect the UI to the current native modules.

## AI trust behavior

Do not present visual AI output as a definitive mechanical diagnosis. Use phrases like `Possible issue`, `AI estimate`, `Confidence`, and `Requires confirmation` where appropriate. Keep evidence attached to findings.

## Animation behavior

Use the existing motion helpers and respect reduced motion. Avoid decorative looping motion on every card. Motion should show state change, cause/effect, or progress.

## App Store preparation

Do not claim App Store approval from UI work alone. Before release, separately verify:

- bundle identifier
- app icon and launch screen
- privacy usage descriptions
- camera/microphone/photo permissions
- App Store subscription configuration if Pro is sold in-app
- Restore Purchases
- privacy policy / terms links
- production API configuration
- error logging
- offline recovery
- device testing on current iPhone sizes
- Dynamic Type and VoiceOver
- reduced motion
- no placeholder/demo data
- no development menus or sponsor/hackathon references

## Route registry

`src/redesign-v3/screenRegistry.js` contains the V3 screen registry. Use it for the redesign preview and for progressive screen-by-screen migration.

## Definition of done

A screen is considered migrated when:

- it uses the shared V3 visual primitives
- its existing data is connected
- loading/empty/error states are handled
- accessibility labels exist
- high-impact AI claims are appropriately qualified
- no business logic was duplicated in the UI
- the screen works in dark mode and reduced motion

## V3.1 — App Store UX integration gates

The redesign should ship with a release-safe UX layer rather than only polished happy paths.

For subscription screens, connect the visual product cards to real StoreKit/App Store Connect products. Do not hard-code the purchase amount when the production product price is localized. Keep Restore Purchases visible and provide accessible Terms of Use and Privacy Policy links.

For permission-sensitive screens, use contextual primer UI and then invoke the real native permission flow. Respect denial states and offer useful fallbacks. Do not repeatedly force permission prompts.

For customer-facing AI screens, preserve evidence provenance and qualification language. The UI must visually distinguish an AI estimate from a verified human-approved result.

Before release, hide internal V3 registry/QA/showcase routes and remove demo data, placeholder image URLs, developer copy, sponsor/hackathon references, and no-op callbacks.
