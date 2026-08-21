# FN Machine Care

**Machine Inspection & Service Management System**
ระบบตรวจสอบและบริหารงานบริการเครื่องจักร — F N Technology

A digital form system for automation machine builders. It replaces paper checklists with structured, photographed, signed records — and ties every record to one machine, so a machine's whole life reads as a single history.

```
01 MACHINE BUILD  →  02 FACTORY        →  03 SITE            →  04 CUSTOMER
   CHECKLIST            ACCEPTANCE TEST      ACCEPTANCE TEST       SERVICE REPORT
   (ASSY)               (FAT)                (SAT)                 (SR)
```

**FAT** and **SAT** are the terms your customers already use. A Factory Acceptance Test proves the machine at *your* factory before it ships; a Site Acceptance Test proves it again at *theirs* after installation. Both appear in purchase agreements and customer quality manuals worldwide, so a report headed `FAT-2026-00125` needs no explanation to a buyer in Nagoya or Stuttgart. Each form also carries a one-line description in the app, in Thai and English.

---

## Why this exists

A checklist that only records "✓ machine checked" tells you nothing six months later. This system records **what the value actually was** — 24.12 VDC, 11.4 sec cycle time, PLC program `X722_PLC_V1.08` — plus photos, the technician's signature, and the root cause of every failure.

Every form is keyed by **Work No. + Machine Serial No.**, so opening a machine shows its full timeline:

```
X722 — AUTO CHECKER & APPEARANCE MCB MACHINE  (FN-X722-001)
│
├── 2026-08-14  ASSY-2026-00031  Build checklist          ✔ complete
├── 2026-08-21  FAT-2026-00125   Factory acceptance test  🟢 READY FOR DELIVERY
├── 2026-08-25  SAT-2026-00044   Site acceptance test     🟡 accepted with open items
├── 2026-10-05  SR-2026-00318    PM service               🟢 operating normally
└── 2027-01-15  SR-2026-00402    Servo problem            🔴 further service required
```

---

## The four forms

### 01 — Machine Build Checklist `ASSY`
Mechanical, electrical and software checks during assembly, plus an outstanding-work list so nothing reaches the FAT half-finished.

### 02 — Factory Acceptance Test `FAT`
The final gate before a machine leaves your factory. *การทดสอบรับรองที่โรงงานเรา*

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

### 03 — Site Acceptance Test & Commissioning `SAT`
Transport damage, on-site installation, commissioning tests, on-site performance, customer training with a trainee register, a punch list for open items, and customer acceptance.

### 04 — Customer Service Report `SR`
Answers the four questions that matter: *why did we go, what did we find, what did we do, and what is the machine's condition now?*

Time-stamped troubleshooting log · root-cause category + description · parts replaced · post-service test · before/after photos · optional parts & labour costing with automatic total · customer signature.

---

## Features

