# Kiosk Codebase Feature & Architecture Outline (Migration Baseline)

## A. Executive Summary

This codebase implements a browser-based kiosk platform with two primary runtime modes:

- **CMS/editor mode** for authenticated operators to build and publish kiosk configurations (`/dashboard/cms/:configurationId`).
- **Kiosk playback mode** for end-users at kiosk screens (`/kiosk/:kioskId/:pageIndex?`).

The frontend is a React + Vite app using Chakra UI, `react-grid-layout`, Framer Motion, and a PocketBase backend via `@yogeshp98/pocketbase-react`.

Core flow:

1. App bootstraps providers (`BrowserRouter`, `ChakraProvider`, `Pocketbase`) in `client/src/main.jsx`.
2. Routes split into auth + dashboard + kiosk playback in `client/src/App.jsx`.
3. Editor (`client/src/views/ConfigurationEditor.jsx`) manipulates a persisted JSON configuration (`configurations.pages`) and assigns a configuration to a kiosk (`kiosks.configuration`).
4. Viewer (`client/src/views/ConfigurationViewer.jsx`) loads kiosk -> configuration, subscribes to configuration updates, and renders page layout declaratively through a component registry (`client/src/components/Kiosk/componentMap.js`).

### Non-Negotiables To Preserve

1. **Declarative kiosk components must remain declarative.** Components are selected and parameterized from JSON config data (not imperatively instantiated widget-by-widget).
2. **Current rendering philosophy must remain state-driven.** Rendering is derived from configuration/page state + route state, with React reconciliation and layout engine rendering.
3. **Component registry + prop-schema model must persist.** `componentMap` and per-component `propMap` are the contract between authored components and the editor/viewer.
4. **Navigation/action model must remain data-configurable.** Component interactions (e.g., button click, video end) trigger configured navigation/actions.

### Highest-Risk Migration Areas

1. **Implicit data contracts not codified in types:** `layoutItem.i` encodes both component type and instance ID (`<ComponentName>|<uuid>`), and prop lookup depends on it (`ConfigurationEditor` + `ConfigurationViewer`).
2. **Backend coupling to PocketBase hook semantics:** real-time subscribe/unsubscribe, collection APIs, and auth behavior are directly embedded in view components.
3. **UI/editor-side direct DOM access:** multiple uses of `document.getElementById(...)` and mutable local variables (`draggingFromOutside`, `timeout`) can regress behavior if rendering/runtime changes.
4. **Runtime kiosk shell is environment-hardcoded:** `server_scripts/kiosk.sh` includes a hardcoded URL/device assumptions and display rotation commands.
5. **No visible automated test suite:** migration safety relies mostly on manual verification unless tests are added.

## B. Glossary

- **Kiosk component:** A renderable UI primitive (e.g., `Image`, `Button`, `Video`) registered in `client/src/components/Kiosk/componentMap.js` and rendered dynamically by name.
- **Declarative component model:** Components are described by persisted config (`pages[].layout` + `pages[].propValues`) and rendered from that data rather than manually wiring widgets in code.
- **Renderer:** The playback/editor composition path that maps config -> React elements (`ConfigurationViewer` / `ConfigurationEditor` using `ReactGridLayout`).
- **Scene / screen / page:** A single kiosk page entry in `config.pages`; selected by route `:pageIndex` and by `page name` for navigation.
- **Layout:** Grid-position metadata (`x`, `y`, `w`, `h`, `i`, etc.) consumed by `react-grid-layout`.
- **State:** Primarily React local state (`config`, `pages`, `currentPage`, `selectedComponent`, animation state) plus route params.
- **Actions / events:** User/system events like drag/drop, button click, video `onEnded`, page select, and route changes.
- **Effects:** Side-effectful calls in handlers/effects (PocketBase fetch/update/subscribe, `window.open`, navigation, animation execution).
- **Resources / assets:** Uploaded files stored in `configurations.files` and resolved to URLs in prop forms.
- **Navigation:** Route transitions in React Router and page-to-page transitions triggered by configured `navigateTo` props.
- **Theming:** Chakra theme baseline in `client/src/styles/theme.js`.
- **Configuration:** Persisted backend record (`configurations`) containing dimensions, grid settings, pages JSON, and files.
- **Kiosk binding:** `kiosks.configuration` relation selecting which configuration a kiosk should render.

