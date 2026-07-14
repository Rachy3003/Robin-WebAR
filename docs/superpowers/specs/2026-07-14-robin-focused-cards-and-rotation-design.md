# Robin Focused Cards and 360° Rotation — Design Specification

Date: 2026-07-14
Status: Approved design, pending implementation

## Purpose

Replace the overlapping five-card AR arrangement with a focused, mobile-friendly single-card experience. Visitors can dismiss interface elements and freely rotate Robin in every direction without losing access to the health topics.

## Design Basis

The mobile test screenshot shows that five wide world-space cards overlap each other and Robin when perspective, camera distance and phone size vary. The selected solution moves topic presentation into one stable screen-space card above the HealthHub panel. This preserves Robin's silhouette, improves legibility and provides predictable touch targets across devices.

The design follows the selected UI/UX direction: progressive disclosure, one primary content surface at a time, minimum 44 × 44 pixel controls, at least 8 pixels between adjacent controls, high-contrast text and reduced-motion support.

## Interaction Sequence

1. The visitor places Robin on the detected ground plane.
2. Robin remains anchored at the selected world position.
3. A 10-second timer begins at placement.
4. At 10 seconds, the **How can I help?** speech bubble appears.
5. The speech bubble includes a clearly labelled close control with a minimum 44 × 44 pixel touch target.
6. Closing the speech bubble hides it without disabling Robin.
7. A short tap on Robin opens the focused card interface at the most recently viewed topic. The first opening starts at topic one.
8. Opening the card interface always hides the speech bubble immediately.
9. Dragging Robin rotates it instead of opening cards.
10. Closing the card interface hides all card UI and makes the speech bubble reappear.
11. The visitor may close the reappeared speech bubble to obtain an unobstructed robot-only view.
12. A later short tap on Robin reopens the cards at the previously viewed topic.
13. Reset clears placement, orientation, speech, card, flip and navigation state.

## Robin Rotation

Robin supports free object rotation in every direction:

- horizontal dragging rotates Robin left and right;
- vertical dragging rotates Robin forward and backward;
- rotation is unrestricted through 360 degrees, including upside down;
- combined diagonal dragging changes both axes;
- the resulting orientation remains where the visitor leaves it until another drag or reset.

Input handling uses a movement threshold to distinguish a tap from a drag. A release below the threshold is treated as a tap and may open cards. Movement beyond the threshold enters rotation mode and must not open cards when released.

Rotation applies to Robin's visual model, not the world anchor. The placed position, cards and other interface state remain stable while the model rotates.

## Focused Card Interface

Only one topic card is visible at a time. It is screen-space UI rather than a world-space entity, so camera perspective and distance cannot cause it to overlap other cards or drift behind Robin.

The card sits above the persistent HealthHub download panel and respects device safe areas. Responsive constraints keep it usable on small phones and in landscape orientation. On short screens, the card height is capped and the question or answer content scrolls inside the card while navigation and close controls remain fixed and visible.

Each card contains:

- the topic name;
- the existing category colour as a secondary accent, never the sole identifier;
- the existing question on the front;
- a clear **Tap to reveal answer** affordance;
- the existing answer on the reverse;
- a close button with an accessible label;
- Previous and Next arrow buttons with accessible labels;
- five progress dots, with the active position represented semantically as well as visually.

Previous is disabled on the first topic and Next is disabled on the fifth topic. Disabled controls remain visually recognizable but cannot receive an action. Navigation to another topic returns the card to its front/question side.

Tapping the main card body flips between question and answer. Tapping close, Previous or Next must not trigger the flip action.

## Motion

The card enters with a short 200–300 millisecond fade and scale transition. The question-to-answer change uses a short flip transition that preserves spatial continuity. Closing is faster than opening.

When reduced motion is requested, rotation remains directly controlled by the visitor, while card entrance, exit and flip transitions become near-instant crossfades without overshoot or simulated depth.

## Interface Visibility Rules

- Prompt ready and cards closed: speech visible unless the visitor explicitly closes it.
- Cards open: speech always hidden.
- Cards closed through the card close control: speech always reappears.
- Speech closed by its own close control: cards remain available through a short tap on Robin.
- Answer card open: existing standalone answer panel remains hidden because the answer is presented on the reverse of the focused card.
- Reset: speech and cards are hidden until a new placement completes its 10-second timer.

## State Model

The AR component keeps placement and prompt timing state. The screen UI controller keeps presentation state:

- `waiting`: Robin is placed; introduction timer is running.
- `prompted`: speech is available; taps may open cards and drags rotate Robin.
- `cards-open-front`: one topic question is visible.
- `cards-open-back`: the selected topic answer is visible.
- `cards-closed`: the card interface was dismissed and the speech bubble is visible.

Independent values track the current topic index, speech dismissal, gesture start position, drag threshold, drag mode and Robin orientation.

## Event Flow

- `robin-placed`: initialize waiting state and clear stale UI.
- `robin-prompt-ready`: show the speech bubble and enable robot gestures.
- `robin-open-cards`: hide speech and open the focused card at the retained topic index.
- `robin-close-cards`: close the card interface and restore speech.
- `robin-rotation-start`, `robin-rotation-change` and `robin-rotation-end`: update the model orientation without moving its anchor.
- `robin-reset`: cancel timers, restore the original orientation and clear all presentation state.

Internal DOM events may be used instead of public window events where appropriate, but the observable behavior must match this flow.

## Accessibility and Touch

- Close and arrow controls have minimum 44 × 44 pixel touch areas.
- Adjacent controls have at least 8 pixels of separation.
- Icon-only controls have descriptive accessible labels.
- Focus indicators remain visible for keyboard and switch users.
- Question and answer text maintain at least WCAG AA contrast.
- Progress and disabled states are communicated semantically, not by colour alone.
- Card actions use `touch-action: manipulation`; the robot rotation surface uses gesture handling that does not block browser system-edge gestures.

## Scope

This change includes speech dismissal, speech/card visibility rules, free 360-degree robot rotation, tap-versus-drag detection, replacement of five world-space cards with one screen-space flip card, card navigation, responsive layout and reduced-motion behavior.

It does not change Q&A wording, topic order, HealthHub links, store badges, QR code, public URL, placement location, reset availability or the 10-second prompt delay.

## Validation

- Confirm the speech bubble appears 10 seconds after placement and can be closed.
- Confirm opening cards immediately hides the speech bubble.
- Confirm closing cards makes the speech bubble reappear.
- Confirm closing speech leaves Robin interactive and cards reopen on a short tap.
- Confirm horizontal, vertical and diagonal drags rotate Robin freely through 360 degrees.
- Confirm a drag never opens cards and a short tap reliably does.
- Confirm rotation changes orientation without changing Robin's world position.
- Confirm only one topic card is visible and Robin remains unobstructed.
- Confirm all five topics are reachable using Previous and Next.
- Confirm navigation resets the destination card to its question side.
- Confirm each question flips to its matching existing answer.
- Confirm card controls do not accidentally flip the card.
- Confirm close and navigation controls meet touch-target and spacing requirements.
- Confirm the card fits small-phone portrait and landscape layouts above the HealthHub panel.
- Confirm reset during the timer, rotation, card front and card back produces a clean new placement.
- Confirm reduced-motion behavior remains clear and functional.
- Run the production build and verify the GitHub Pages deployment on a physical mobile device.