- **PASS / FAIL / N/A — never just Yes/No.** A failure needs a remark explaining what happened and what was done.
- **Submit refuses an incomplete form.** Every required field, every unanswered check, the result and the signatures are counted; the page scrolls to the first gap and each one pulses red until it is filled, then turns green. Red only appears *after* Submit is pressed — nagging someone about a field they have not reached yet is just noise.
- **Nothing is retyped.** Work No., Machine, Serial No., Customer and PO No. offer what has been entered before, and choosing one known value fills the rest of that machine's identity in.
- **People are picked from a register**, not typed, with their position shown beside the name — so the same technician is spelled the same way on every report. Add someone new from inside any form.
- **A submission slip** is generated on submit: document number, machine, result, the date and time, and who signed it off with their position. Saved with the record and downloadable as a PNG.
- **Safety gate.** A failed safety item makes "READY FOR DELIVERY" un-selectable. Not a warning — a block.
- **Automatic verdicts.** Type an actual value against a target and the app decides PASS or FAIL.
- **Photos from the tablet camera**, downscaled to 1200 px and stored inside the record.
- **Finger/stylus signatures** on canvas, saved with the record.
- **Thai or English**, switched in one tap. Every check item, form name and description is written in both.
- **Light, Dark or Auto appearance.** Auto follows the tablet, so the app dims itself with the rest of the screen in the evening.
- **Built for the tablet, not shrunk onto it.** Below 1280px — which covers tablets in landscape — the menu becomes a toggle drawer opened by ☰, with room for full labels plus appearance and language. Verdict buttons stretch to full width as thumb targets, and every control clears 42–58px on touch.
- **Print to A4 PDF.** Print CSS strips the interface and prints only the selected answers, so the paper copy looks like a proper form.
- **Automatic document numbers** — `FAT-2026-00125`, `SR-2026-00321`.
- **Save draft vs Submit.** A draft saves whatever is there; Submit is the gate that demands completeness and stamps the record.
- **Machine history timeline**, grouped by Work No. + Serial No.
- **Machines page with customer → machine dropdowns.** Every machine's record counts at a glance, and a **service count you can tap** to see the visits behind it — date, type, technician, root cause, outcome — each one opening its full report. Pick a single machine and the page becomes that machine's card.
- **Icons animate in three states** — a slow idle loop, a purposeful move on hover, a quick recoil on press. Idle loops run only in the menu and on the form cards, never on table badges, so a long list stays still.
- **A dashboard that answers the service manager's questions.** A bar chart of customers — machines installed against service visits — that you tap to drill into that customer's machines. Underneath: what kind of work we were called out to do, what root causes keep recurring, and a machine-by-machine table of each one's usual problem.

  Chart colours were run through a palette validator (lightness band, chroma floor, colour-blind separation, contrast against the actual surface) for each theme, so dark mode uses its own steps rather than a flip of the light ones. Every bar is a real button, and a **Show numbers** toggle reveals the same data as a table.
- **Resumes where you left off.** The current form lives in the URL, so a tablet refresh mid-inspection loses nothing.
- **Backup & restore** as JSON, plus a CSV summary for management — behind a developer sign-in, because that screen can erase everything.
- **New Form asks where the machine is** — still in our factory, or already at the customer's — and shows only the forms that apply.
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

## The Backup screen is locked

Backup, restore and **Erase all data** sit behind a sign-in (`Developer` + password). This exists because one careless tap on a shared tablet wipes every record on that device.

**Be clear about what this is.** The whole app runs in the browser, so anyone who opens the page source or DevTools can walk straight past the gate. It prevents accidents. It is not security, and it should never guard anything that actually matters.