## C. Current Architecture Overview

### Major Subsystems

- **App shell and routing:** `client/src/main.jsx`, `client/src/App.jsx`, layouts in `client/src/layouts/*`.
- **Auth/session:** `useAuth()` from PocketBase wrapper in `Login`, `Signup`, `RequireAuthLayout`, `Navbar`.
- **CMS editor runtime:** `client/src/views/ConfigurationEditor.jsx` + common form/upload components.
- **Kiosk playback runtime:** `client/src/views/ConfigurationViewer.jsx` + kiosk components/animation map.
- **Declarative component library:** `client/src/components/Kiosk/*` + `componentMap.js`.
- **Data/backend model:** PocketBase collections in `server/pb_schema.json` (`users`, `kiosks`, `configurations`).
- **Device/OS kiosk shell:** `server_scripts/kiosk.sh`, `server_scripts/power_state_change.sh`.

### Entry Points

- **Frontend boot:** `client/src/main.jsx`.
- **Route entry for kiosk playback:** `/kiosk/:kioskId/:pageIndex?` (`client/src/App.jsx`).
- **Route entry for editor:** `/dashboard/cms/:configurationId` (`client/src/App.jsx`).
- **Kiosk OS launcher:** `server_scripts/kiosk.sh` (Chromium kiosk mode).

### Configuration Systems

- **Build/runtime env:** `VITE_APP_ENV`, `VITE_POCKET_BASE_SERVER_URL` (`client/.env.default`).
- **Theme config:** Chakra theme object (`client/src/styles/theme.js`).
- **Data config:** PocketBase `configurations` records containing width/height/rows/columns/pages/files (`server/pb_schema.json`).
- **Kiosk assignment config:** PocketBase `kiosks.configuration` relation.

### Architecture Diagram (Current)

```text
+----------------------------- Device / OS Layer -----------------------------+
| server_scripts/kiosk.sh -> chromium --kiosk /kiosk/:kioskId/:pageIndex     |
| power_state_change.sh monitors AC and can shutdown                          |
+------------------------------------+----------------------------------------+
                                     |
                                     v
+------------------------------- Frontend App --------------------------------+
| main.jsx: Router + Chakra + Pocketbase provider                             |
|                                                                              |
|  +---------------- CMS Routes ----------------+   +------ Kiosk Route -----+ |
|  | /dashboard/cms/:configurationId            |   | /kiosk/:kioskId/:page? | |
|  | ConfigurationEditor                        |   | ConfigurationViewer     | |
|  | - edit pages/layout/props/files            |   | - fetch/subscribe config| |
|  | - save config, push to kiosk               |   | - render components     | |
|  +------------------------+-------------------+   +------------+-----------+ |
|                           |                                    |             |
|                           v                                    v             |
|               componentMap + propMap schema       componentMap + animations |
|               (declarative authoring contract)    (state-driven rendering)  |
+------------------------------------+-----------------------------------------+
                                     |
                                     v
+------------------------------- Backend Layer --------------------------------+
| PocketBase: users, kiosks, configurations                                  |
| configurations.pages JSON + files; kiosks.configuration relation           |
+-----------------------------------------------------------------------------+
```

### Boundaries

- **UI/components boundary:** Kiosk components are simple presentational/action components with props (`ButtonComponent`, `ImageComponent`, `VideoComponent`).
- **Renderer boundary:** `ConfigurationViewer` + `ReactGridLayout` resolve component type, props, placement, and navigation callbacks.
- **State boundary:** React state in views; backend-persisted state in PocketBase records.
- **IO/hardware boundary:** Outside React app; handled by shell scripts for display mode, Chromium kiosk launch, and power checks.

### Runtime Phases

1. **Boot:** provider setup in `main.jsx`.
2. **Load config/assets:** viewer fetches kiosk + linked configuration; editor fetches selected configuration.
3. **Initialize services:** PocketBase subscriptions/auth context + animation scopes (`useAnimate`).
4. **Render phase:** `ReactGridLayout` draws page layout and dynamic components.
5. **Input/events:** clicks, video end, drag/drop, prop edits, route changes.
6. **Update cycle:** state updates + backend updates + optional subscription refresh + rerender.

