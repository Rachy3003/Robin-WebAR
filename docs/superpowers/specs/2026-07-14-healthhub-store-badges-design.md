# HealthHub Store Badges — Design Specification

Date: 2026-07-14
Status: Approved design, pending implementation

## Purpose

Replace the single full-width **Download HealthHub Mobile App** button with a compact store-choice panel that lets every visitor explicitly choose Apple App Store or Google Play.

## Interface

The bottom call-to-action area contains:

1. One line of centered text: **Download the HealthHub app**
2. The official **Download on the App Store** badge.
3. The official **Get it on Google Play** badge.

The two badges sit side by side on normal mobile screens. On unusually narrow screens they may scale down together while retaining readable official artwork. They must not become small icon-only controls, because the official store badge wording helps visitors understand the destination.

The panel uses a light, compact treatment above the device safe area. It must not cover Robin, the spatial cards, or the answer panel. When an answer panel is open, spacing must remain sufficient for the answer text and close control.

## Behaviour

- The Apple badge always opens `https://apps.apple.com/sg/app/healthhub-sg/id1034200875`.
- The Google Play badge always opens `https://play.google.com/store/apps/details?id=sg.gov.hpb.healthhub&pli=1`.
- Automatic platform detection is removed from the call to action.
- Both choices remain visible on iPhone and Android so the consumer chooses the destination.
- Links open in the current browser context using normal accessible anchors.

## Assets

Use official Apple and Google store badge artwork. Store the badge files locally with the WebAR project so the call to action does not depend on third-party image availability at runtime. Preserve the badges' official proportions and do not recolor or redraw them.

## Scope

This change affects only the screen interface, local badge assets, and store-link handling. It does not change Robin, placement, card interactions, Q&A content, the public URL, or the existing QR code.

## Validation

- Confirm both official store URLs open correctly.
- Confirm both badges are legible and tappable on narrow iPhone and Android widths.
- Confirm safe-area spacing on devices with a home indicator.
- Confirm the panel does not overlap the answer panel.
- Run the production build and deploy through the existing GitHub Pages workflow.
