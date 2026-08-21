# FN Machine Care

**Machine Inspection & Service Management System**
ระบบตรวจสอบและบริหารงานบริการเครื่องจักร — F N Technology

A digital form system for automation machine builders. It replaces paper checklists with structured, photographed, signed records — and ties every record to one machine, so a machine's whole life reads as a single history.

```
01 MACHINE BUILD  →  02 PRE-DELIVERY  →  03 DELIVERY &      →  04 CUSTOMER
   CHECKLIST            INSPECTION           COMMISSIONING         SERVICE REPORT
```

---

## Why this exists

A checklist that only records "✓ machine checked" tells you nothing six months later. This system records **what the value actually was** — 24.12 VDC, 11.4 sec cycle time, PLC program `X722_PLC_V1.08` — plus photos, the technician's signature, and the root cause of every failure.

Every form is keyed by **Work No. + Machine Serial No.**, so opening a machine shows its full timeline:

```
X722 — AUTO CHECKER & APPEARANCE MCB MACHINE  (FN-X722-001)
│
├── 2026-08-14  BLD-2026-00031   Build checklist          ✔ complete
├── 2026-08-21  PDI-2026-00125   Pre-delivery inspection  🟢 READY FOR DELIVERY
├── 2026-08-25  DLV-2026-00044   Delivery & commissioning 🟡 accepted with open items
├── 2026-10-05  SR-2026-00318    PM service               🟢 operating normally
└── 2027-01-15  SR-2026-00402    Servo problem            🔴 further service required
```

---

## The four forms

### 01 — Machine Build Checklist `BLD`
Mechanical, electrical and software checks during assembly, plus an outstanding-work list so nothing reaches PDI half-finished.

### 02 — Pre-Delivery Inspection `PDI`
The final gate before a machine leaves the factory.

| Section | What it captures |
|---|---|
| A. Mechanical | M01–M10 — frame, bolts, conveyor alignment, pneumatics, guards |
| B. Electrical | E01–E12 — wiring, wire numbers, grounding, breaker, PLC power, drives |
| B2. Measured values | Actual readings: 24VDC supply, motor current, air pressure |
| C. PLC / Software | S01–S15 — I/O, auto & manual mode, alarms, E-stop, interlocks, recipes |
| C2. Program versions | PLC and HMI program revision — the record you'll want during a future breakdown |
| D. Performance | Cycle time, UPH, accuracy, reject rate, availability — **target vs. actual, auto-verdict** |
| D2. Trial production | Qty, good, NG, average cycle, run time, abnormal stops |
| E. Safety | SAF01–SAF08 — **any FAIL blocks approval** |
| F. Documentation | 12 deliverables from electrical drawings to packing list |
| G. Photo evidence | 7 required shots + unlimited extras |
| H. Final approval | 🟢 Ready / 🟡 Ready with minor action / 🔴 Not ready + 4 signatures |

### 03 — Delivery, Installation & Commissioning `DLV`
Transport damage, on-site installation, commissioning tests, on-site performance, customer training with a trainee register, a punch list for open items, and customer acceptance.

### 04 — Customer Service Report `SR`
Answers the four questions that matter: *why did we go, what did we find, what did we do, and what is the machine's condition now?*

Time-stamped troubleshooting log · root-cause category + description · parts replaced · post-service test · before/after photos · optional parts & labour costing with automatic total · customer signature.

---

## Features

- **PASS / FAIL / N/A — never just Yes/No.** A failure needs a remark explaining what happened and what was done.
- **Safety gate.** A failed safety item makes "READY FOR DELIVERY" un-selectable. Not a warning — a block.
- **Automatic verdicts.** Type an actual value against a target and the app decides PASS or FAIL.
- **Photos from the tablet camera**, downscaled to 1200 px and stored inside the record.
- **Finger/stylus signatures** on canvas, saved with the record.
- **Bilingual — Thai + English**, switchable to either alone. Every check item carries both languages.
- **Print to A4 PDF.** Print CSS strips the interface and prints only the selected answers, so the paper copy looks like a proper form.
- **Automatic document numbers** — `PDI-2026-00125`, `SR-2026-00321`.
- **Machine history timeline**, grouped by Work No. + Serial No.
- **Resumes where you left off.** The current form lives in the URL, so a tablet refresh mid-inspection loses nothing.
- **Backup & restore** as JSON, plus a CSV summary for management.
- **Works offline.** No server, no build step, no dependencies.

---

## Running it

Open `index.html` in a browser. That's the whole installation — a single file, everything inlined, works offline with no network at all.

For shared use on the shop floor, serve the folder over any static host:

```bash
# any one of these
python3 -m http.server 8080
npx serve .
```

Then open `http://<pc-ip>:8080` on the tablets.

### Deploying to GitHub Pages

Settings → Pages → Source: `main` / root. The app runs as-is from the published URL.

---

## Data & storage — read this before rolling out

Records are stored in the **browser's `localStorage`, on that device only**. There is no server and no sync.

That means:

- Each tablet holds its own records. Two tablets do not see each other's work.
- Clearing browser data, or "reset device", erases the records on that device.
- Photos dominate the storage budget (most browsers allow roughly 5–10 MB per site).

**Export a JSON backup regularly** from the Backup screen and keep the file on a company drive. If you outgrow this, the natural next step is a small backend — the data model in `app.js` is already shaped as plain JSON records ready to POST to an API.

---

## Project layout

The whole application is **one self-contained file** — no build step, no dependencies, nothing to install. Copy `index.html` onto a USB stick, email it, or drop it on a shared drive and it runs.

```
FN-Machine-Care/
├── index.html    The entire app — HTML + CSS + JavaScript in one file (~124 KB)
└── README.md
```

Inside `index.html`, in order:

| Block | What's in it |
|---|---|
| `<style>` | Dark shop-floor UI + the A4 print stylesheet |
| First `<script>` | **Form definitions** — every check item, in Thai and English |
| Second `<script>` | Rendering, storage, routing, signatures, photos, print |

### Adding or changing a check item

Open `index.html` in any text editor and find the first `<script>` block. Everything is plain data. To add a mechanical check, add one line:

```js
const MECHANICAL_ITEMS = [
  ['M01', 'Machine frame / structure complete', 'โครงสร้างเครื่องครบถ้วน'],
  // …
  ['M11', 'Belt tension verified', 'ตรวจสอบความตึงสายพาน'],   // ← new
];
```

The UI, the progress counter, the print layout and the CSV export all pick it up. No UI code to touch.

To add a whole section, append an object to a form's `sections` array using one of the supported types: `fields`, `checklist`, `condition`, `measurements`, `performance`, `documents`, `photos`, `beforeafter`, `table`, `costtable`, `notes`, `problem`, `rootcause`, `result`, `signoff`.

> Save your edit, refresh the browser, done. Records already stored on the device are not affected — new items simply appear unanswered on new forms.

---

## Roadmap

- Shared backend so all tablets and the office see the same records
- PM scheduling — due dates and reminders per machine
- Spare-parts consumption tracking across service reports
- Machine QR codes: scan the nameplate, open that machine's history
- Feed lifecycle data into FN Machine Intelligence / machine monitoring

---

## Browser support

Any current Chrome, Edge, Firefox or Safari, on desktop or tablet. Camera capture uses the standard file input with `capture`, so it opens the rear camera on phones and tablets.

---

**F N Technology** · Automation Machines & Automation Stations