## D. Declarative Kiosk Component Model (Detailed)

### What a Kiosk Component Is (Code Terms)

A kiosk component is a tuple entry in `componentMap`:

- key: component type string (`"Image"`, `"Button"`, `"Video"`, optional `"Test"` in DEV)
- value: `[ReactComponent, propMap]`

Defined in `client/src/components/Kiosk/componentMap.js`.

### Component Interface / Shape

Common runtime props passed by renderer/editor:

- `scaleFactor`
- `navigate`
- layout metadata from `react-grid-layout` item (`x`, `y`, `w`, `h`, `i`, etc. via `{...component}`)
- component-specific props from `propValues[component.i]`

Identity and keying:

- component instance ID format: `layoutItem.i = "<ComponentName>|<uuid>"` (created in `ConfigurationEditor.onDrop`).
- `component.i` is used as React key and as propValues key.

Layout constraints:

- grid bounded by `config.columns`, `config.rows`, `rowHeight` (10 or scaled), overlap enabled.

### How Components Are Authored

Authoring convention (observed across Button/Image/Video):

1. Export `propMap` metadata object describing editable props.
2. Default-export a React component that receives renderer-injected props + declared props.
3. Register component and `propMap` in `componentMap.js`.

`propMap` supports:

- input types: `input`, `select`, `file`, `pageSelect`, `colorPicker`
- nested conditional schema via `followUpQuestions`
- special always-visible follow-up key: `SPECIAL_always_show`

### Composition Model

- Composition unit is a **page** (`config.pages[n]`).
- Page contains flat `layout` array of component instances.
- No explicit nested container/slot tree in current model; composition is spatial via grid coordinates.
- Layout containers are `ReactGridLayout` instances in editor and viewer.

### Lifecycle

- **Mount:** when page loads or component added to layout.
- **Update:** when route page changes, config subscription updates, prop changes, or editor mutations.
- **Unmount:** when switching pages, deleting components, or leaving route.

Lifecycle is React-driven; no custom lifecycle API for components beyond props updates.

### Event Flow

Canonical flow in viewer:

1. Input event (e.g., button click / video ended).
2. Component calls injected `navigate(...)` with `navigateTo` target.
3. Viewer resolves page name -> index.
4. Optional animation executes (exit/enter) via animation map.
5. Route navigates to next `/kiosk/:id/:pageIndex`.
6. Viewer rerenders current page layout from config state.

Canonical flow in editor:

1. Operator drags component type from palette.
2. `onDrop` creates layout instance + UUID key.
3. Prop form writes to `pages[currentPage].propValues[componentId]`.
4. Save updates PocketBase configuration record.
5. Push-to-kiosk changes `kiosks.configuration` relation.

### Diffing / Reconciliation

- Primary diffing is React reconciliation.
- Layout engine receives a new `layout` array and repositions/resizes accordingly.
- Viewer uses `refreshCount` key on animation box to force refresh after enter animation completes.
- No custom reconciler beyond key-based mapping and route-driven state transitions.

### Side Effects While Staying Declarative

Current architecture keeps component UI declarations mostly pure; side effects happen in orchestration layers:

- backend fetch/update/subscribe in `ConfigurationEditor` and `ConfigurationViewer`
- route navigation and animation orchestration in `ConfigurationViewer`
- file upload/save + preview updates in editor

Components perform limited effectful actions by calling injected callbacks (`navigate`) instead of directly mutating global state.

### Rendering Contract

Renderer expects each component to:

- render safely inside full-size container (`h='100%'`, `w='100%'` patterns are common),
- accept declared props from `propMap`,
- optionally honor `scaleFactor` and `navigate`,
- not own global data loading/subscription.

Components can assume:

- stable `navigate` callback exists in viewer (editor passes no-op),
- props may be missing (components should handle empty values gracefully),
- placement and sizing are controlled externally by layout engine.

## E. Rendering & Runtime

### Renderer Responsibilities and Interfaces

`ConfigurationViewer` responsibilities:

- load kiosk + configuration records,
- maintain live subscription to configuration updates,
- validate page index and redirect to page `0` if invalid,
- map layout items to registered component implementations,
- inject runtime props (`pages`, `scaleFactor`, `navigate`, component props),
- execute configured transition animations.

`ConfigurationEditor` responsibilities:

- render editable grid canvas,
- manage component instance creation/deletion/order,
- render prop schema-driven forms,
- persist pages/files and push assignment to kiosks,
- maintain preview records (`_preview_config`, `_preview_kiosk_`).

### Frame/Render Loop and Scheduling

- No explicit manual game-style render loop.
- Rendering is event/state-driven through React updates.
- Framer Motion `animate(...)` promises sequence transitions (exit before route change, enter after route change).
- Real-time backend subscription triggers asynchronous rerenders when config changes.

### Asset/Resource Loading and Caching

- Assets uploaded into `configurations.files` and referenced by generated PocketBase file URLs.
- Browser handles network fetch/caching for image/video URLs; no explicit preload/cache layer present.
- Viewer loads config record but does not explicitly preload all referenced media.

### Performance Characteristics

Observed current behavior:

- Grid rendering relies on `react-grid-layout` (`useCSSTransforms={false}`, overlap enabled).
- Editor computes `scaleFactor` based on container/config aspect ratio.
- No visible memoization (`React.memo`), virtualization, or explicit dirty-flag system.
- Viewer re-renders full grid on state/subscription/route updates.

Potential migration-sensitive hot paths:

- frequent re-renders on large page layouts,
- animation + route transitions,
- repeated object creation while mapping props/layout.

### Animation/Timing Model

- Animation definitions are declarative data in `animationMap.js`.
- Two animation domains:
  - `viewAnimations` (opacity/scale/forward/backward)
  - `externalBoxAnimations` (swipes/ripple using overlay box)
- Components opt into animation by storing `animationType` + `animationName` in prop values.

## F. Feature Inventory

### 1. Route Navigation and Screen Topology

- **Name:** Multi-surface route navigation (auth, CMS, kiosk)
- **User-visible behavior:** Users log in, manage configs, and kiosk playback opens specific kiosk/page routes.
- **Key modules/files:** `client/src/App.jsx`, `client/src/layouts/BaseLayout.jsx`, `client/src/layouts/RequireAuthLayout.jsx`, `client/src/layouts/DashboardLayout.jsx`
- **Dependencies:** `react-router-dom`, PocketBase auth state
- **State touched:** route params, `isSignedIn`
- **Failure modes / fallback:** unauthenticated users redirected to `/login`; invalid kiosk page redirects to `/kiosk/:id/0`.
- **Test coverage status:** No automated tests found.

### 2. Authentication and Session Control

- **Name:** Username/password auth + route guard
- **User-visible behavior:** Login/signup/logout and protected dashboard access.
- **Key modules/files:** `client/src/views/Login.jsx`, `client/src/views/Signup.jsx`, `client/src/layouts/RequireAuthLayout.jsx`, `client/src/components/Navbar/Navbar.jsx`
- **Dependencies:** `@yogeshp98/pocketbase-react` (`useAuth`, `useClientContext`), PocketBase `users`
- **State touched:** `isSignedIn`, local `error/loading` form state
- **Failure modes / fallback:** login/signup errors displayed in UI; guard shows loader until auth state resolves.
- **Test coverage status:** No automated tests found.

### 3. Configuration Selection and Creation

- **Name:** Configuration picker and creation modal
- **User-visible behavior:** Operator selects existing configuration or creates a new one with dimensions.
- **Key modules/files:** `client/src/components/Common/ConfigurationPickerComponent.jsx`, `client/src/components/Navbar/Navbar.jsx`
- **Dependencies:** PocketBase collection subscription (`useAppContent('configurations', true)`)
- **State touched:** `currentConfiguration`, subscription state
- **Failure modes / fallback:** create call failures are not explicitly surfaced; picker shows default label if unresolved.
- **Test coverage status:** No automated tests found.

### 4. CMS Layout Editor (Drag/Drop + Ordering)

- **Name:** Declarative page layout authoring
- **User-visible behavior:** Drag components into grid, resize/reposition, reorder z-like sequence, delete instances.
- **Key modules/files:** `client/src/views/ConfigurationEditor.jsx`, `client/src/components/Kiosk/componentMap.js`
- **Dependencies:** `react-grid-layout`, `uuid`, PocketBase config record
- **State touched:** `pages`, `currentPage`, `selectedComponent`, `scaleFactor`, `loading`
- **Failure modes / fallback:** invalid `currentPage` disables editor canvas; direct state mutation patterns may cause subtle sync issues.
- **Test coverage status:** No automated tests found.

