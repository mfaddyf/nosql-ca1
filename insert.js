// =====================================================================
// NoSQL Databases Project - Pharmacy Management System
//
//  comments and layout inserted! planning what insert statements to use, add in any ref links to bottom if used? - mon26oct
//
// =====================================================================

use("pharmacy")
db.dropDatabase() // drop first so the script can be re-run from a clean start

use("pharmacy")

db.createCollection("patients")
db.createCollection("medicines")
db.createCollection("prescribers")
db.createCollection("pharmacists")
db.createCollection("prescriptions")

// ---------------------------------------------------------------------
// ObjectId scheme (24 hex characters), so references line up:
//   patients      6716a1 0000000000000000 NN
//   medicines     6716a2 0000000000000000 NN
//   prescriptions 6716a3 0000000000000000 NN
//   prescribers   6716a4 0000000000000000 NN
//   pharmacists   6716a5 0000000000000000 NN
// ---------------------------------------------------------------------


// =====================================================================
// PRESCRIBERS
// =====================================================================
db.prescribers.insertMany([
  {
    _id: ObjectId("6716a4000000000000000001"),
    name: "",
    imc_num: "",
    practice_name: "",
    practice_address: "",
    contact: ""
  }
  // , { ...next prescriber... }
])


// =====================================================================
// PHARMACISTS
// =====================================================================
db.pharmacists.insertOne(
  {
    _id: ObjectId("6716a5000000000000000001"),
    first_name: "",
    last_name: "",
    psi_num: "",
    role: ""          // Pharmacist | Supervising Pharmacist | Superintendent Pharmacist
  }
)

db.pharmacists.insertMany([
  {
    _id: ObjectId("6716a5000000000000000002"),
    first_name: "",
    last_name: "",
    psi_num: "",
    role: ""
  }
  // , { ...next pharmacist... }
])


// =====================================================================
// MEDICINES  (embedded batches array; stock_qty = sum of batch quantities)
// =====================================================================
db.medicines.insertMany([
  {
    _id: ObjectId("6716a2000000000000000001"),
    name: "",
    generic_name: "",
    strength: "",
    form: "",                 // Tablet | Capsule | Inhaler | Oral Suspension | Cream ...
    med_type: ["", ""],
    script_only: true,
    price: 0.00,
    stock_qty: NumberInt(0),
    reorder_level: NumberInt(0),
    batches: [
      { batch_num: "", expiry_date: new Date("YYYY-MM-DD"), quantity: NumberInt(0) }
      // , { ...next batch... }
    ]
  }
  // , { ...next medicine... }
])


// =====================================================================
// PATIENTS  (embedded address array + scheme_details subdocument)
// =====================================================================
db.patients.insertOne(
  {
    _id: ObjectId("6716a1000000000000000001"),
    first_name: "",
    last_name: "",
    dob: new Date("YYYY-MM-DD"),
    gender: "",
    phone_num: "",
    allergies: [],              // e.g. ["", ""] - leave empty if none
    address: [
      { line_1: "", line_2: "", county: "", eircode: "" }
      // , { ...second address... }
    ],
    scheme_details: {
      ppsn: "",
      scheme_type: "",          // Medical Card | GP Visit Card | Drugs Payment Scheme | Long-Term Illness | None
      scheme_num: "",
      expiry_date: new Date("YYYY-MM-DD")
    }
  }
)

db.patients.insertMany([
  {
    _id: ObjectId("6716a1000000000000000002"),
    first_name: "",
    last_name: "",
    dob: new Date("YYYY-MM-DD"),
    gender: "",
    phone_num: "",
    allergies: [],
    address: [
      { line_1: "", line_2: "", county: "", eircode: "" }
    ],
    scheme_details: {
      ppsn: "",
      scheme_type: "",
      scheme_num: "",
      expiry_date: new Date("YYYY-MM-DD")
    }
  }
  // , { ...next patient... }
])


// =====================================================================
// PRESCRIPTIONS  (references patient, prescriber, pharmacist, medicine;
//                 embedded items array)
// =====================================================================
db.prescriptions.insertMany([
  {
    _id: ObjectId("6716a3000000000000000001"),
    patient_id: ObjectId("6716a1000000000000000001"),
    prescriber_id: ObjectId("6716a4000000000000000001"),
    pharmacist_id: ObjectId("6716a5000000000000000001"),  // null if not yet dispensed
    issue_date: new Date("YYYY-MM-DD"),
    dispense_date: new Date("YYYY-MM-DD"),               // null if not yet dispensed
    status: "",                                           // Pending | Dispensed | Cancelled
    num_repeats: NumberInt(0),
    items: [
      {
        medicine_id: ObjectId("6716a2000000000000000001"),
        name: "",
        quantity: NumberInt(0),
        dosage: "",
        instructions: "",
        price_charged: 0.00
      }
      // , { ...next item... }
    ]
  }
  // , { ...next prescription... }
])