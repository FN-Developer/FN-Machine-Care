/* =============================================================
   FN MACHINE CARE — Form Definitions
   Machine Inspection & Service Management System
   F N Technology
   -------------------------------------------------------------
   All form content lives here as data. The renderer in app.js
   builds the UI from these definitions, so adding a new check
   item means adding one line here — no UI code changes.

   Label format:  { en: "...", th: "..." }
   ============================================================= */

/* ---------- Reusable check item groups ---------- */

const MECHANICAL_ITEMS = [
  ['M01', 'Machine frame / structure complete', 'โครงสร้างเครื่องครบถ้วน'],
  ['M02', 'All bolts tightened', 'ขันน็อตครบทุกจุด'],
  ['M03', 'Conveyor alignment', 'การตั้งศูนย์สายพานลำเลียง'],
  ['M04', 'Pneumatic cylinder installation', 'การติดตั้งกระบอกลม'],
  ['M05', 'Pneumatic tubing connected correctly', 'ต่อสายลมถูกต้อง'],
  ['M06', 'Sensor brackets installed', 'ติดตั้งขายึดเซนเซอร์'],
  ['M07', 'Moving mechanism operates smoothly', 'กลไกเคลื่อนที่ทำงานราบรื่น'],
  ['M08', 'No abnormal noise', 'ไม่มีเสียงผิดปกติ'],
  ['M09', 'Lubrication completed', 'หล่อลื่นเรียบร้อย'],
  ['M10', 'Machine covers / guards installed', 'ติดตั้งฝาครอบ / การ์ดนิรภัย'],
];

const ELECTRICAL_ITEMS = [
  ['E01', 'Electrical cabinet wiring completed', 'เดินสายไฟในตู้คอนโทรลเรียบร้อย'],
  ['E02', 'Wire numbers match drawing', 'เลขสายไฟตรงกับแบบ'],
  ['E03', 'Terminal connections checked', 'ตรวจสอบจุดต่อเทอร์มินอล'],
  ['E04', 'Grounding completed', 'ต่อสายดินเรียบร้อย'],
  ['E05', 'Main breaker operation', 'การทำงานของเบรกเกอร์หลัก'],
  ['E06', '24VDC voltage checked', 'ตรวจวัดแรงดัน 24VDC'],
  ['E07', 'PLC power checked', 'ตรวจสอบไฟเลี้ยง PLC'],
  ['E08', 'HMI operation', 'การทำงานของ HMI'],
  ['E09', 'Sensors detected correctly', 'เซนเซอร์ตรวจจับถูกต้อง'],
  ['E10', 'Solenoid valves operate correctly', 'โซลินอยด์วาล์วทำงานถูกต้อง'],
  ['E11', 'Servo / motor operation', 'การทำงานของเซอร์โว / มอเตอร์'],
  ['E12', 'Inverter / drive parameters verified', 'ตรวจสอบพารามิเตอร์อินเวอร์เตอร์ / ไดรฟ์'],
];

const SOFTWARE_ITEMS = [
  ['S01', 'PLC program installed', 'ติดตั้งโปรแกรม PLC'],
  ['S02', 'Correct PLC program revision', 'เวอร์ชันโปรแกรม PLC ถูกต้อง'],
  ['S03', 'HMI program installed', 'ติดตั้งโปรแกรม HMI'],
  ['S04', 'HMI ↔ PLC communication', 'การสื่อสารระหว่าง HMI กับ PLC'],
  ['S05', 'All input signals tested', 'ทดสอบสัญญาณอินพุตครบทุกจุด'],
  ['S06', 'All output signals tested', 'ทดสอบสัญญาณเอาต์พุตครบทุกจุด'],
  ['S07', 'Auto Mode tested', 'ทดสอบโหมดอัตโนมัติ'],
  ['S08', 'Manual Mode tested', 'ทดสอบโหมดแมนนวล'],
  ['S09', 'Cycle sequence tested', 'ทดสอบลำดับการทำงาน'],
  ['S10', 'Alarm functions tested', 'ทดสอบฟังก์ชันแจ้งเตือน'],
  ['S11', 'Sensor failure alarm tested', 'ทดสอบการแจ้งเตือนเซนเซอร์ผิดปกติ'],
  ['S12', 'Emergency Stop tested', 'ทดสอบปุ่มหยุดฉุกเฉิน'],
  ['S13', 'Safety interlock tested', 'ทดสอบระบบอินเตอร์ล็อกนิรภัย'],
  ['S14', 'Production counter tested', 'ทดสอบตัวนับจำนวนผลิต'],
  ['S15', 'Recipe / parameter functions tested', 'ทดสอบฟังก์ชันรีซิพี / พารามิเตอร์'],
];

const SAFETY_ITEMS = [
  ['SAF01', 'Emergency Stop', 'ปุ่มหยุดฉุกเฉิน'],
  ['SAF02', 'Safety Door Switch', 'สวิตช์ประตูนิรภัย'],
  ['SAF03', 'Light Curtain', 'ม่านแสงนิรภัย'],
  ['SAF04', 'Safety Relay', 'เซฟตี้รีเลย์'],
  ['SAF05', 'Pneumatic safety', 'ความปลอดภัยระบบลม'],
  ['SAF06', 'Warning labels', 'ป้ายเตือน'],
  ['SAF07', 'Moving parts guarded', 'มีการ์ดป้องกันชิ้นส่วนเคลื่อนที่'],
  ['SAF08', 'Electrical cabinet warning', 'ป้ายเตือนตู้ไฟฟ้า'],
];

