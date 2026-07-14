# Robin WebAR Experience — Design Specification

Date: 2026-07-14
Status: Approved design, pending implementation plan

## 1. Purpose

Create a lightweight consumer WebAR experience for events and printed posters. A visitor scans a QR code, opens the experience in a mobile browser, grants camera access, places Robin on the floor, and explores five preset health-information cards. The experience ends with a platform-aware call to download the HealthHub mobile app.

The first release is intentionally simple. It has no login, live AI, typed questions, audio, analytics, cookies, or collection of personal or health information.

## 2. Technical Direction

Build Robin as a new, independent 8th Wall Studio project named `Robin-WebAR`. Do not modify the user's fork of the full `8thwall/8thwall` platform source.

8th Wall Studio is the selected approach because it includes the 8th Wall Engine, supports world effects, and provides the most direct path from the installed desktop app to an interactive browser experience. The project will be kept in its own local Git repository and later connected to a separate GitHub repository.

## 3. Audience and Use Context

Primary context: public health events.

Secondary context: QR codes printed on posters.

The experience is designed for a standing visitor holding a phone in portrait orientation, often in a busy public space. Instructions must be short, controls must be large, and the experience must not depend on sound.

## 4. End-to-End Journey

1. The visitor scans a QR code.
2. A secure public URL opens in the phone's default browser.
3. A lightweight branded loading screen prepares the AR engine.
4. The browser asks for camera permission.
5. The visitor sees: “Move your phone slowly to find the floor.”
6. When world tracking is ready, a placement ring appears on the detected ground plane.
7. The visitor taps the ring to place Robin.
8. Robin enters a subtle idle state using gentle floating and a small turn toward the visitor.
9. A speech bubble appears above Robin with: “How can I help you?” There is no voice or other audio.
10. Five topic cards animate into stable positions in a loose orbit around Robin.
11. The visitor aims the phone at a card and taps it.
12. The selected card eases toward the camera and opens a readable screen-space answer panel.
13. The visitor closes the panel and may choose another card.
14. A persistent **Download HealthHub Mobile App** button routes iPhone users to the Apple App Store and Android users to Google Play. Desktop or unrecognized devices go to the official HealthHub information page.
15. A recenter control allows Robin to be repositioned without reloading the page.

## 5. Spatial Interaction

Robin is placed at approximately tabletop scale and entirely above the detected ground plane. The five cards occupy stable positions around Robin. They may gently drift but must not continuously rotate out of reach.

All cards should remain discoverable with small left/right phone movements. A visitor should not need to walk around Robin. Card labels face the camera enough to remain legible, and tap targets are larger than their visible geometry.

Only one answer panel can be open at a time. While an answer is open, the orbiting cards remain visible but are not interactive. Closing the panel restores card interaction.

## 6. Content

The source workbook is `/Users/rach/Desktop/Robot Test/Q&A.xlsx`, sheet `Sheet1`, cells `A1:C6`.

The five card topics are:

1. **Breast Screening** — mammograms, early detection, and regular screening.
2. **Healthy Singapore** — leading causes and risk factors for poor health in Singapore.
3. **Managing Conditions** — managing diabetes or high blood pressure through a personal health plan and regular care.
4. **Mental Wellbeing** — common mental health issues affecting young people in Singapore.
5. **Better Sleep** — the circadian rhythm and the value of a regular sleep schedule.

The workbook remains the source of meaning, but the mobile experience may shorten answers for clarity and comfortable reading. Final health copy must preserve the intended meaning, avoid making new diagnostic or treatment claims, and be reviewed before launch.

Every answer panel includes a small note: “This is general health information and is not a substitute for professional medical advice.”

The mental-health card is informational and supportive. It does not diagnose the visitor, request personal disclosures, or present the experience as crisis support.

## 7. Visual Direction

Use the supplied Robin assets and reference artwork as the visual source:

- `/Users/rach/Desktop/Robot Test/Robin_Robot/`
- `/Users/rach/Desktop/Robot Test/CA Chatbot Icon.png`
- `/Users/rach/Desktop/Robot Test/ChatGPT Image Jul 13, 2026, 12_34_21 PM.png`
- `/Users/rach/Desktop/Robot Test/ChatGPT Image Jul 13, 2026, 12_36_36 PM.png`

The visual system uses soft white surfaces, a deep green face, bright healthcare green, and restrained yellow/orange accents. Cards are rounded white panels with green outlines and small topic-specific accents. Text must maintain high contrast over the camera feed.

Robin remains the primary focal point. The app-download button sits near the bottom safe area without covering Robin or the selected answer. The recenter control is secondary and visually quiet.

## 8. 3D Asset Preparation

The supplied FBX/OBJ robot assets and PBR textures are development sources, not final web assets. Prepare a GLB version for the experience.

The GLB must:

