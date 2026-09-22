# CarWise iOS App Store Frontend Readiness — V3

This document is a frontend-focused release gate for the V3 redesign. It does not certify that the app is ready for App Store submission. Build/signing, backend production configuration, legal review, device testing, App Store Connect metadata, and Apple review still need to be completed separately.

## 1. First-launch experience

- Splash and onboarding use production CarWise branding only.
- No hackathon/sponsor badges appear in the end-user experience.
- The first-run flow explains camera, microphone, photo/document and notification features before asking for access where appropriate.
- Permission prompts are contextual rather than immediately stacked at launch.
- Users can continue without optional permissions and are given a clear fallback path.

## 2. Subscription UI

If CarWise sells digital features through an iOS subscription, the purchase screen should make the subscription name/duration and service clear, prominently show the full renewal price, provide Restore Purchases, and link to Terms of Use and Privacy Policy. The current V3 paywall components are visual scaffolding only; connect them to the real StoreKit/App Store Connect products and localized prices before release.

## 3. Privacy UI

The app should have an accessible in-app Privacy / Data & Privacy screen with:

- Privacy Policy link
- data-use summary
- export/delete controls where supported
- permission settings shortcuts where useful
- third-party processing explanation for AI/document services
- clear explanation of what vehicle photos, documents, audio notes and inspection records are retained for

Do not request access that is not required for the feature currently being used.

## 4. AI trust UI

All AI-derived findings shown to a customer should retain a visible qualifier such as AI estimate, possible issue, confidence, or requires confirmation. High-impact findings should link back to the underlying evidence.

## 5. Evidence UX

Every customer-visible report should preserve provenance:

photo/video/voice/document → finding → recommendation → report section

Do not detach AI findings from their source evidence during UI refactors.

## 6. Release-only cleanup

Before archive/release:

- remove internal V3 QA routes
- remove demo vehicle data
- remove remote placeholder images
- remove fake loading delays and fake API responses
- remove developer toggles
- remove sponsor/hackathon copy
- ensure all buttons have production actions or are intentionally disabled
- verify all external links work
- verify share/export flows
- verify Restore Purchases
- verify empty/loading/error states on real network conditions

## 7. Accessibility

Check Dynamic Type, VoiceOver labels, focus order, color-independent severity indicators, 44pt+ controls, reduced motion, readable long text, and keyboard behavior on every customer-facing screen.

## 8. Device QA

Test portrait layouts on compact and large iPhones. Test keyboard-open states, safe areas, Dynamic Type, long VINs, long vehicle names, long seller notes, large repair ranges, large evidence counts, and slow/offline network states.