const DOCUMENT_ITEMS = [
  ['D01', 'Electrical Drawing', 'แบบไฟฟ้า'],
  ['D02', 'Pneumatic Drawing', 'แบบนิวเมติก'],
  ['D03', 'PLC Backup', 'สำรองโปรแกรม PLC'],
  ['D04', 'HMI Backup', 'สำรองโปรแกรม HMI'],
  ['D05', 'Operation Manual', 'คู่มือการใช้งาน'],
  ['D06', 'Maintenance Manual', 'คู่มือการบำรุงรักษา'],
  ['D07', 'Spare Parts List', 'รายการอะไหล่'],
  ['D08', 'Recommended Spare Parts', 'อะไหล่แนะนำสำรอง'],
  ['D09', 'Machine Specification', 'สเปคเครื่องจักร'],
  ['D10', 'Software Version Record', 'บันทึกเวอร์ชันซอฟต์แวร์'],
  ['D11', 'Customer Training Document', 'เอกสารอบรมลูกค้า'],
  ['D12', 'Packing List', 'ใบรายการบรรจุ'],
];

const PDI_PHOTOS = [
  ['P1', 'Front of Machine', 'ด้านหน้าเครื่อง'],
  ['P2', 'Rear of Machine', 'ด้านหลังเครื่อง'],
  ['P3', 'Electrical Cabinet', 'ตู้ไฟฟ้า'],
  ['P4', 'HMI Screen', 'หน้าจอ HMI'],
  ['P5', 'Nameplate / Serial Number', 'เนมเพลท / หมายเลขเครื่อง'],
  ['P6', 'Final Machine Condition', 'สภาพเครื่องขั้นสุดท้าย'],
  ['P7', 'Special Customer Requirement', 'ข้อกำหนดพิเศษของลูกค้า'],
];

/* Helper: turn the compact triples above into check-item objects */
function checks(rows) {
  return rows.map(([code, en, th]) => ({ code, label: { en, th } }));
}

/* ---------- Shared machine-identity header ---------- */

function machineHeader(extra = []) {
  return {
    id: 'header',
    title: { en: 'Machine Information', th: 'ข้อมูลเครื่องจักร' },
    type: 'fields',
    fields: [
      { key: 'workNo', label: { en: 'Work No.', th: 'เลขที่งาน' }, type: 'text', placeholder: 'X722', required: true },
      { key: 'machineName', label: { en: 'Machine Name', th: 'ชื่อเครื่องจักร' }, type: 'text', placeholder: 'AUTO CHECKER & APPEARANCE MCB MACHINE', required: true },
      { key: 'serialNo', label: { en: 'Machine Serial No.', th: 'หมายเลขเครื่อง' }, type: 'text', placeholder: 'FN-X722-001', required: true },
      { key: 'customer', label: { en: 'Customer', th: 'ลูกค้า' }, type: 'text', placeholder: 'ABC Manufacturing Co., Ltd.', required: true },
      { key: 'poNo', label: { en: 'PO No.', th: 'เลขที่ใบสั่งซื้อ' }, type: 'text', placeholder: 'PO-2026-0088' },
      ...extra,
    ],
  };
}

const SIGNOFF_ROLES_PDI = [
  { key: 'inspector', label: { en: 'Inspector', th: 'ผู้ตรวจสอบ' } },
  { key: 'projectEngineer', label: { en: 'Project Engineer', th: 'วิศวกรโครงการ' } },
  { key: 'qaSupervisor', label: { en: 'QA / Supervisor', th: 'QA / หัวหน้างาน' } },
  { key: 'manager', label: { en: 'Manager Approval', th: 'ผู้จัดการอนุมัติ' } },
];

/* =============================================================
   FORM 01 — MACHINE BUILD CHECKLIST
   ============================================================= */

const FORM_BUILD = {
  type: 'BUILD',
  code: '01',
  prefix: 'BLD',
  name: { en: 'Machine Build Checklist', th: 'เช็คลิสต์การประกอบเครื่อง' },
  short: { en: 'Build', th: 'ประกอบ' },
  icon: '🔧',
  accent: '#8b5cf6',
  sections: [
    machineHeader([
      { key: 'buildDate', label: { en: 'Build Check Date', th: 'วันที่ตรวจ' }, type: 'date', required: true },
      { key: 'assembler', label: { en: 'Assembler', th: 'ผู้ประกอบ' }, type: 'text' },
      { key: 'checkedBy', label: { en: 'Checked By', th: 'ผู้ตรวจสอบ' }, type: 'text', required: true },
      { key: 'buildStage', label: { en: 'Build Stage', th: 'ขั้นตอนการประกอบ' }, type: 'select',
        options: [
          { value: 'mechanical', label: { en: 'Mechanical assembly', th: 'ประกอบเครื่องกล' } },
          { value: 'electrical', label: { en: 'Electrical wiring', th: 'เดินระบบไฟฟ้า' } },
          { value: 'software', label: { en: 'Software / program', th: 'ซอฟต์แวร์ / โปรแกรม' } },
          { value: 'complete', label: { en: 'Build complete', th: 'ประกอบเสร็จสมบูรณ์' } },
        ] },
    ]),
    { id: 'mech', title: { en: 'A. Mechanical Check', th: 'A. ตรวจสอบเครื่องกล' }, type: 'checklist', items: checks(MECHANICAL_ITEMS) },
    { id: 'elec', title: { en: 'B. Electrical Check', th: 'B. ตรวจสอบไฟฟ้า' }, type: 'checklist', items: checks(ELECTRICAL_ITEMS) },
    { id: 'soft', title: { en: 'C. Software Check', th: 'C. ตรวจสอบซอฟต์แวร์' }, type: 'checklist', items: checks(SOFTWARE_ITEMS) },
    { id: 'buildNotes', title: { en: 'D. Outstanding Work', th: 'D. งานที่ยังค้าง' }, type: 'notes',
      placeholder: { en: 'List anything still to be finished before PDI…', th: 'ระบุงานที่ต้องทำให้เสร็จก่อนตรวจ PDI…' } },
    { id: 'buildPhotos', title: { en: 'E. Build Photos', th: 'E. รูปถ่ายการประกอบ' }, type: 'photos', items: [], allowFree: true },
    { id: 'signoff', title: { en: 'F. Sign-off', th: 'F. ลงนาม' }, type: 'signoff',
      roles: [
        { key: 'assembler', label: { en: 'Assembler', th: 'ผู้ประกอบ' } },
        { key: 'checker', label: { en: 'Checker', th: 'ผู้ตรวจสอบ' } },
      ] },
  ],
};