### 5. Prop Schema-Driven Component Editing

- **Name:** Dynamic prop form rendering
- **User-visible behavior:** Operator edits component properties through generated inputs with conditional follow-up questions.
- **Key modules/files:** `client/src/components/Common/PropFormComponent.jsx`, kiosk component `propMap` exports
- **Dependencies:** Chakra form controls, `react-colorful`, `use-debouncy`
- **State touched:** `pages[currentPage].propValues[componentId]`
- **Failure modes / fallback:** missing `propValues` paths can cause undefined access risks; unsupported input types render nothing.
- **Test coverage status:** No automated tests found.

### 6. Kiosk Playback Rendering

- **Name:** Declarative runtime renderer
- **User-visible behavior:** Kiosk displays selected page layout and components for assigned configuration.
- **Key modules/files:** `client/src/views/ConfigurationViewer.jsx`, `client/src/components/Kiosk/componentMap.js`, `client/src/components/Kiosk/*`
- **Dependencies:** PocketBase client, `react-grid-layout`, Framer Motion
- **State touched:** `config`, `currentAnimation`, `refreshCount`, route params
- **Failure modes / fallback:** missing/invalid page index redirects to first page; unresolved component keys would crash render path.
- **Test coverage status:** No automated tests found.

### 7. Content Ingestion / Asset Loading

- **Name:** File upload + media binding
- **User-visible behavior:** Upload files to configuration and bind them as image/video sources in components.
- **Key modules/files:** `client/src/components/Common/FileUploadComponent.jsx`, `client/src/components/Common/PropFormComponent.jsx`, `server/pb_schema.json` (`configurations.files`)
- **Dependencies:** PocketBase file storage API and file URL format
- **State touched:** `config.files`, `pages[].propValues`
- **Failure modes / fallback:** upload button rendering is gated on `fileUploadRef.current` and may not appear reliably without rerender; file URL construction is string-concatenated and backend-path-sensitive.
- **Test coverage status:** No automated tests found.

### 8. Input Device Support

- **Name:** Browser-input interaction model
- **User-visible behavior:** Touch/mouse click interactions (button), drag/drop in CMS, video-ended event navigation.
- **Key modules/files:** `ButtonComponent`, `VideoComponent`, `ConfigurationEditor` drag/drop handlers
- **Dependencies:** Browser pointer events, HTML5 drag/drop, video element events
- **State touched:** navigation state, layout state
- **Failure modes / fallback:** no specialized handling found for barcode scanners, card readers, or hardware peripherals; keyboard interaction is minimal.
- **Test coverage status:** No automated tests found.

### 9. Offline/Online Behavior

- **Name:** Connectivity behavior baseline
- **User-visible behavior:** App expects active backend connectivity for auth/config fetch/subscription.
- **Key modules/files:** `ConfigurationViewer`, `ConfigurationEditor`, `Login`, `Signup`
- **Dependencies:** PocketBase network availability
- **State touched:** config/auth loading states
- **Failure modes / fallback:** no explicit offline cache/retry queue found; behavior likely degrades to loading/errors from underlying client.
- **Test coverage status:** No automated tests found.

### 10. Telemetry / Logging

- **Name:** Operational telemetry baseline
- **User-visible behavior:** None (internal only).
- **Key modules/files:** sparse `console.log` calls in `Login`, `ConfigurationEditor`; shell script echoes
- **Dependencies:** browser console / shell stdout
- **State touched:** N/A
- **Failure modes / fallback:** no structured telemetry/analytics pipeline present; migration observability risk is high.
- **Test coverage status:** No automated tests found.

### 11. Error Handling and Recovery

- **Name:** Basic per-view error handling
- **User-visible behavior:** Auth errors shown as text; some fallback redirects; limited failure messaging elsewhere.
- **Key modules/files:** `Login.jsx`, `Signup.jsx`, `RequireAuthLayout.jsx`, `ConfigurationViewer.jsx`
- **Dependencies:** PocketBase error object shape
- **State touched:** local `error`, route navigation
- **Failure modes / fallback:** most editor/viewer data failures are not surfaced with robust UI recovery; preview creation/save lacks explicit error UI.
- **Test coverage status:** No automated tests found.