- preserve the intended Robin appearance and emissive face;
- use mobile-appropriate texture sizes and compression;
- have a corrected origin and ground contact so the model sits above Y=0;
- load at an acceptable speed over mobile data;
- support the selected idle motion, whether through an embedded clip or a lightweight procedural transform.

Asset optimization must be visually checked on a real phone. The source files remain unchanged.

## 9. System Components

### 9.1 AR scene

Owns the world camera, tracking readiness, placement ring, tap-to-place behavior, lighting, shadow, Robin entity, idle motion, and recentering.

### 9.2 Card system

Owns the five card entities, their labels and world positions, enlarged hit areas, selected/unselected state, and the transition that brings a chosen card forward.

### 9.3 Content configuration

Stores card IDs, topic labels, questions, shortened answers, accent colors, and ordering in one editable module. Scene code must not duplicate the health copy.

### 9.4 Screen interface

Owns loading and permission instructions, tracking guidance, speech bubble, answer panel, close action, HealthHub download action, recenter control, fallback screen, and general-information note.

### 9.5 Store routing

Maps supported mobile platforms to verified official HealthHub store URLs. It must not use unofficial mirrors. Unrecognized platforms route to the official HealthHub information page.

- Apple App Store: `https://apps.apple.com/sg/app/healthhub-sg/id1034200875`
- Google Play: `https://play.google.com/store/apps/details?id=sg.gov.hpb.healthhub&pli=1`

## 10. State and Data Flow

The experience uses a small explicit state flow:

`loading → permission → scanning → ready-to-place → placed → browsing → answer-open`

Camera denial moves to `permission-error`. Unsupported devices move to `unsupported`. Tracking loss after placement shows recovery guidance while retaining the placed content when possible.

User taps are accepted only when valid for the current state. For example, cards cannot open before placement, and a second card cannot open while an answer panel is active.

All Q&A content is bundled locally with the static experience. No server request is needed to answer a card.

## 11. Error and Recovery Behaviour

- **Camera denied:** Explain how to allow camera access and provide a retry action.
- **Camera unavailable or unsupported browser:** Show a friendly fallback with the HealthHub app-download action.
- **Slow engine/model loading:** Keep a visible progress state and avoid showing a frozen camera view.
- **Floor not found:** Encourage slow movement, good lighting, and a visually detailed floor.
- **Tracking instability:** Offer recentering and concise recovery guidance.
- **Asset failure:** Hide incomplete AR objects and show a recoverable reload message.
- **Store-routing uncertainty:** Open the official HealthHub information page.

## 12. Accessibility and Usability

- The experience does not require audio.
- Instructions and answer content use readable font sizes and strong contrast.
- Interactive screen controls meet a minimum comfortable mobile tap size.
- Cards have both color accents and text labels; meaning is not communicated by color alone.
- Motion remains subtle and respects reduced-motion preferences where practical.
- The answer panel is screen anchored so the visitor does not need to hold the phone perfectly still to read.
- Safe-area insets are respected on modern iPhones and Android devices.

## 13. Privacy and Analytics

The first release collects no personal data and includes no analytics. It does not store card selections, scan events, device identifiers, or health information.

If analytics are added later, they require a separate design decision and privacy review.

## 14. Hosting and QR Distribution

Export the Studio project as a static HTTPS web experience. GitHub Pages is the preferred free initial host if the exported build works without platform-specific server behaviour. Cloudflare Pages is the fallback static host.

Generate the final QR code only after the production URL is stable. The same URL and QR should work for both event displays and posters. The QR artwork should include a short instruction such as “Scan to meet Robin in AR.”

## 15. Testing and Acceptance Criteria

Test on recent iPhone Safari and Android Chrome devices over both Wi-Fi and mobile data.

The first version is accepted when:

1. The QR opens the production URL without an app or login.
2. Camera permission succeeds and denial produces usable recovery guidance.
3. A visitor can find the floor and place Robin once with a clear tap target.
4. Robin appears above the ground, at an appropriate scale, and performs a subtle idle motion.
5. The speech bubble appears without audio.
6. All five cards appear around Robin, remain discoverable without walking, and can be tapped reliably.
7. Each card displays the correct question and shortened answer.
8. Answer text remains readable while the camera moves.
9. The close and recenter controls work consistently.
10. The download button opens the official Apple App Store listing on iPhone and official Google Play listing on Android.
11. Unsupported devices receive a useful fallback.
12. The experience does not collect personal information or analytics.
13. The deployed experience loads and runs acceptably under typical event lighting and network conditions.

## 16. Deferred Scope

The following are explicitly outside the first version:

- live AI or chatbot responses;
- voice input, narration, or sound effects;
- user accounts or saved sessions;
- analytics and campaign dashboards;
- typed health questions;
- image-target activation from the poster itself;
- multiple languages;
- photo/video capture and social sharing;
- content-management tooling;
- native app features.