/* =============================================================
   FORM 02 — PRE-DELIVERY INSPECTION (PDI)
   The final gate before the machine leaves F N Technology.
   ============================================================= */

const FORM_PDI = {
  type: 'PDI',
  code: '02',
  prefix: 'PDI',
  name: { en: 'Pre-Delivery Inspection', th: 'การตรวจสอบก่อนส่งมอบ' },
  short: { en: 'PDI', th: 'PDI' },
  icon: '✅',
  accent: '#0ea5e9',
  safetyGate: true, // any FAIL in the safety section blocks approval
  sections: [
    machineHeader([
      { key: 'inspectionDate', label: { en: 'Inspection Date', th: 'วันที่ตรวจสอบ' }, type: 'date', required: true },
      { key: 'deliveryDate', label: { en: 'Planned Delivery Date', th: 'วันที่ส่งมอบตามแผน' }, type: 'date' },
      { key: 'inspector', label: { en: 'Inspector', th: 'ผู้ตรวจสอบ' }, type: 'text', required: true },
      { key: 'projectEngineer', label: { en: 'Project Engineer', th: 'วิศวกรโครงการ' }, type: 'text' },
    ]),

    { id: 'mech', title: { en: 'A. Mechanical Checklist', th: 'A. เช็คลิสต์เครื่องกล' }, type: 'checklist', items: checks(MECHANICAL_ITEMS) },

    { id: 'elec', title: { en: 'B. Electrical Checklist', th: 'B. เช็คลิสต์ไฟฟ้า' }, type: 'checklist', items: checks(ELECTRICAL_ITEMS) },

    { id: 'measure', title: { en: 'B2. Measured Values', th: 'B2. ค่าที่วัดได้' },
      hint: { en: 'Record the actual reading — not just Pass/Fail. This builds the machine\'s history.',
              th: 'บันทึกค่าที่วัดได้จริง ไม่ใช่แค่ผ่าน/ไม่ผ่าน เพื่อเก็บเป็นประวัติเครื่อง' },
      type: 'measurements',
      items: [
        { key: 'v24', label: { en: '24VDC Supply', th: 'แรงดัน 24VDC' }, unit: 'VDC', placeholder: '24.12' },
        { key: 'motorCurrent', label: { en: 'Motor Current', th: 'กระแสมอเตอร์' }, unit: 'A', placeholder: '3.4' },
        { key: 'airPressure', label: { en: 'Air Pressure', th: 'แรงดันลม' }, unit: 'bar', placeholder: '5.8' },
      ] },

    { id: 'soft', title: { en: 'C. PLC / Software / Automation Test', th: 'C. ทดสอบ PLC / ซอฟต์แวร์ / ระบบอัตโนมัติ' }, type: 'checklist', items: checks(SOFTWARE_ITEMS) },

    { id: 'version', title: { en: 'C2. Program Version Record', th: 'C2. บันทึกเวอร์ชันโปรแกรม' },
      hint: { en: 'Essential later for machine monitoring and troubleshooting.',
              th: 'สำคัญมากสำหรับการติดตามและแก้ปัญหาเครื่องในอนาคต' },
      type: 'fields',
      fields: [
        { key: 'plcVersion', label: { en: 'PLC Program', th: 'โปรแกรม PLC' }, type: 'text', placeholder: 'X722_PLC_V1.08' },
        { key: 'hmiVersion', label: { en: 'HMI Program', th: 'โปรแกรม HMI' }, type: 'text', placeholder: 'X722_HMI_V1.05' },
        { key: 'versionDate', label: { en: 'Version Date', th: 'วันที่ของเวอร์ชัน' }, type: 'date' },
      ] },

    { id: 'perf', title: { en: 'D. Production Performance Test', th: 'D. ทดสอบสมรรถนะการผลิต' }, type: 'performance',
      items: [
        { key: 'cycleTime', label: { en: 'Cycle Time', th: 'รอบเวลาการทำงาน' }, target: '≤ 12 sec', unit: 'sec', better: 'lower' },
        { key: 'uph', label: { en: 'UPH', th: 'ผลผลิตต่อชั่วโมง' }, target: '≥ 300 pcs/hr', unit: 'pcs/hr', better: 'higher' },
        { key: 'accuracy', label: { en: 'Accuracy', th: 'ความแม่นยำ' }, target: '≥ 99 %', unit: '%', better: 'higher' },
        { key: 'rejectRate', label: { en: 'Reject Rate', th: 'อัตราของเสีย' }, target: '≤ 1 %', unit: '%', better: 'lower' },
        { key: 'availability', label: { en: 'Machine Availability', th: 'ความพร้อมใช้งานเครื่อง' }, target: '≥ 95 %', unit: '%', better: 'higher' },
      ] },

    { id: 'trial', title: { en: 'D2. Trial Production', th: 'D2. ทดลองผลิต' }, type: 'fields',
      fields: [
        { key: 'trialQty', label: { en: 'Trial Quantity', th: 'จำนวนที่ทดลองผลิต' }, type: 'number', placeholder: '100', unit: 'pcs' },
        { key: 'trialGood', label: { en: 'Good', th: 'ของดี' }, type: 'number', placeholder: '98', unit: 'pcs' },
        { key: 'trialNG', label: { en: 'NG', th: 'ของเสีย' }, type: 'number', placeholder: '2', unit: 'pcs' },
        { key: 'trialCycleAvg', label: { en: 'Average Cycle Time', th: 'รอบเวลาเฉลี่ย' }, type: 'number', placeholder: '11.4', unit: 'sec' },
        { key: 'trialRunTime', label: { en: 'Total Run Time', th: 'เวลาเดินเครื่องรวม' }, type: 'number', placeholder: '19', unit: 'min' },
        { key: 'trialStops', label: { en: 'Abnormal Stops', th: 'จำนวนครั้งที่หยุดผิดปกติ' }, type: 'number', placeholder: '1', unit: 'times' },
      ] },

    { id: 'safety', title: { en: 'E. Safety Checklist', th: 'E. เช็คลิสต์ความปลอดภัย' },
      hint: { en: 'If ANY safety item fails, PDI cannot be approved.', th: 'หากรายการความปลอดภัยข้อใดไม่ผ่าน จะไม่สามารถอนุมัติ PDI ได้' },
      type: 'checklist', critical: true, items: checks(SAFETY_ITEMS) },

    { id: 'docs', title: { en: 'F. Documentation & Delivery', th: 'F. เอกสารและการส่งมอบ' }, type: 'documents', items: checks(DOCUMENT_ITEMS) },

    { id: 'photos', title: { en: 'G. Photo Evidence', th: 'G. หลักฐานรูปถ่าย' }, type: 'photos', items: checks(PDI_PHOTOS), allowFree: true },

    { id: 'result', title: { en: 'H. Final Approval', th: 'H. การอนุมัติขั้นสุดท้าย' }, type: 'result',
      options: [
        { value: 'ready', color: '#22c55e', label: { en: 'READY FOR DELIVERY', th: 'พร้อมส่งมอบ' } },
        { value: 'minor', color: '#eab308', label: { en: 'READY WITH MINOR ACTION', th: 'พร้อมส่งมอบ แต่มีงานแก้ไขเล็กน้อย' } },
        { value: 'notready', color: '#ef4444', label: { en: 'NOT READY FOR DELIVERY', th: 'ยังไม่พร้อมส่งมอบ' } },
      ] },

    { id: 'signoff', title: { en: 'Signatures', th: 'ลายเซ็น' }, type: 'signoff', roles: SIGNOFF_ROLES_PDI },
  ],
};