### 12. Update and Configuration Management

- **Name:** Live config update + kiosk assignment
- **User-visible behavior:** Kiosk can receive config updates through subscription; operators can save and push configs.
- **Key modules/files:** `ConfigurationViewer` subscription logic, `ConfigurationEditor.savePages/saveFiles/pushToKiosk`, `server/pb_schema.json`
- **Dependencies:** PocketBase realtime subscription and update API
- **State touched:** `config`, `pages`, `kiosks.configuration`
- **Failure modes / fallback:** no conflict resolution/versioning; subscription unsubscribe is broad and may impact multi-subscription scenarios.
- **Test coverage status:** No automated tests found.

### 13. Kiosk Device Runtime Control

- **Name:** Host-level kiosk launcher and power safety script
- **User-visible behavior:** Auto-launch Chromium in kiosk mode, rotate display, hide cursor, shutdown on AC disconnect.
- **Key modules/files:** `server_scripts/kiosk.sh`, `server_scripts/power_state_change.sh`
- **Dependencies:** GNOME settings, xrandr, Chromium, system power file, sudo shutdown permission
- **State touched:** host OS state (display orientation, process lifecycle, power)
- **Failure modes / fallback:** hardcoded display names and URL can break portability; forced shutdown behavior can terminate service abruptly.
- **Test coverage status:** No automated tests found.

## G. Constraints & Invariants (What We Must Preserve)

1. **Declarative component-to-config contract is the core invariant.**
   - Evidence: Viewer renders via `componentMap[componentName][0]` and `propValues[component.i]` in `ConfigurationViewer`.
   - Migration requirement: keep data-first component instantiation; do not switch to imperative widget orchestration.

2. **Rendering is driven by state + route, not imperative screen mutation.**
   - Evidence: page selection from route param (`:pageIndex`) and config state determines what renders.
   - Migration requirement: keep unidirectional flow `state/route -> rendered scene`.

3. **`propMap` schema is the authoring API for component configuration.**
   - Evidence: `PropFormComponent` recursively renders form controls from `propMap` and writes into `propValues`.
   - Migration requirement: preserve schema capabilities (`followUpQuestions`, `SPECIAL_always_show`, file/page selects).

4. **Component identity is bound to layout key format.**
   - Evidence: editor sets `layoutItem.i = componentType + '|' + uuid`; renderer splits on `|` to resolve type and prop key.
   - Migration requirement: maintain stable instance IDs and type extraction semantics (or provide compatibility adapter).

5. **Navigation actions are data-configurable through component props.**
   - Evidence: `ButtonComponent` and `VideoComponent` call injected `navigate` with configured `navigateTo`.
   - Migration requirement: keep action configuration in declarative data, not hardcoded route transitions per component.

6. **Side effects are orchestrated in shell/runtime layers.**
   - Evidence: network calls and subscriptions live in viewer/editor views; components are mostly render/action emitters.
   - Migration requirement: preserve separation so components remain portable and testable.

7. **Animation definitions are declarative resources.**
   - Evidence: `animations` map drives transition behavior by name/type.
   - Migration requirement: preserve named animation config model and binding from component props.

## H. Migration Strategy (High-Level)

### Lift-and-Shift Candidates

- `configurations`/`kiosks` domain model shape (pages/layout/propValues/files).
- `componentMap` + component `propMap` authoring pattern.
- Existing kiosk components (`Image`, `Button`, `Video`) with minor interface normalization.
- Route topology and user journey (auth -> CMS and kiosk playback route).

### Rework Candidates

- Direct PocketBase coupling in view components (replace with repository/service adapters).
- Imperative DOM access in editor (`document.getElementById`, mutable non-state vars).
- Limited error/offline handling and absent structured telemetry.
- Host script hardcoding (URL, output names, rotation assumptions).

### Proposed Seams / Adapters

1. **Content Repository Adapter**
   - Interface for `getKiosk`, `getConfiguration`, `subscribeConfiguration`, `updateConfiguration`, `assignKioskConfiguration`.
   - First implementation wraps existing PocketBase API.

2. **Renderer Adapter Layer**
   - Encapsulate layout-engine specifics (`react-grid-layout` today, alternative tomorrow).
   - Preserve input contract: page layout array + component registry + prop state.

