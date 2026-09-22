# Cursor Prompt — CarWise V5 AI Mock Data Expansion

You are integrating the `src/carwise-ai-v5` package into the existing CarWise React Native / Expo app.

## Objective

Use these fixtures to make the existing AI frontend look like a production automotive intelligence product instead of a prototype. The fixtures are presentation/demo data. Do not treat them as the production source of truth.

## Required behavior

- Preserve existing navigation and state management.
- Preserve existing API clients and backend contracts.
- Use V5 fixtures behind selectors or demo flags.
- Make every AI visual traceable to evidence: photo, video, audio, document, checklist item, or market data.
- Show confidence and uncertainty without overstating AI certainty.
- Make multimodal UI feel native: photo capture, image review, video evidence, voice note, document evidence.
- Add meaningful loading states: ingestion, image analysis, cross-modal synthesis, market comparison, explanation generation.
- Add reduced-motion variants from `AI_MOTION_MATRIX_V5`.
- Add haptic/press feedback where the existing app already supports it.
- Never block an inspection simply because a mock visual fixture is missing.

## High-value screens to wire first

1. Home active-inspection hero
2. Photo evidence review
3. AI finding detail + explainability
4. Multimodal evidence timeline
5. Market price intelligence
6. Repair cost impact
7. Negotiation evidence card
8. Report evidence gallery
9. Certificate trust panel
10. AI copilot conversation

## Developer showcase

Temporarily route `AIShowcaseV5` to a hidden/developer-only route so designers can visually inspect fixture states on a real iPhone. Do not ship the showcase as a customer-facing route unless intentionally enabled.

## Visual quality bar

Use the fixture data to create large, image-forward cards, annotated media, animated scores, progressive disclosure, evidence chips, compact charts, vehicle status maps, and contextual actions. Avoid generic CRUD tables and text-only cards.

## Production handoff

When a production selector exists, replace the V5 fixture import at the screen boundary. Do not rewrite the business logic just to use the mock data. Keep component prop shapes stable so demo mode and production mode can share the same UI.
