# Integration notes — CarWise Frontend V3

This package is intentionally additive. It is designed to sit beside the existing app during migration.

## Suggested migration order

1. Home
2. New Inspection
3. VIN
4. Market
5. Camera / Evidence
6. AI
7. Checklist
8. Costs
9. Negotiation
10. Report
11. Documents
12. Contract
13. Signature
14. Certificate
15. History / Profile / Settings

## Demo data

`src/redesign-v3/data/demoData.js` and `demoScenarios.js` are visual fixtures. Replace their URIs and values with production state. The remote image URIs are only suitable for design prototyping and should be replaced by bundled or managed production assets.

## Native features

Connect the presentation layer to the repository's existing implementations for image picking, documents, API calls, persistence, navigation and any e-sign flow. Do not add duplicate native integrations just for the redesign.

## Navigation

`RedesignV3Shell` is a preview shell. In the production app, prefer the project's existing navigation structure and render V3 screens inside those routes rather than maintaining a second navigation stack.

The repository currently mounts it only through the `screen === 'v3-preview'` branch in `App.js`. That branch passes a normalized copy of the active vehicle and persisted photo URIs, and exits back to `home`. The existing V2 redesign remains the default presentation path.

Do not enable V3 as the default shell until screen callbacks are connected to the existing inspection handlers. V3 screens still contain demo findings, market values, and navigation-only actions by design.

## Release review

Use `QAVisualV3`, `FinalQAFlowV3`, `LongTextV3`, `AccessibilityV3`, `ReleaseChecklistV3`, and `AppStoreV3` as internal visual QA surfaces. Remove or hide internal QA screens before release.
