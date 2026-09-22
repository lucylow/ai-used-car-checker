# CarWise V3 Migration Map

## Pass A — shell and navigation

Use `RedesignV3Shell` only as a preview harness. Production navigation should remain the app's existing navigation stack. Mount V3 screens into existing routes.

Repository status: the preview harness is available at the `v3-preview` screen route in `App.js`. It receives the active vehicle and persisted photo URIs, while V2 remains the default shell. Do not promote V3 to the default until its screen actions are wired to host handlers.

## Pass B — visual primitives

Adopt `tokens.js`, `uiPrimitives.js`, `visualTokens.js`, `motion.js`, and the shared V3 components first. This prevents screen-by-screen style drift.

## Pass C — Home and inspection entry

Replace the Home, New Inspection, VIN and Welcome presentation first. Wire current inspection state into the vehicle hero, progress rail, VIN scanner/manual entry, and next-action components.

## Pass D — evidence capture

Wire Camera, PhotoReview, Gallery, VideoReview and VoiceReview to the existing native media and persistence functions. Keep local evidence IDs stable so AI findings can point back to the original media.

## Pass E — intelligence

Wire Market, MarketStory, AI, Findings, VehicleDNA and Costs to current market/AI state. Keep confidence labels and evidence references intact.

## Pass F — transaction journey

Wire Negotiation, Report, Documents, Certificate, Contract and Signature to existing generation / signing functions. Human authorization must remain explicit.

## Pass G — account and monetization

Wire History, Compare, Profile, Settings, Notifications and Subscription. Replace V3 demo paywall numbers with localized StoreKit product values.

## Pass H — release cleanup

Hide QA routes, delete demo-only data, replace remote image URLs with production assets, remove unused prototype components, verify accessibility, and run a real iOS build + device QA.