3. **Component Runtime Contract Package**
   - Formalize component props (`CommonRuntimeProps`, `ComponentPropMapSchema`) and ID conventions.
   - Backward-compatible parsing for existing `i` key format.

4. **Effects/Action Dispatcher**
   - Route component events through a runtime action handler (`navigate`, `playAnimation`, external effects).
   - Keeps components declarative while isolating side-effect plumbing.

5. **Asset Resolver Service**
   - Centralize file URL generation and future CDN/storage changes.

### Incremental Migration Steps (Keep Kiosk Running)

1. **Codify contracts before replacing internals.**
   - Capture JSON schemas for `configurations.pages`, `layoutItem`, `propValues`.
   - Add compatibility tests/fixtures around existing render behavior.

2. **Extract data service from viewer/editor.**
   - Replace direct `pbClient.collection(...)` calls with repository abstraction.
   - Keep UI behavior unchanged.

3. **Extract renderer orchestration module.**
   - Move component resolution, navigation mapping, animation selection into a pure runtime module.
   - Keep `react-grid-layout` adapter in place initially.

4. **Introduce adapter-backed action/effects path.**
   - Route navigation/animation/file URL logic through typed runtime services.

5. **Migrate editor internals iteratively.**
   - Replace direct DOM reads/writes with controlled React state.
   - Preserve output JSON structure exactly.

6. **Harden operations.**
   - Add structured telemetry and explicit error UIs.
   - Parameterize kiosk launcher script values.

### Risks and Mitigations

- **Risk:** silent contract drift in `pages/layout/propValues`.
  - **Mitigation:** schema validation + golden config fixtures rendered in CI.
- **Risk:** behavior regressions in page navigation + animations.
  - **Mitigation:** integration tests for `navigateTo` + animation selection path.
- **Risk:** backend swap affecting realtime updates.
  - **Mitigation:** repository contract with deterministic subscription semantics and reconnect strategy.
- **Risk:** runtime outage during migration.
  - **Mitigation:** parallel-run old and new adapters behind feature flags by route/environment.

## I. Open Questions / Unknowns

1. What are the expected production uptime/reliability SLAs for kiosks (to prioritize offline caching, retry, and watchdog behavior)?
2. Are there additional kiosk components outside this repo or loaded dynamically elsewhere?
3. Is `@yogeshp98/pocketbase-react` behavior/version pinned organizationally, or can it be replaced with an internal data SDK?
4. Are there backend hooks, triggers, or external services tied to PocketBase that are not represented in this repository?
5. Is the hardcoded URL/device ID in `server_scripts/kiosk.sh` intentionally static, or should this be parameterized per deployment?
6. Are barcode readers, card readers, printers, or other peripherals required but implemented outside this codebase?
7. Should `configurations.pages` support nested containers/slots in the target architecture, or must it remain flat-grid only?
8. Is there an expected conflict model when multiple editors update one configuration concurrently?
9. What are acceptable animation fidelity/performance targets on kiosk hardware (FPS, transition latency)?
10. Are there existing manual test scripts/UAT checklists we should convert into automated migration regression tests?
11. Do we need backward compatibility for historical configurations with older `propMap` shapes?
12. Which deployment topology is target-state (same-device frontend+PocketBase, remote server, CDN, hybrid)?

---

## Code Reference Index (Primary)

- Boot/providers: `client/src/main.jsx`
- Route map: `client/src/App.jsx`
- Viewer runtime: `client/src/views/ConfigurationViewer.jsx`
- Editor runtime: `client/src/views/ConfigurationEditor.jsx`
- Component registry: `client/src/components/Kiosk/componentMap.js`
- Animation definitions + navigation prop schema: `client/src/components/Kiosk/animationMap.js`
- Prop schema renderer: `client/src/components/Common/PropFormComponent.jsx`
- File upload editor: `client/src/components/Common/FileUploadComponent.jsx`
- Auth and guard: `client/src/views/Login.jsx`, `client/src/views/Signup.jsx`, `client/src/layouts/RequireAuthLayout.jsx`
- Backend schema: `server/pb_schema.json`
- Kiosk host scripts: `server_scripts/kiosk.sh`, `server_scripts/power_state_change.sh`