/* =============================================================
   FORM 03 — DELIVERY / INSTALLATION / COMMISSIONING
   ============================================================= */

const FORM_DELIVERY = {
  type: 'DELIVERY',
  code: '03',
  prefix: 'DLV',
  name: { en: 'Delivery, Installation & Commissioning', th: 'การส่งมอบ ติดตั้ง และเดินเครื่อง' },
  short: { en: 'Delivery', th: 'ส่งมอบ' },
  icon: '🚚',
  accent: '#f59e0b',
  sections: [
    machineHeader([
      { key: 'siteAddress', label: { en: 'Installation Site', th: 'สถานที่ติดตั้ง' }, type: 'text' },
      { key: 'arrivalDate', label: { en: 'Arrival Date', th: 'วันที่เครื่องถึงหน้างาน' }, type: 'date' },
      { key: 'commissionDate', label: { en: 'Commissioning Date', th: 'วันที่เดินเครื่อง' }, type: 'date', required: true },
      { key: 'engineer', label: { en: 'Engineer In Charge', th: 'วิศวกรผู้รับผิดชอบ' }, type: 'text', required: true },
      { key: 'customerContact', label: { en: 'Customer Contact', th: 'ผู้ติดต่อฝ่ายลูกค้า' }, type: 'text' },
    ]),

    { id: 'transport', title: { en: 'A. Transport & Unpacking', th: 'A. การขนส่งและแกะกล่อง' }, type: 'checklist',
      items: checks([
        ['T01', 'Machine arrived without transport damage', 'เครื่องถึงหน้างานโดยไม่เสียหายจากการขนส่ง'],
        ['T02', 'All crates / boxes received per packing list', 'ได้รับลังและกล่องครบตามใบรายการบรรจุ'],
        ['T03', 'Loose parts and accessories complete', 'อุปกรณ์และชิ้นส่วนแยกครบถ้วน'],
        ['T04', 'Spare parts received', 'ได้รับอะไหล่สำรอง'],
        ['T05', 'Documents handed to customer', 'ส่งมอบเอกสารให้ลูกค้า'],
      ]) },

    { id: 'install', title: { en: 'B. Installation', th: 'B. การติดตั้ง' }, type: 'checklist',
      items: checks([
        ['I01', 'Machine positioned and levelled', 'จัดวางและปรับระดับเครื่อง'],
        ['I02', 'Anchor / foot fixing completed', 'ยึดขาเครื่องเรียบร้อย'],
        ['I03', 'Main power connected by customer', 'ลูกค้าต่อไฟหลักเรียบร้อย'],
        ['I04', 'Supply voltage verified', 'ตรวจสอบแรงดันไฟฟ้าที่จ่าย'],
        ['I05', 'Grounding verified at site', 'ตรวจสอบระบบสายดินหน้างาน'],
        ['I06', 'Compressed air connected and pressure verified', 'ต่อลมและตรวจสอบแรงดันลม'],
        ['I07', 'Network / communication connected', 'เชื่อมต่อระบบเครือข่าย / การสื่อสาร'],
        ['I08', 'Machine surroundings safe and clear', 'พื้นที่รอบเครื่องปลอดภัยและโล่ง'],
      ]) },

    { id: 'commission', title: { en: 'C. Commissioning', th: 'C. การเดินเครื่อง' }, type: 'checklist',
      items: checks([
        ['C01', 'Power-on test passed', 'ทดสอบจ่ายไฟผ่าน'],
        ['C02', 'Manual mode verified', 'ตรวจสอบโหมดแมนนวล'],
        ['C03', 'Auto mode verified', 'ตรวจสอบโหมดอัตโนมัติ'],
        ['C04', 'All sensors verified on site', 'ตรวจสอบเซนเซอร์ทั้งหมดหน้างาน'],
        ['C05', 'Emergency stop verified', 'ตรวจสอบปุ่มหยุดฉุกเฉิน'],
        ['C06', 'Safety interlocks verified', 'ตรวจสอบระบบอินเตอร์ล็อกนิรภัย'],
        ['C07', 'Alarm functions verified', 'ตรวจสอบฟังก์ชันแจ้งเตือน'],
        ['C08', 'Production trial run with customer material', 'ทดลองผลิตด้วยชิ้นงานของลูกค้า'],
        ['C09', 'Cycle time confirmed at site', 'ยืนยันรอบเวลาการทำงานหน้างาน'],
        ['C10', 'Machine parameters saved and backed up', 'บันทึกและสำรองพารามิเตอร์เครื่อง'],
      ]) },

    { id: 'sitePerf', title: { en: 'C2. On-Site Performance', th: 'C2. สมรรถนะหน้างาน' }, type: 'performance',
      items: [
        { key: 'cycleTime', label: { en: 'Cycle Time', th: 'รอบเวลาการทำงาน' }, target: '≤ 12 sec', unit: 'sec', better: 'lower' },
        { key: 'uph', label: { en: 'UPH', th: 'ผลผลิตต่อชั่วโมง' }, target: '≥ 300 pcs/hr', unit: 'pcs/hr', better: 'higher' },
        { key: 'accuracy', label: { en: 'Accuracy', th: 'ความแม่นยำ' }, target: '≥ 99 %', unit: '%', better: 'higher' },
        { key: 'rejectRate', label: { en: 'Reject Rate', th: 'อัตราของเสีย' }, target: '≤ 1 %', unit: '%', better: 'lower' },
      ] },

    { id: 'training', title: { en: 'D. Customer Training', th: 'D. การอบรมลูกค้า' }, type: 'checklist',
      items: checks([
        ['TR01', 'Machine operation training', 'อบรมการใช้งานเครื่อง'],
        ['TR02', 'Safety instruction training', 'อบรมความปลอดภัย'],
        ['TR03', 'Alarm handling and reset', 'การจัดการและรีเซ็ตการแจ้งเตือน'],
        ['TR04', 'Daily / weekly maintenance', 'การบำรุงรักษาประจำวัน / ประจำสัปดาห์'],
        ['TR05', 'Changeover / recipe setting', 'การเปลี่ยนรุ่นและตั้งค่ารีซิพี'],
        ['TR06', 'Basic troubleshooting', 'การแก้ไขปัญหาเบื้องต้น'],
      ]) },

    { id: 'trainees', title: { en: 'D2. Trained Personnel', th: 'D2. รายชื่อผู้เข้ารับการอบรม' }, type: 'table',
      columns: [
        { key: 'name', label: { en: 'Name', th: 'ชื่อ' }, width: '32%' },
        { key: 'position', label: { en: 'Position', th: 'ตำแหน่ง' }, width: '28%' },
        { key: 'date', label: { en: 'Date', th: 'วันที่' }, type: 'date', width: '20%' },
        { key: 'hours', label: { en: 'Hours', th: 'ชั่วโมง' }, type: 'number', width: '20%' },
      ] },

    { id: 'openItems', title: { en: 'E. Open Items / Punch List', th: 'E. รายการค้างที่ต้องแก้ไข' }, type: 'table',
      columns: [
        { key: 'item', label: { en: 'Item', th: 'รายการ' }, width: '40%' },
        { key: 'owner', label: { en: 'Responsible', th: 'ผู้รับผิดชอบ' }, width: '25%' },
        { key: 'due', label: { en: 'Due Date', th: 'กำหนดเสร็จ' }, type: 'date', width: '20%' },
        { key: 'status', label: { en: 'Status', th: 'สถานะ' }, width: '15%' },
      ] },

    { id: 'photos', title: { en: 'F. Installation Photos', th: 'F. รูปถ่ายการติดตั้ง' }, type: 'photos',
      items: checks([
        ['IP1', 'Machine at site', 'เครื่องที่หน้างาน'],
        ['IP2', 'Power connection', 'จุดต่อไฟฟ้า'],
        ['IP3', 'Air connection', 'จุดต่อลม'],
        ['IP4', 'Running production', 'ขณะเดินผลิต'],
        ['IP5', 'Training session', 'ระหว่างการอบรม'],
      ]), allowFree: true },

    { id: 'result', title: { en: 'G. Customer Acceptance', th: 'G. การยอมรับของลูกค้า' }, type: 'result',
      options: [
        { value: 'accepted', color: '#22c55e', label: { en: 'ACCEPTED', th: 'ยอมรับการส่งมอบ' } },
        { value: 'conditional', color: '#eab308', label: { en: 'ACCEPTED WITH OPEN ITEMS', th: 'ยอมรับ แต่มีรายการค้าง' } },
        { value: 'rejected', color: '#ef4444', label: { en: 'NOT ACCEPTED', th: 'ยังไม่ยอมรับ' } },
      ] },

    { id: 'signoff', title: { en: 'Signatures', th: 'ลายเซ็น' }, type: 'signoff',
      roles: [
        { key: 'engineer', label: { en: 'F N Engineer', th: 'วิศวกร F N' } },
        { key: 'customer', label: { en: 'Customer Representative', th: 'ตัวแทนลูกค้า' } },
      ] },
  ],
};

