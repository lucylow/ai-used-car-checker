# CarWise Frontend V2 — Integration Notes

## What this package contains

The package is a frontend redesign layer intended to be copied into the existing CarWise Expo / React Native application. It adds reusable primitives, charts, vehicle visualization, multimodal evidence UI, AI explainability cards, camera studio, report composer, contract, certificate, paywall, notification, profile, garage, demo, showcase, and design-system screens.

## Design intent

The repository already contains the underlying inspection logic and resilience features. The redesign is intentionally built as a presentation layer with a state adapter instead of duplicating domain logic.

## Main entry point

```js
import { RedesignShell } from './src/redesign';
```

The shell accepts:

```js
<RedesignShell
  screen={screen}
  state={redesignState}
  actions={redesignActions}
  showNavigation
/>
```

## Data adapter

`src/redesign/adapters.js`

This is the single normalization boundary between the existing app state and the new UI.

## Major reusable components

### Primitive UI

`components/Primitives.js`

- Screen
- ScreenHeader
- SectionHeader
- SurfaceCard
- PrimaryButton
- SecondaryButton
- IconButton
- Badge
- SeverityBadge
- SearchInput
- InputField
- SegmentedControl
- MetricCard
- ProgressBar
- EmptyState
- WarningBanner

### Charts

`components/Charts.js`

- ScoreRing
- ConfidenceMeter
- SparkBars
- MiniLineChart
- PriceRangeBar
- Waterfall
- HorizontalBars

### Evidence

`components/Media.js`

- EvidenceThumbnail
- EvidenceGallery
- EvidenceComposer
- MediaReviewModal
- AnnotationOverlay
- VideoEvidenceCard
- DocumentEvidenceCard
- GalleryLightbox

### Advanced interaction

`components/Advanced.js`

- GlassStat
- InsightCarousel
- EvidenceTimeline
- FloatingActionDock
- AnimatedNumber
- PressableTile
- SegmentedProgress
- PulseLabel
- MetricPill
- Accordion
- TagCloud

### Capture

`components/MediaCapture.js`

- CaptureModeSelector
- CameraViewport
- CaptureGuide
- RecordingPill
- AudioWaveform

### Vehicle

`components/Vehicle.js`

- VehicleHealthMap
- VehicleHero
- VehicleInfoStrip
- PartDetailCard
- ZonePicker

### Motion

`motion.js`

- reduced-motion detection
- reveal animations
- press scale interaction
- animated values
- pulse helpers

## Suggested integration strategy

Start with the `HomeScreen` and `InspectionScreen`, confirm the state adapter, then move screen-by-screen through the rest of the journey.

Do not integrate every new route at once into a large monolithic `App.js` without first checking the state bridge.

## Demo / QA routes

These routes are intentionally included for design QA:

- `demo`
- `showcase`
- `design-system`
- `visual-states`
- `camera-studio`
- `report-composer`

They are useful for validating the visual system in Cursor or Expo Go before turning on the full redesign.
