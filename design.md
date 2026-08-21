# AI Used Car Checker — Mobile Interface Design Plan

## Product Direction

AI Used Car Checker is a one-handed, portrait-first iOS-style companion for evaluating a used vehicle before purchase. The experience prioritizes fast capture, clear risk signals, and decision-ready summaries rather than dense automotive terminology.

## Screen List

| Screen | Primary content and functionality |
|---|---|
| Home | Greeting, active inspection card, start-new-inspection CTA, quick tools for VIN decode and market comparison, recent inspection history. |
| New Inspection | Vehicle identity form: make, model, year, mileage, VIN, asking price, and seller notes. |
| Inspection Checklist | Grouped checklist for exterior, interior, engine, tires, brakes, electrical, and test drive observations. Users mark pass, watch, or issue. |
| Photo Capture | Add inspection photos and show a compact gallery. In the prototype, sample photo slots can be used to demonstrate AI analysis without requiring camera permissions. |
| AI Analysis | Loading state followed by detected issues, confidence, severity, fair-price estimate, repair priority, and negotiation tips. Users can add detected issues. |
| Inspection Summary | Overall risk score, issue counts, estimated repairs, fair price, and next-action cards. |
| Market Comparison | Similar listings, average market price, and comparison against the asking price. |
| VIN Decoder | 17-character VIN form and decoded vehicle summary using a local mock service. |
| Vehicle History | Accident, ownership, and service-record summary for a VIN. |
| Test Drive Log | Ratings and notes for handling, braking, acceleration, steering, noise, and comfort. |
| Maintenance Planner | Upcoming service intervals, due status, and reminders based on mileage. |
| Cost Estimator | Repair line items, estimated parts/labor, and total ownership impact. |
| Negotiation Coach | Suggested opening offer, target price, maximum price, and data-backed talking points. |
| History | Completed inspections with vehicle title, date, risk level, and fair-price snapshot. |
| Profile / Settings | Local preferences, theme switch, currency, and app information. |

## Key User Flows

1. User opens Home, taps **Start Inspection**, enters vehicle details, and saves an active inspection.
2. User works through the checklist, records issues, adds photo slots, and opens **AI Analysis**.
3. AI Analysis presents mock image detections and price guidance. User adds selected detections, then opens the summary.
4. From the summary, user reviews repair costs, market comparisons, and negotiation tips before deciding whether to proceed.
5. User can decode a VIN independently, inspect mock history data, log a test drive, and save the completed inspection locally.

## Visual System

The brand uses a deep navy foundation (`#0B1220`) with electric blue (`#2F80ED`) for primary actions, mint (`#35D0BA`) for positive findings, amber (`#F4B740`) for watch items, and coral (`#F16B6B`) for safety-critical issues. Surfaces use cool slate (`#151F32`) and soft gray-blue (`#92A1B8`) for secondary text. Cards have 16–20pt radii, generous spacing, and strong hierarchy. Primary CTAs sit near the lower thumb zone, and all touch targets are at least approximately 44pt.

## Interaction Principles

The app uses iOS-style grouped cards, clear navigation titles, native-feeling pressed states, concise helper text, and progressive disclosure. Empty states explain what to do next. AI output is explicitly labeled as a prototype estimate and should not be presented as a substitute for a professional inspection.