/* =============================================================
   FORM 04 — CUSTOMER SERVICE REPORT
   Answers: why did we go, what did we find, what did we do,
   and what is the machine condition now?
   ============================================================= */

const FORM_SERVICE = {
  type: 'SERVICE',
  code: '04',
  prefix: 'SR',
  name: { en: 'Customer Service Report', th: 'รายงานการเข้าบริการลูกค้า' },
  short: { en: 'Service', th: 'บริการ' },
  icon: '🛠️',
  accent: '#ef4444',
  sections: [
    { id: 'header', title: { en: 'A. Service Information', th: 'A. ข้อมูลการเข้าบริการ' }, type: 'fields',
      fields: [
        { key: 'workNo', label: { en: 'Work No.', th: 'เลขที่งาน' }, type: 'text', placeholder: 'X722', required: true },
        { key: 'machineName', label: { en: 'Machine', th: 'เครื่องจักร' }, type: 'text', placeholder: 'AUTO CHECKER MACHINE', required: true },
        { key: 'serialNo', label: { en: 'Machine S/N', th: 'หมายเลขเครื่อง' }, type: 'text', placeholder: 'FN-X722-001', required: true },
        { key: 'customer', label: { en: 'Customer', th: 'ลูกค้า' }, type: 'text', placeholder: 'ABC Manufacturing', required: true },
        { key: 'serviceDate', label: { en: 'Service Date', th: 'วันที่เข้าบริการ' }, type: 'date', required: true },
        { key: 'technician', label: { en: 'Technician', th: 'ช่างผู้ให้บริการ' }, type: 'text', required: true },
        { key: 'customerContact', label: { en: 'Customer Contact', th: 'ผู้ติดต่อฝ่ายลูกค้า' }, type: 'text' },
        { key: 'timeIn', label: { en: 'Time In', th: 'เวลาเข้า' }, type: 'time' },
        { key: 'timeOut', label: { en: 'Time Out', th: 'เวลาออก' }, type: 'time' },
        { key: 'serviceType', label: { en: 'Service Type', th: 'ประเภทการบริการ' }, type: 'select', required: true,
          options: [
            { value: 'breakdown', label: { en: 'Breakdown', th: 'เครื่องเสีย' } },
            { value: 'pm', label: { en: 'PM (Preventive Maintenance)', th: 'บำรุงรักษาเชิงป้องกัน' } },
            { value: 'installation', label: { en: 'Installation', th: 'ติดตั้ง' } },
            { value: 'training', label: { en: 'Training', th: 'อบรม' } },
            { value: 'modification', label: { en: 'Modification', th: 'ปรับปรุง / ดัดแปลง' } },
          ] },
        { key: 'warranty', label: { en: 'Warranty', th: 'การรับประกัน' }, type: 'select',
          options: [
            { value: 'in', label: { en: 'In warranty', th: 'อยู่ในประกัน' } },
            { value: 'out', label: { en: 'Out of warranty', th: 'หมดประกัน' } },
            { value: 'contract', label: { en: 'Service contract', th: 'สัญญาบริการ' } },
          ] },
      ] },

    { id: 'problem', title: { en: 'B. Customer Problem / Request', th: 'B. ปัญหา / คำร้องขอจากลูกค้า' }, type: 'problem',
      placeholder: { en: 'e.g. Machine stops during Auto Cycle. HMI displays "Sensor S12 Error".',
                     th: 'เช่น เครื่องหยุดระหว่างเดินอัตโนมัติ หน้าจอ HMI แสดง "Sensor S12 Error"' },
      priorities: [
        { value: 'critical', color: '#ef4444', label: { en: 'Critical', th: 'วิกฤต' } },
        { value: 'high', color: '#f97316', label: { en: 'High', th: 'สูง' } },
        { value: 'normal', color: '#eab308', label: { en: 'Normal', th: 'ปกติ' } },
        { value: 'low', color: '#22c55e', label: { en: 'Low', th: 'ต่ำ' } },
      ] },

    { id: 'initial', title: { en: 'C. Initial Machine Condition', th: 'C. สภาพเครื่องเมื่อแรกถึง' }, type: 'condition',
      items: checks([
        ['C01', 'Machine Power', 'ระบบไฟเลี้ยงเครื่อง'],
        ['C02', 'PLC', 'PLC'],
        ['C03', 'HMI', 'HMI'],
        ['C04', 'Pneumatic', 'ระบบลม'],
        ['C05', 'Motor', 'มอเตอร์'],
        ['C06', 'Sensor', 'เซนเซอร์'],
        ['C07', 'Safety', 'ระบบความปลอดภัย'],
        ['C08', 'Communication', 'ระบบสื่อสาร'],
      ]) },

    { id: 'trouble', title: { en: 'D. Troubleshooting Log', th: 'D. บันทึกการตรวจหาสาเหตุ' },
      hint: { en: 'Time-stamped findings and actions. This becomes the real service history.',
              th: 'บันทึกเวลา สิ่งที่พบ และสิ่งที่ทำ เพื่อเก็บเป็นประวัติการบริการจริง' },
      type: 'table',
      columns: [
        { key: 'time', label: { en: 'Time', th: 'เวลา' }, type: 'time', width: '15%' },
        { key: 'finding', label: { en: 'Finding', th: 'สิ่งที่พบ' }, width: '42%' },
        { key: 'action', label: { en: 'Action', th: 'สิ่งที่ดำเนินการ' }, width: '43%' },
      ] },

    { id: 'rootcause', title: { en: 'E. Root Cause', th: 'E. สาเหตุที่แท้จริง' }, type: 'rootcause',
      categories: checks([
        ['RC01', 'Mechanical', 'เครื่องกล'],
        ['RC02', 'Electrical', 'ไฟฟ้า'],
        ['RC03', 'PLC Program', 'โปรแกรม PLC'],
        ['RC04', 'Sensor', 'เซนเซอร์'],
        ['RC05', 'Pneumatic', 'ระบบลม'],
        ['RC06', 'Servo / Motor', 'เซอร์โว / มอเตอร์'],
        ['RC07', 'HMI', 'HMI'],
        ['RC08', 'Communication', 'ระบบสื่อสาร'],
        ['RC09', 'Customer Operation', 'การใช้งานของลูกค้า'],
        ['RC10', 'Wear & Tear', 'การสึกหรอตามอายุการใช้งาน'],
        ['RC11', 'Other', 'อื่น ๆ'],
      ]),
      placeholder: { en: 'e.g. Sensor S12 mounting position shifted approximately 3 mm, causing intermittent detection.',
                     th: 'เช่น ตำแหน่งยึดเซนเซอร์ S12 เคลื่อนประมาณ 3 มม. ทำให้ตรวจจับไม่สม่ำเสมอ' } },

    { id: 'action', title: { en: 'F. Corrective Action', th: 'F. การแก้ไข' }, type: 'notes',
      placeholder: { en: 'e.g. Adjusted S12 sensor position and tightened mounting bracket.',
                     th: 'เช่น ปรับตำแหน่งเซนเซอร์ S12 และขันขายึดให้แน่น' } },

    { id: 'parts', title: { en: 'F2. Parts Replaced', th: 'F2. อะไหล่ที่เปลี่ยน' }, type: 'table',
      columns: [
        { key: 'partNo', label: { en: 'Part No.', th: 'รหัสอะไหล่' }, width: '20%' },
        { key: 'description', label: { en: 'Description', th: 'รายละเอียด' }, width: '36%' },
        { key: 'qty', label: { en: 'Qty', th: 'จำนวน' }, type: 'number', width: '12%' },
        { key: 'oldCondition', label: { en: 'Old Condition', th: 'สภาพของเดิม' }, width: '32%' },
      ] },

    { id: 'test', title: { en: 'G. Machine Test After Service', th: 'G. ทดสอบเครื่องหลังการบริการ' }, type: 'checklist',
      items: checks([
        ['G01', 'Manual Mode', 'โหมดแมนนวล'],
        ['G02', 'Auto Mode', 'โหมดอัตโนมัติ'],
        ['G03', 'Emergency Stop', 'ปุ่มหยุดฉุกเฉิน'],
        ['G04', 'Sensor Detection', 'การตรวจจับของเซนเซอร์'],
        ['G05', 'Cycle Test', 'ทดสอบรอบการทำงาน'],
        ['G06', 'Production Test', 'ทดสอบการผลิต'],
      ]) },

    { id: 'testResult', title: { en: 'G2. Test Result', th: 'G2. ผลการทดสอบ' }, type: 'fields',
      fields: [
        { key: 'testQty', label: { en: 'Test Quantity', th: 'จำนวนที่ทดสอบ' }, type: 'number', placeholder: '50', unit: 'cycles' },
        { key: 'testNG', label: { en: 'NG', th: 'ของเสีย' }, type: 'number', placeholder: '0', unit: 'pcs' },
        { key: 'testCycleAvg', label: { en: 'Average Cycle Time', th: 'รอบเวลาเฉลี่ย' }, type: 'number', placeholder: '11.5', unit: 'sec' },
      ] },

    { id: 'beforeAfter', title: { en: 'H. Before / After Photos', th: 'H. รูปถ่ายก่อน / หลัง' }, type: 'beforeafter' },

    { id: 'cost', title: { en: 'I. Parts & Cost', th: 'I. ค่าอะไหล่และค่าบริการ' },
      hint: { en: 'Optional — leave blank for warranty service.', th: 'ไม่บังคับ — งานในประกันสามารถเว้นว่างได้' },
      type: 'costtable',
      columns: [
        { key: 'item', label: { en: 'Item', th: 'รายการ' }, width: '40%' },
        { key: 'qty', label: { en: 'Qty', th: 'จำนวน' }, type: 'number', width: '15%' },
        { key: 'unitPrice', label: { en: 'Unit Price', th: 'ราคาต่อหน่วย' }, type: 'number', width: '20%' },
      ] },

    { id: 'result', title: { en: 'J. Machine Status After Service', th: 'J. สถานะเครื่องหลังการบริการ' }, type: 'result',
      options: [
        { value: 'normal', color: '#22c55e', label: { en: 'MACHINE OPERATING NORMALLY', th: 'เครื่องทำงานปกติ' } },
        { value: 'recommend', color: '#eab308', label: { en: 'OPERATING WITH RECOMMENDATION', th: 'ใช้งานได้ แต่มีข้อแนะนำ' } },
        { value: 'further', color: '#ef4444', label: { en: 'FURTHER SERVICE REQUIRED', th: 'ต้องเข้าบริการเพิ่มเติม' } },
      ] },

    { id: 'recommend', title: { en: 'J2. Recommendation to Customer', th: 'J2. ข้อแนะนำถึงลูกค้า' }, type: 'notes',
      placeholder: { en: 'e.g. Recommend replacing S12 mounting bracket at next PM.',
                     th: 'เช่น แนะนำให้เปลี่ยนขายึดเซนเซอร์ S12 ในการ PM ครั้งถัดไป' } },

    { id: 'customerComment', title: { en: 'J3. Customer Comment', th: 'J3. ความเห็นของลูกค้า' }, type: 'notes',
      placeholder: { en: 'e.g. Machine tested and accepted. No abnormal operation found.',
                     th: 'เช่น ทดสอบเครื่องแล้วยอมรับ ไม่พบการทำงานผิดปกติ' } },

    { id: 'signoff', title: { en: 'Signatures', th: 'ลายเซ็น' }, type: 'signoff',
      roles: [
        { key: 'technician', label: { en: 'Technician', th: 'ช่างผู้ให้บริการ' } },
        { key: 'customer', label: { en: 'Customer', th: 'ลูกค้า' } },
      ] },
  ],
};

