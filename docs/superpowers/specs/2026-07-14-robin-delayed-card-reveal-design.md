# Robin Delayed Card Reveal — Design Specification

Date: 2026-07-14
Status: Approved design, pending implementation

## Purpose

Make Robin's first interaction more deliberate and theatrical. Robin remains fixed in the real-world placement location, introduces the experience after a short pause, and reveals the five Q&A cards only after the visitor taps Robin.

## Interaction Sequence

1. The visitor places Robin on the detected ground plane.
2. Robin is world anchored at that exact location and begins the existing subtle idle motion.
3. No Q&A cards are created or visible at placement time.
4. A 10-second timer begins when placement completes.
5. Early taps on Robin during the 10-second wait are ignored.
6. At 10 seconds, the **How can I help?** speech bubble fades in.
7. Robin becomes tappable only after the speech bubble is visible.
8. The first valid tap on Robin starts the card reveal.
9. Five cards appear one by one in a fixed order, approximately 300 milliseconds apart.
10. Each card combines a short scale-up pop with a fade from transparent to fully visible.
11. Once all five cards are visible, later taps on Robin do nothing.
12. The visitor may tap any visible card to open its existing answer panel.

## World-Locked Placement

Robin and all cards remain anchored to the selected real-world position. They do not follow the camera and are not pinned to the phone screen.

If the visitor turns or moves the phone away, Robin and the cards naturally leave the camera view. The visitor must point or move the phone back toward the placement location to see them again. The 10-second timer continues while Robin is off-screen.

The existing recenter/reset control remains available. Recenter removes Robin and the cards, clears the interaction state and pending reveal timers, and allows a fresh placement.

## Card Layout

Use a fixed five-point arc that keeps cards outside Robin's silhouette:

- upper left;
- upper right;
- lower left;
- lower right;
- top centre, slightly farther from Robin.

Cards should be smaller than the current version if required for separation. Their visible panels must not overlap Robin when viewed from the intended placement angle. Invisible or transparent hit areas may be larger than the visible cards to preserve comfortable tapping.

The cards remain children of the placed world anchor so their positions stay stable relative to Robin.

## Animation

Each card begins hidden with near-zero scale and zero opacity. The reveal animation uses:

- a quick scale-up with a gentle overshoot or back easing;
- a simultaneous fade to full opacity;
- an individual duration of roughly 450–650 milliseconds;
- a stagger interval of roughly 300 milliseconds.

Reduced-motion mode should shorten the transition and remove the overshoot while retaining the sequential reveal order.

## State Model

The component uses explicit states:

`placed → waiting → prompted → revealing → revealed`

- `placed`: initialize the world-locked instance.
- `waiting`: run the 10-second introduction delay and ignore robot taps.
- `prompted`: show the speech bubble and accept one robot tap.
- `revealing`: create/show cards sequentially and reject additional robot taps.
- `revealed`: keep cards interactive and ignore robot taps.

Reset may occur from any state and must cancel outstanding timers and remove all spawned card entities.

## Event Flow

- Placement dispatches `robin-placed`.
- The completed 10-second delay dispatches `robin-prompt-ready` to show the speech bubble and enable the robot tap.
- The valid robot tap starts the internal reveal sequence.
- Card taps continue dispatching `robin-card-selected` with the selected content.
- Reset dispatches `robin-reset` and clears speech and answer interfaces.

## Scope

This change affects placement state, speech timing, robot input, card creation, spatial positions and animation. It does not change Q&A wording, answer-panel behaviour, store badges, HealthHub links, the public URL or QR code.

## Validation

- Confirm Robin remains world locked when the camera turns away and back.
- Confirm the speech bubble appears no earlier than 10 seconds after placement.
- Confirm early robot taps reveal nothing.
- Confirm the first valid robot tap reveals all five cards in sequence.
- Confirm later robot taps do nothing.
- Confirm cards do not overlap Robin at the intended viewing angle.
- Confirm every visible card remains easy to tap.
- Confirm resetting during the wait or reveal cancels pending actions and permits a clean new placement.
- Confirm reduced-motion behaviour remains understandable.
- Run the production build and verify deployment through GitHub Pages.