The password is stored as a salted SHA-256 digest, so the plain string is not in this repository. To change it:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('FN-Machine-Care::v1::' + 'YOUR-NEW-PASSWORD').digest('hex'))"
```

Put the result in `AUTH.pass` inside `index.html`. Give this app its **own** password — never reuse one from another system, since a hash committed to a public repo can be attacked offline.

Unlocking lasts for the browser tab only; closing it re-locks, and there's a **Lock** button to end the session early.

## Example data

`example-data/fn-machine-care-example-data.json` is a realistic fleet you can load to see the dashboard and reports working before you enter anything real:

| Customer | Machines | Service visits |
|---|---:|---:|
| Thai Auto Components | 4 | 12 |
| ABC Manufacturing Co., Ltd. | 3 | 9 |
| Bangkok Electronics Assembly | 2 | 6 |
| Siam Precision Parts | 2 | 4 |
| Nippon Denso (Thailand) | 1 | 2 |

69 records in total — every machine carries its ASSY, FAT and SAT, then a service history with deliberate patterns: Thai Auto Components keeps failing on pneumatics, ABC keeps losing the same sensor, and Nippon Denso only ever sees scheduled PM. That is what makes *What keeps going wrong* worth reading.

Load it from **Backup → Import backup**. Import adds records without touching what is already there, so try it on a spare device rather than the tablet holding your real work.

## Data & storage — read this before rolling out

**The device always comes first.** Every record is written to the browser's `localStorage` the moment you touch it. Signal or no signal, the app works; the tablet in the customer's plant room does not need Wi-Fi.

On top of that sits an optional shared database. When a technician is signed in, records sync to Firebase so every tablet and the office see the same work.

- **Not signed in?** Everything still works. The badge in the sidebar reads *this device only*.
- **Two tablets edit the same record?** The one with the newer `updatedAt` wins. Whole records, not fields.
- **Photos dominate the storage budget** (most browsers allow roughly 5–10 MB per site).

**Export a JSON backup regularly** from the Backup screen and keep the file on a company drive. The cloud is a convenience; the export is the archive.

---

## The shared database (Firebase)

| | |
|---|---|
| Firebase project | **FN-Service-System** — `fn.developer26@gmail.com` |
| Realtime Database | `asia-southeast1` (Singapore) |
| Sign-in | Anonymous — automatic, nobody types anything |

This is a **separate project from FN-ERP-System**. The two databases share nothing: no data, no accounts, no rules. Wiping one cannot touch the other.

### There is nothing to set up on a tablet

Open the page. That's it. The app asks Firebase for a guest identity in the background and the rules accept it. No accounts to create, no passwords to hand out, nothing for a technician to get wrong at 7am in a customer's plant room — the same arrangement the ERP uses.

Guest identities are cleaned up after 30 days. When one expires the app quietly asks for another; records live under `/records`, not under the identity, so nothing is lost.

### What this protects against, and what it does not

Be clear-eyed about it. This page is **public**. Anyone who reads the source can ask for a guest identity of their own, and the database cannot tell their browser from a technician's tablet.

What the rules still buy you:

```json
"records": {
  ".write": false,                              // the collection itself cannot be written
  "$recordId": { ".write": "auth != null" }     // only one record at a time
}
```

Wiping the service history would take one delete per record rather than a single call, and a random crawler — which carries no Firebase client at all — gets nothing. That is the honest extent of it.

**If these records ever need real protection** — a customer contract demands it, or the history becomes something you would be hurt to lose — switch the sign-in method to Email/Password and give each technician an account. The rules do not change; only `signInAnonymously` becomes `signInWithEmailAndPassword`.

A Firebase web config is an **address, not a password**; it is meant to ship inside the page. A service-account key is a different animal entirely — it bypasses every rule. **Never put one in this repo.**

---

## Project layout

The whole application is **one self-contained file** — no build step, no dependencies, nothing to install. Copy `index.html` onto a USB stick, email it, or drop it on a shared drive and it runs.

```
FN-Machine-Care/
├── index.html            The entire app — HTML + CSS + JavaScript in one file
├── database.rules.json   Firebase security rules — deny by default, no bulk writes
├── firebase.json         Points the CLI at those rules
├── example-data/         69 sample records across 5 customers
└── README.md
```

Inside `index.html`, in order:

| Block | What's in it |
|---|---|
| `<style>` | The visionOS theme, both appearances, and the A4 print stylesheet |
| First `<script>` | **Form definitions** — every check item, in Thai and English — plus the icon set |
| Second `<script>` | Cloud sync — Firebase config, sign-in, merge. Loads the SDK only when signed in |
| Third `<script>` | Rendering, storage, routing, theme, signatures, photos, print |

### One design rule

> **Glass for the chrome. Solid for the verdict.**

Panels, the sidebar and the toolbar are frosted glass floating over an ambient background — the visionOS material. But PASS / FAIL / N/A and every safety-carrying status are **fully opaque and saturated**; they deliberately punch through the glass.

Translucency is lovely and it lowers contrast. A technician under factory lighting, holding a tablet at arm's length, must never squint to tell whether a row passed. So the decoration yields wherever a judgment is being recorded.

Appearance is stored per device (`data-theme` on `<html>`), so it survives a refresh and never collides with the language setting on `<body>`.

The menu is ordered by how often a technician reaches for it — **New Form → Records → Machines → Dashboard → Backup** — so the most common action is the first thing under the thumb.

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

- Per-role rules — technicians write their own reports, the office reads everything
- PM scheduling — due dates and reminders per machine
- Spare-parts consumption tracking across service reports
- Machine QR codes: scan the nameplate, open that machine's history
- Feed lifecycle data into FN Machine Intelligence / machine monitoring

---

## Browser support

Any current Chrome, Edge, Firefox or Safari, on desktop or tablet. Camera capture uses the standard file input with `capture`, so it opens the rear camera on phones and tablets.

---

**F N Technology** · Automation Machines & Automation Stations