/* ---------- Registry ---------- */

const FORM_TYPES = [FORM_BUILD, FORM_PDI, FORM_DELIVERY, FORM_SERVICE];

const FORM_BY_TYPE = FORM_TYPES.reduce((acc, f) => {
  acc[f.type] = f;
  return acc;
}, {});

/* ---------- UI strings ---------- */

const UI = {
  appName: { en: 'FN Machine Care', th: 'FN Machine Care' },
  tagline: { en: 'Machine Inspection & Service Management System', th: 'ระบบตรวจสอบและบริหารงานบริการเครื่องจักร' },
  company: { en: 'F N Technology', th: 'F N Technology' },

  nav_dashboard: { en: 'Dashboard', th: 'ภาพรวม' },
  nav_machines: { en: 'Machines', th: 'เครื่องจักร' },
  nav_records: { en: 'Records', th: 'เอกสารทั้งหมด' },
  nav_new: { en: 'New Form', th: 'สร้างเอกสาร' },
  nav_data: { en: 'Backup', th: 'สำรองข้อมูล' },

  pass: { en: 'PASS', th: 'ผ่าน' },
  fail: { en: 'FAIL', th: 'ไม่ผ่าน' },
  na: { en: 'N/A', th: 'ไม่เกี่ยวข้อง' },
  normal: { en: 'Normal', th: 'ปกติ' },
  abnormal: { en: 'Abnormal', th: 'ผิดปกติ' },
  remark: { en: 'Remark', th: 'หมายเหตุ' },
  target: { en: 'Target', th: 'ค่าเป้าหมาย' },
  actual: { en: 'Actual', th: 'ค่าที่วัดได้' },
  result: { en: 'Result', th: 'ผล' },
  addRow: { en: '+ Add row', th: '+ เพิ่มแถว' },
  addPhoto: { en: '+ Add photo', th: '+ เพิ่มรูป' },
  remove: { en: 'Remove', th: 'ลบ' },
  save: { en: 'Save', th: 'บันทึก' },
  saved: { en: 'Saved', th: 'บันทึกแล้ว' },
  print: { en: 'Print / PDF', th: 'พิมพ์ / PDF' },
  delete: { en: 'Delete', th: 'ลบ' },
  open: { en: 'Open', th: 'เปิด' },
  close: { en: 'Close', th: 'ปิด' },
  clear: { en: 'Clear', th: 'ล้าง' },
  signature: { en: 'Signature', th: 'ลายเซ็น' },
  name: { en: 'Name', th: 'ชื่อ' },
  date: { en: 'Date', th: 'วันที่' },
  before: { en: 'BEFORE', th: 'ก่อน' },
  after: { en: 'AFTER', th: 'หลัง' },
  total: { en: 'TOTAL', th: 'รวมทั้งสิ้น' },
  progress: { en: 'Progress', th: 'ความคืบหน้า' },
  draft: { en: 'Draft', th: 'ฉบับร่าง' },
  completed: { en: 'Completed', th: 'เสร็จสมบูรณ์' },
  history: { en: 'Machine History', th: 'ประวัติเครื่องจักร' },
  noRecords: { en: 'No records yet.', th: 'ยังไม่มีเอกสาร' },
  search: { en: 'Search work no, serial, customer…', th: 'ค้นหาเลขที่งาน หมายเลขเครื่อง ลูกค้า…' },
  safetyBlock: {
    en: 'A safety item has FAILED. This PDI cannot be approved as READY FOR DELIVERY.',
    th: 'มีรายการความปลอดภัยไม่ผ่าน จึงไม่สามารถอนุมัติ PDI เป็น “พร้อมส่งมอบ” ได้',
  },
  confirmDelete: { en: 'Delete this record permanently?', th: 'ต้องการลบเอกสารนี้ถาวรหรือไม่?' },
};
