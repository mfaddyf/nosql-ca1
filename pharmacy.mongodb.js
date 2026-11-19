// =====================================================================
// NoSQL Databases Project - Pharmacy Management System
// =====================================================================


// #####################################################################
// PART 1 - CREATE THE DATABASE AND COLLECTIONS, AND POPULATE THEM
// #####################################################################

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
    name: "Dr Ciarán Walsh",
    imc_num: "412345",
    practice_name: "Riverside Family Practice",
    practice_address: "The Quay, Waterford, X91 R2T4",
    contact: "051-876543"
  },
  {
    _id: ObjectId("6716a4000000000000000002"),
    name: "Dr Sinéad Moran",
    imc_num: "398761",
    practice_name: "Riverside Family Practice",
    practice_address: "The Quay, Waterford, X91 R2T4",
    contact: "051-876543"
  },
  {
    _id: ObjectId("6716a4000000000000000003"),
    name: "Dr Brian Hennessy",
    imc_num: "425190",
    practice_name: "Nore Valley Medical Centre",
    practice_address: "Parliament Street, Kilkenny, R95 H3X2",
    contact: "056-7712345"
  },
  {
    _id: ObjectId("6716a4000000000000000004"),
    name: "Dr Orla Nolan",
    imc_num: "407733",
    practice_name: "Slaney Medical Clinic",
    practice_address: "Main Street, Enniscorthy, Wexford, Y21 K8N2",
    contact: "053-9234567"
  }
])


// =====================================================================
// PHARMACISTS
// =====================================================================
db.pharmacists.insertOne(
  {
    _id: ObjectId("6716a5000000000000000001"),
    first_name: "Niamh",
    last_name: "Byrne",
    psi_num: "18432",
    role: "Supervising Pharmacist"
  }
)

db.pharmacists.insertMany([
  {
    _id: ObjectId("6716a5000000000000000002"),
    first_name: "Conor",
    last_name: "Healy",
    psi_num: "21877",
    role: "Pharmacist"
  },
  {
    _id: ObjectId("6716a5000000000000000003"),
    first_name: "Rachel",
    last_name: "Daly",
    psi_num: "15209",
    role: "Superintendent Pharmacist"
  }
])


// =====================================================================
// MEDICINES  (embedded batches array; stock_qty = sum of batch quantities)
// =====================================================================
db.medicines.insertMany([
  {
    _id: ObjectId("6716a2000000000000000001"),
    name: "Panadol",
    generic_name: "Paracetamol",
    strength: "500mg",
    form: "Tablet",
    med_type: ["Analgesic", "Antipyretic"],
    script_only: false,
    price: 3.49,
    stock_qty: NumberInt(200),
    reorder_level: NumberInt(50),
    batches: [
      { batch_num: "PAN2501A", expiry_date: new Date("2028-01-31"), quantity: NumberInt(120) },
      { batch_num: "PAN2403K", expiry_date: new Date("2027-03-31"), quantity: NumberInt(80) }
    ]
  },
  {
    _id: ObjectId("6716a2000000000000000002"),
    name: "Nurofen",
    generic_name: "Ibuprofen",
    strength: "200mg",
    form: "Tablet",
    med_type: ["Analgesic", "Anti-inflammatory"],
    script_only: false,
    price: 4.99,
    stock_qty: NumberInt(30),
    reorder_level: NumberInt(40),
    batches: [
      { batch_num: "NUR2312C", expiry_date: new Date("2026-12-31"), quantity: NumberInt(30) }
    ]
  },
  {
    _id: ObjectId("6716a2000000000000000003"),
    name: "Amoxil",
    generic_name: "Amoxicillin",
    strength: "500mg",
    form: "Capsule",
    med_type: ["Antibiotic", "Anti-infective"],
    script_only: true,
    price: 8.95,
    stock_qty: NumberInt(120),
    reorder_level: NumberInt(50),
    batches: [
      { batch_num: "AMX2407B", expiry_date: new Date("2027-07-31"), quantity: NumberInt(60) },
      { batch_num: "AMX2411C", expiry_date: new Date("2027-11-30"), quantity: NumberInt(60) }
    ]
  },
  {
    _id: ObjectId("6716a2000000000000000004"),
    name: "Lipitor",
    generic_name: "Atorvastatin",
    strength: "20mg",
    form: "Tablet",
    med_type: ["Cardiovascular", "Statin"],
    script_only: true,
    price: 14.50,
    stock_qty: NumberInt(90),
    reorder_level: NumberInt(60),
    batches: [
      { batch_num: "LIP2501A", expiry_date: new Date("2028-02-28"), quantity: NumberInt(90) }
    ]
  },
  {
    _id: ObjectId("6716a2000000000000000005"),
    name: "Ventolin Evohaler",
    generic_name: "Salbutamol",
    strength: "100mcg",
    form: "Inhaler",
    med_type: ["Respiratory", "Bronchodilator"],
    script_only: true,
    price: 6.20,
    stock_qty: NumberInt(15),
    reorder_level: NumberInt(20),
    batches: [
      { batch_num: "VEN2410D", expiry_date: new Date("2026-11-30"), quantity: NumberInt(15) }
    ]
  },
  {
    _id: ObjectId("6716a2000000000000000006"),
    name: "Glucophage",
    generic_name: "Metformin",
    strength: "500mg",
    form: "Tablet",
    med_type: ["Diabetes", "Antidiabetic"],
    script_only: true,
    price: 7.80,
    stock_qty: NumberInt(160),
    reorder_level: NumberInt(80),
    batches: [
      { batch_num: "GLU2502A", expiry_date: new Date("2028-04-30"), quantity: NumberInt(100) },
      { batch_num: "GLU2409F", expiry_date: new Date("2026-12-15"), quantity: NumberInt(60) }
    ]
  },
  {
    _id: ObjectId("6716a2000000000000000007"),
    name: "Zirtek",
    generic_name: "Cetirizine",
    strength: "10mg",
    form: "Tablet",
    med_type: ["Antihistamine", "Allergy"],
    script_only: false,
    price: 6.99,
    stock_qty: NumberInt(45),
    reorder_level: NumberInt(25),
    batches: [
      { batch_num: "ZIR2503B", expiry_date: new Date("2027-09-30"), quantity: NumberInt(45) }
    ]
  },
  {
    _id: ObjectId("6716a2000000000000000008"),
    name: "Losec",
    generic_name: "Omeprazole",
    strength: "20mg",
    form: "Capsule",
    med_type: ["Gastrointestinal", "Proton Pump Inhibitor"],
    script_only: true,
    price: 11.25,
    stock_qty: NumberInt(70),
    reorder_level: NumberInt(40),
    batches: [
      { batch_num: "LOS2412E", expiry_date: new Date("2027-06-30"), quantity: NumberInt(40) },
      { batch_num: "LOS2504A", expiry_date: new Date("2028-01-31"), quantity: NumberInt(30) }
    ]
  },
  {
    _id: ObjectId("6716a2000000000000000009"),
    name: "Lexapro",
    generic_name: "Escitalopram",
    strength: "10mg",
    form: "Tablet",
    med_type: ["Antidepressant", "SSRI"],
    script_only: true,
    price: 13.40,
    stock_qty: NumberInt(0),       // out of stock - no batches on the shelf
    reorder_level: NumberInt(30),
    batches: []
  },
  {
    _id: ObjectId("6716a2000000000000000010"),
    name: "Difflam",
    generic_name: "Benzydamine",
    strength: "0.15%",
    form: "Oral Rinse",
    med_type: ["Throat", "Anti-inflammatory"],
    script_only: false,
    price: 9.49,
    stock_qty: NumberInt(12),
    reorder_level: NumberInt(10),
    batches: [
      { batch_num: "DIF2405C", expiry_date: new Date("2027-01-31"), quantity: NumberInt(12) }
    ]
  }
])


// =====================================================================
// PATIENTS  (embedded address array + scheme_details subdocument)
// =====================================================================
db.patients.insertOne(
  {
    _id: ObjectId("6716a1000000000000000001"),
    first_name: "Aoife",
    last_name: "Murphy",
    dob: new Date("1984-03-12"),
    gender: "Female",
    phone_num: "087-1234567",
    allergies: ["Aspirin", "Latex"],
    address: [
      { line_1: "14 Ard na Gréine", line_2: "Ballytruckle", county: "Waterford", eircode: "X91 K2P7" },
      { line_1: "Unit 4", line_2: "Riverside Business Park", county: "Waterford", eircode: "X91 W3D8" }
    ],
    scheme_details: {
      ppsn: "1234567TA",
      scheme_type: "Medical Card",
      scheme_num: "MC2049381",
      expiry_date: new Date("2027-05-31")
    }
  }
)
db.patients.insertMany([
  {
    _id: ObjectId("6716a1000000000000000002"),
    first_name: "Seán",
    last_name: "O'Brien",
    dob: new Date("1957-08-22"),
    gender: "Male",
    phone_num: "086-2345678",
    allergies: [],
    address: [
      { line_1: "3 Church Street", line_2: "Mooncoin", county: "Kilkenny", eircode: "R95 F6C1" }
    ],
    scheme_details: {
      ppsn: "2345678FA",
      scheme_type: "Drugs Payment Scheme",
      scheme_num: "DPS5512034",
      expiry_date: new Date("2027-12-31")
    }
  },
  {
    _id: ObjectId("6716a1000000000000000003"),
    first_name: "Ciara",
    last_name: "Kelly",
    dob: new Date("1999-11-03"),
    gender: "Female",
    phone_num: "085-3456789",
    allergies: ["Penicillin"],
    address: [
      { line_1: "27 Manor Street", county: "Waterford", eircode: "X91 T5H9" } // no line_2
    ],
    scheme_details: {
      ppsn: "3456789KA",
      scheme_type: "None"            // no scheme, so no scheme_num or expiry_date
    }
  },
  {
    _id: ObjectId("6716a1000000000000000004"),
    first_name: "Patrick",
    last_name: "Doyle",
    dob: new Date("1948-02-17"),
    gender: "Male",
    phone_num: "087-4567890",
    allergies: ["Penicillin", "Codeine"],
    address: [
      { line_1: "8 Weafer Street", county: "Wexford", eircode: "Y21 P4W6" },
      { line_1: "Ashgrove Nursing Home", line_2: "Gorey Road", county: "Wexford", eircode: "Y25 D7R3" }
    ],
    scheme_details: {
      ppsn: "4567890PB",
      scheme_type: "Long-Term Illness",
      scheme_num: "LTI7781203",
      expiry_date: new Date("2028-06-30")
    }
  },
  {
    _id: ObjectId("6716a1000000000000000005"),
    first_name: "Emma",
    last_name: "Kavanagh",
    dob: new Date("2003-06-28"),
    gender: "Female",
    phone_num: "083-5678901",
    allergies: [],
    address: [
      { line_1: "Apartment 12", line_2: "Lancaster Quay", county: "Cork", eircode: "T12 X8K4" }
    ],
    scheme_details: {
      ppsn: "5678901EA",
      scheme_type: "GP Visit Card",
      scheme_num: "GPV3318720",
      expiry_date: new Date("2026-12-31")
    }
  },
  {
    _id: ObjectId("6716a1000000000000000006"),
    first_name: "Michael",
    last_name: "Power",
    dob: new Date("1972-09-09"),
    gender: "Male",
    phone_num: "087-6789012",
    allergies: ["Sulfonamides"],
    address: [
      { line_1: "5 Strand Road", line_2: "Tramore", county: "Waterford", eircode: "X91 Y2N5" }
    ],
    scheme_details: {
      ppsn: "6789012MA",
      scheme_type: "Drugs Payment Scheme",
      scheme_num: "DPS6620981",
      expiry_date: new Date("2025-12-31")   // expired
    }
  },
  {
    _id: ObjectId("6716a1000000000000000007"),
    first_name: "Siobhán",
    last_name: "Ryan",
    dob: new Date("1990-01-15"),
    gender: "Female",
    phone_num: "086-7890123",
    allergies: ["Peanuts", "Penicillin"],
    address: [
      { line_1: "41 Irishtown", county: "Tipperary", eircode: "E91 A6V2" },
      { line_1: "Clonmel Garden Centre", line_2: "Cahir Road", county: "Tipperary", eircode: "E91 X3P8" }
    ],
    scheme_details: {
      ppsn: "7890123RA",
      scheme_type: "Medical Card",
      scheme_num: "MC1187234",
      expiry_date: new Date("2027-02-28")
    }
  },
  {
    _id: ObjectId("6716a1000000000000000008"),
    first_name: "Darragh",
    last_name: "Fitzgerald",
    dob: new Date("2012-04-05"),
    gender: "Male",
    phone_num: "087-8901234",
    allergies: [],
    address: [
      { line_1: "19 Grange Park", line_2: "Grange", county: "Waterford", eircode: "X91 C4F2" }
    ],
    scheme_details: {
      ppsn: "8901234DA",
      scheme_type: "GP Visit Card",
      scheme_num: "GPV9921456",
      expiry_date: new Date("2028-04-30")
    }
  }
])

// =====================================================================
// PRESCRIPTIONS  (references patient, prescriber, pharmacist, medicine;
//                 embedded items array)
// =====================================================================
db.prescriptions.insertMany([
  {
    _id: ObjectId("6716a3000000000000000001"),
    patient_id: ObjectId("6716a1000000000000000001"),     // Aoife Murphy
    prescriber_id: ObjectId("6716a4000000000000000001"),  // Dr Ciarán Walsh
    pharmacist_id: ObjectId("6716a5000000000000000001"),  // Niamh Byrne
    issue_date: new Date("2026-10-14"),
    dispense_date: new Date("2026-10-15"),
    status: "Dispensed",
    num_repeats: NumberInt(0),
    items: [
      {
        medicine_id: ObjectId("6716a2000000000000000003"),
        name: "Amoxicillin 500mg Capsules",
        quantity: NumberInt(21),
        dosage: "500mg",
        instructions: "Take one capsule three times daily for 7 days",
        price_charged: 8.95
      },
      {
        medicine_id: ObjectId("6716a2000000000000000007"),
        name: "Cetirizine 10mg Tablets",
        quantity: NumberInt(30),
        dosage: "10mg",
        instructions: "Take one tablet once daily",
        price_charged: 6.99
      }
    ]
  },
  {
    _id: ObjectId("6716a3000000000000000002"),
    patient_id: ObjectId("6716a1000000000000000002"),     // Seán O'Brien
    prescriber_id: ObjectId("6716a4000000000000000003"),  // Dr Brian Hennessy
    pharmacist_id: ObjectId("6716a5000000000000000002"),  // Conor Healy
    issue_date: new Date("2026-09-02"),
    dispense_date: new Date("2026-09-03"),
    status: "Dispensed",
    num_repeats: NumberInt(5),
    items: [
      {
        medicine_id: ObjectId("6716a2000000000000000004"),
        name: "Atorvastatin 20mg Tablets",
        quantity: NumberInt(28),
        dosage: "20mg",
        instructions: "Take one tablet at night",
        price_charged: 13.95                              // charged before the price rise to 14.50
      },
      {
        medicine_id: ObjectId("6716a2000000000000000006"),
        name: "Metformin 500mg Tablets",
        quantity: NumberInt(56),
        dosage: "500mg",
        instructions: "Take one tablet twice daily with meals",
        price_charged: 7.80
      }
    ]
  },
  {
    _id: ObjectId("6716a3000000000000000003"),
    patient_id: ObjectId("6716a1000000000000000004"),     // Patrick Doyle
    prescriber_id: ObjectId("6716a4000000000000000004"),  // Dr Orla Nolan
    pharmacist_id: ObjectId("6716a5000000000000000003"),  // Rachel Daly
    issue_date: new Date("2026-10-01"),
    dispense_date: new Date("2026-10-02"),
    status: "Dispensed",
    num_repeats: NumberInt(3),
    items: [
      {
        medicine_id: ObjectId("6716a2000000000000000008"),
        name: "Omeprazole 20mg Capsules",
        quantity: NumberInt(28),
        dosage: "20mg",
        instructions: "Take one capsule each morning before food",
        price_charged: 11.25
      },
      {
        medicine_id: ObjectId("6716a2000000000000000004"),
        name: "Atorvastatin 20mg Tablets",
        quantity: NumberInt(28),
        dosage: "20mg",
        instructions: "Take one tablet at night",
        price_charged: 14.50
      },
      {
        medicine_id: ObjectId("6716a2000000000000000005"),
        name: "Salbutamol 100mcg Inhaler",
        quantity: NumberInt(1),
        dosage: "100mcg per puff",
        instructions: "Inhale two puffs when required",
        price_charged: 6.20
      }
    ]
  },
  {
    _id: ObjectId("6716a3000000000000000004"),
    patient_id: ObjectId("6716a1000000000000000007"),     // Siobhán Ryan
    prescriber_id: ObjectId("6716a4000000000000000001"),  // Dr Ciarán Walsh
    pharmacist_id: ObjectId("6716a5000000000000000001"),  // Niamh Byrne
    issue_date: new Date("2026-10-10"),
    dispense_date: new Date("2026-10-10"),
    status: "Dispensed",
    num_repeats: NumberInt(1),
    items: [
      {
        medicine_id: ObjectId("6716a2000000000000000005"),
        name: "Salbutamol 100mcg Inhaler",
        quantity: NumberInt(1),
        dosage: "100mcg per puff",
        instructions: "Inhale two puffs when required",
        price_charged: 6.20
      },
      {
        medicine_id: ObjectId("6716a2000000000000000007"),
        name: "Cetirizine 10mg Tablets",
        quantity: NumberInt(30),
        dosage: "10mg",
        instructions: "Take one tablet once daily",
        price_charged: 6.99
      }
    ]
  },
  {
    _id: ObjectId("6716a3000000000000000005"),
    patient_id: ObjectId("6716a1000000000000000006"),     // Michael Power
    prescriber_id: ObjectId("6716a4000000000000000002"),  // Dr Sinéad Moran
    pharmacist_id: ObjectId("6716a5000000000000000002"),  // Conor Healy
    issue_date: new Date("2026-08-20"),
    dispense_date: new Date("2026-08-21"),
    status: "Dispensed",
    num_repeats: NumberInt(0),
    items: [
      {
        medicine_id: ObjectId("6716a2000000000000000008"),
        name: "Omeprazole 20mg Capsules",
        quantity: NumberInt(28),
        dosage: "20mg",
        instructions: "Take one capsule each morning before food",
        price_charged: 11.25
      }
    ]
  },
  {
    _id: ObjectId("6716a3000000000000000006"),
    patient_id: ObjectId("6716a1000000000000000003"),     // Ciara Kelly
    prescriber_id: ObjectId("6716a4000000000000000002"),  // Dr Sinéad Moran
    pharmacist_id: null,
    issue_date: new Date("2026-10-19"),
    dispense_date: null,
    status: "Pending",                                    // waiting on Lexapro stock
    num_repeats: NumberInt(5),
    items: [
      {
        medicine_id: ObjectId("6716a2000000000000000009"),
        name: "Escitalopram 10mg Tablets",
        quantity: NumberInt(28),
        dosage: "10mg",
        instructions: "Take one tablet each morning"
      }
    ]
  },
  {
    _id: ObjectId("6716a3000000000000000007"),
    patient_id: ObjectId("6716a1000000000000000005"),     // Emma Kavanagh
    prescriber_id: ObjectId("6716a4000000000000000001"),  // Dr Ciarán Walsh
    pharmacist_id: ObjectId("6716a5000000000000000001"),  // Niamh Byrne
    issue_date: new Date("2026-07-15"),
    dispense_date: new Date("2026-07-16"),
    status: "Dispensed",
    num_repeats: NumberInt(0),
    items: [
      {
        medicine_id: ObjectId("6716a2000000000000000003"),
        name: "Amoxicillin 500mg Capsules",
        quantity: NumberInt(21),
        dosage: "500mg",
        instructions: "Take one capsule three times daily for 7 days",
        price_charged: 8.95
      },
      {
        medicine_id: ObjectId("6716a2000000000000000010"),
        name: "Benzydamine 0.15% Oral Rinse",
        quantity: NumberInt(1),
        dosage: "15ml",
        instructions: "Rinse or gargle 15ml every 3 hours as required",
        price_charged: 9.49
      }
    ]
  },
  {
    _id: ObjectId("6716a3000000000000000008"),
    patient_id: ObjectId("6716a1000000000000000008"),     // Darragh Fitzgerald
    prescriber_id: ObjectId("6716a4000000000000000001"),  // Dr Ciarán Walsh
    pharmacist_id: ObjectId("6716a5000000000000000003"),  // Rachel Daly
    issue_date: new Date("2026-10-05"),
    dispense_date: new Date("2026-10-05"),
    status: "Dispensed",
    num_repeats: NumberInt(2),
    items: [
      {
        medicine_id: ObjectId("6716a2000000000000000005"),
        name: "Salbutamol 100mcg Inhaler",
        quantity: NumberInt(1),
        dosage: "100mcg per puff",
        instructions: "Inhale one to two puffs when required",
        price_charged: 6.20
      }
    ]
  },
  {
    _id: ObjectId("6716a3000000000000000009"),
    patient_id: ObjectId("6716a1000000000000000001"),     // Aoife Murphy
    prescriber_id: ObjectId("6716a4000000000000000002"),  // Dr Sinéad Moran
    pharmacist_id: null,
    issue_date: new Date("2026-10-12"),
    dispense_date: null,
    status: "Cancelled",
    num_repeats: NumberInt(0),
    items: [
      {
        medicine_id: ObjectId("6716a2000000000000000008"),
        name: "Omeprazole 20mg Capsules",
        quantity: NumberInt(28),
        dosage: "20mg",
        instructions: "Take one capsule each morning before food"
      }
    ]
  },
  {
    _id: ObjectId("6716a3000000000000000010"),
    patient_id: ObjectId("6716a1000000000000000002"),     // Seán O'Brien (repeat of prescription 2)
    prescriber_id: ObjectId("6716a4000000000000000003"),  // Dr Brian Hennessy
    pharmacist_id: null,
    issue_date: new Date("2026-10-20"),
    dispense_date: null,
    status: "Pending",
    num_repeats: NumberInt(5),
    items: [
      {
        medicine_id: ObjectId("6716a2000000000000000004"),
        name: "Atorvastatin 20mg Tablets",
        quantity: NumberInt(28),
        dosage: "20mg",
        instructions: "Take one tablet at night"
      },
      {
        medicine_id: ObjectId("6716a2000000000000000006"),
        name: "Metformin 500mg Tablets",
        quantity: NumberInt(56),
        dosage: "500mg",
        instructions: "Take one tablet twice daily with meals"
      }
    ]
  }
])


// #####################################################################
// PART 2 - READ: find() QUERIES
// #####################################################################

// ---------- 1. find() and .pretty() ----------

// 1.1 Return every document in each collection
db.patients.find().pretty()
db.medicines.find().pretty()
db.prescribers.find().pretty()
db.pharmacists.find().pretty()
db.prescriptions.find().pretty()

// 1.2 Find a single document by its _id - implicit equality
db.patients.findOne({ _id: ObjectId("6716a1000000000000000001") })

// 1.3 Find a single document by _id using $eq - explicit equality
db.patients.find({ _id: { $eq: ObjectId("6716a1000000000000000001") } }).pretty()


// ---------- 2. Querying on multiple properties (AND) ----------

// 2.1 Find documents that match two properties at once
//     (default behaviour: all criteria must be true)
db.medicines.find({ script_only: true, form: "Tablet" }).pretty()

// 2.2 Do the same query using the explicit $and operator
db.medicines.find({ $and: [{ script_only: true }, { form: "Tablet" }] }).pretty()


// ---------- 3. $or ----------

// 3.1 Find documents that match EITHER of two properties
db.medicines.find({ $or: [{ script_only: false }, { stock_qty: 0 }] }).pretty()


// ---------- 4. Comparison operators ----------

// 4.1 Use $ne to find documents that do NOT match a value
//     Prescriptions that have not been dispensed
db.prescriptions.find({ status: { $ne: "Dispensed" } }).pretty()

// 4.2 Use $gt to find documents above a value
//     Medicines costing more than €10
db.medicines.find({ price: { $gt: 10 } }).pretty()

// 4.3 Use $lt to find documents below a value
//     Patients born before 1960
db.patients.find({ dob: { $lt: new Date("1960-01-01") } }).pretty()


// ---------- 5. Querying a range of values ----------

// 5.1 Combine $gt and $lt to find values between two numbers
//     Medicines priced between €5 and €10
db.medicines.find({ price: { $gt: 5, $lt: 10 } }).pretty()
 
// 5.2 Combine $gte and $lte to find dates between two dates
//     Prescriptions issued in October 2026
db.prescriptions.find({
  issue_date: { $gte: new Date("2026-10-01"), $lte: new Date("2026-10-31") }
}).pretty()


// ---------- 6. $in and $nin ----------

// 6.1 Use $in to find documents matching any value in a list
//     Senior pharmacists
db.pharmacists.find({
  role: { $in: ["Supervising Pharmacist", "Superintendent Pharmacist"] }
}).pretty()
 
// 6.2 Use $nin to find documents matching none of the values in a list
//     Patients who are not on a Medical Card or GP Visit Card
db.patients.find({
  "scheme_details.scheme_type": { $nin: ["Medical Card", "GP Visit Card"] }
}).pretty()


// ---------- 7. Subdocuments (dot notation) ----------

// 7.1 Find documents using a field inside an embedded subdocument
//     (field name wrapped in double quotes)
//     Patients on a Medical Card
db.patients.find({ "scheme_details.scheme_type": "Medical Card" }).pretty()
 
// 7.2 Find documents using a field inside an array of subdocuments
//     Patients with an address in Waterford
db.patients.find({ "address.county": "Waterford" }).pretty()
 
// 7.3 Combine dot notation with a range ($gt / $lt)
//     Prescriptions with an item charged between €8 and €10
db.prescriptions.find({ "items.price_charged": { $gt: 8, $lt: 10 } }).pretty()


// ---------- 8. Querying arrays ----------

// 8.1 Find documents where an array contains a single value
//     Patients allergic to penicillin
db.patients.find({ allergies: "Penicillin" }).pretty()
 
// 8.2 Use $all to find documents where an array contains several values
//     Patients allergic to BOTH peanuts and penicillin
db.patients.find({ allergies: { $all: ["Peanuts", "Penicillin"] } }).pretty()
 
// 8.3 Query an array with $gt and $lt WITHOUT $elemMatch
//     (comment: conditions can be met by different elements)
//     Medicines with a batch expiring during 2027?
//     Returns 6 medicines, including Glucophage, which has NO batch expiring in 2027:
//     its 2028 batch meets $gte and its 2026 batch meets $lt
db.medicines.find({
  "batches.expiry_date": { $gte: new Date("2027-01-01"), $lt: new Date("2028-01-01") }
}).pretty()


// ---------- 9. $elemMatch ----------

// 9.1 Use $elemMatch so ONE array element must meet both conditions
//     (comment: compare the result with 8.3)
//     Same question as 8.3 - now returns 5 medicines, Glucophage is gone,
//     because a single batch must meet both conditions
db.medicines.find({
  batches: { $elemMatch: { expiry_date: { $gte: new Date("2027-01-01"), $lt: new Date("2028-01-01") } } }
}).pretty()
 
// 9.2 Use $elemMatch with more than one field in the same element
//     Medicines with a batch that expires before 2027 AND still has at least 20 units
db.medicines.find({
  batches: { $elemMatch: { expiry_date: { $lt: new Date("2027-01-01") }, quantity: { $gte: 20 } } }
}).pretty()


// ---------- 10. Projection ----------

// 10.1 Show only one field for matching documents (note _id still appears)
//      Surnames of patients allergic to penicillin
db.patients.find({ allergies: "Penicillin" }, { last_name: 1 }).pretty()
 
// 10.2 Show only that field and hide _id ( _id: 0 )
db.patients.find({ allergies: "Penicillin" }, { _id: 0, last_name: 1 }).pretty()
 
// 10.3 Show several chosen fields
db.patients.find(
  { allergies: "Penicillin" },
  { _id: 0, first_name: 1, last_name: 1, allergies: 1 }
).pretty()
 
// 10.4 Exclude fields instead - show the whole document except chosen fields
//      Capsule medicines without _id and the batches array
db.medicines.find({ form: "Capsule" }, { _id: 0, batches: 0 }).pretty()
 
// 10.5 Combine a query with $elemMatch and a projection
//      Name and stock of medicines with a batch expiring before 2027 that has 20+ units
db.medicines.find(
  { batches: { $elemMatch: { expiry_date: { $lt: new Date("2027-01-01") }, quantity: { $gte: 20 } } } },
  { _id: 0, name: 1, stock_qty: 1 }
).pretty()


// ---------- 11. Cursor methods ----------

// 11.1 countDocuments() - count the results of a query
//      How many prescriptions have been dispensed?
db.prescriptions.countDocuments({ status: "Dispensed" })
 
// 11.2 limit() - return only the first few results
//      First 3 prescription-only medicines
db.medicines.find({ script_only: true }).limit(3).pretty()
 
// 11.3 skip() - skip a number of results
//      Prescription-only medicines after the first 3
db.medicines.find({ script_only: true }).skip(3).pretty()
 
// 11.4 sort() - sort results ascending (1)
//      Medicines from cheapest to most expensive
db.medicines.find({}, { _id: 0, name: 1, price: 1 }).sort({ price: 1 }).pretty()
 
// 11.5 sort() - sort results descending (-1)
//      Medicines from most expensive to cheapest
db.medicines.find({}, { _id: 0, name: 1, price: 1 }).sort({ price: -1 }).pretty()
 
// 11.6 Combine a query, projection, sort and limit in one statement
//      Patients NOT on a Medical Card: names and scheme only, sorted by surname, first 3
db.patients.find(
  { "scheme_details.scheme_type": { $ne: "Medical Card" } },
  { _id: 0, first_name: 1, last_name: 1, "scheme_details.scheme_type": 1 }
).sort({ last_name: 1 }).limit(3).pretty()


// ---------- 12. distinct() ----------

// 12.1 List every distinct value of a field (like SELECT DISTINCT in SQL)
//      Every dosage form the pharmacy stocks
db.medicines.distinct("form")
//      Every allergy on record (distinct also works on arrays)
db.patients.distinct("allergies")


// =====================================================================
// EXTRAS
// =====================================================================
 
// ---------- 13. $exists and null ----------
 
// 13.1 Use $exists: false to find documents missing a field
//      Patients with no scheme number on file
db.patients.find({ "scheme_details.scheme_num": { $exists: false } }).pretty()
 
// 13.2 Find documents where a field is null
//      Prescriptions not yet dispensed
//      (note: null also matches documents where the field is missing entirely)
db.prescriptions.find({ dispense_date: null }).pretty()
 
 
// ---------- 14. $size ----------
 
// 14.1 Find documents where an array is empty, or has a set number of elements
//      Patients with no recorded allergies
db.patients.find({ allergies: { $size: 0 } }).pretty()
//      Patients with exactly two addresses
db.patients.find({ address: { $size: 2 } }).pretty()
 
 
// ---------- 15. Regular expressions ----------
 
// 15.1 Find text containing a word, case-insensitive ( /text/i )
//      Prescribers with "walsh" in their name
db.prescribers.find({ name: /walsh/i }).pretty()
 
// 15.2 Find text starting with a pattern ( ^ )
//      Patients with a Waterford Eircode (routing key X91)
db.patients.find({ "address.eircode": /^X91/ }).pretty()
 
 
// ---------- 16. Paging and multi-field sort ----------
 
// 16.1 Combine skip() and limit() to show "page 2" of results
//      Patients by surname, 3 per page, page 2
db.patients.find({}, { _id: 0, first_name: 1, last_name: 1 })
  .sort({ last_name: 1 }).skip(3).limit(3).pretty()
 
// 16.2 Sort on two fields at once
//      Prescriptions by status (A-Z), then newest first within each status
db.prescriptions.find({}, { status: 1, issue_date: 1 })
  .sort({ status: 1, issue_date: -1 }).pretty()
 
 
// ---------- 17. Following references between collections ----------
 
// 17.1 Look up one document, then use its _id to find related documents
//      in another collection
//      All prescriptions for Aoife Murphy
const aoife = db.patients.findOne({ first_name: "Aoife", last_name: "Murphy" })
db.prescriptions.find({ patient_id: aoife._id }).pretty()


// #####################################################################
// PART 3 - UPDATE
// #####################################################################

// ---------- 1. updateOne() with $set ----------
// updateOne(filter, update) changes the FIRST document that matches the filter.
// $set changes the value of a field (or adds the field if it is missing).

// 1.1 Update prescriber contact by searching for prescriber name
//     Dr Brian Hennessy's practice has a new phone number
db.prescribers.updateOne(
    { name: "Dr Brian Hennessy" },
    { $set: { contact: "056-7798765" } }
)

// 1.2 Update pharmacist role by searching for psi number
//     Conor Healy is promoted to Supervising Pharmacist
db.pharmacists.updateOne(
    { psi_num: "21877" },
    { $set: { role: "Supervising Pharmacist" } }
)

// 1.3 Update medicine type by searching for medicine generic name
//     $set on an array replaces the WHOLE array with the new one
db.medicines.updateOne(
    { generic_name: "Cetirizine" },
    { $set: { med_type: ["Antihistamine", "Allergy", "Hay Fever"] } }
)

// 1.4 Update patient dob by searching for name and address
//     Siobhán Ryan's date of birth was entered wrongly.
//     Searching on name AND eircode makes sure we change the right patient
//     (dot notation into the address array)
db.patients.updateOne(
    { first_name: "Siobhán", last_name: "Ryan", "address.eircode": "E91 A6V2" },
    { $set: { dob: new Date("1990-01-25") } }
)

// 1.5 Update prescriptions - dispense a pending prescription
//     Seán O'Brien's repeat prescription is dispensed by Niamh Byrne.
//     One update can use several operators at once:
//       $set         - change status and record the pharmacist
//       $currentDate - set dispense_date to today's date
//       $inc         - take one off the number of repeats remaining
//     NumberInt(-1) keeps num_repeats stored as Int32 (a plain -1 would turn it into a Double)
db.prescriptions.updateOne(
    { _id: ObjectId("6716a3000000000000000010") },
    {
        $set: { status: "Dispensed", pharmacist_id: ObjectId("6716a5000000000000000001") },
        $currentDate: { dispense_date: true },
        $inc: { num_repeats: NumberInt(-1) }
    }
)


// ---------- 2. updateMany() ----------
// updateMany(filter, update) changes EVERY document that matches the filter.

// 2.1 Riverside Family Practice changes its phone number.
//     Dr Walsh and Dr Moran both work there, so both documents are updated
db.prescribers.updateMany(
    { practice_name: "Riverside Family Practice" },
    { $set: { contact: "051-879000" } }
)

// 2.2 Flag every medicine that is at or below its reorder level.
//     $expr compares two fields in the same document, so the filter
//     works for any medicine without hard-coding numbers
db.medicines.updateMany(
    { $expr: { $lte: ["$stock_qty", "$reorder_level"] } },
    { $set: { reorder_needed: true } }
)

// 2.3 $mul - multiply a field's value
//     Ahead of winter, the reorder level for respiratory medicines is
//     doubled so more stock is kept on hand (Ventolin: 20 -> 40)
db.medicines.updateMany(
    { med_type: "Respiratory" },
    { $mul: { reorder_level: NumberInt(2) } }
)

// 2.4 updateMany with arrayFilters
//     Flag every batch, in every medicine, that expires before 2027.
//     The filter picks the medicines with at least one such batch, and
//     $[b] with arrayFilters picks which batches inside them get the flag
//     (Ventolin VEN2410D, Glucophage GLU2409F and Nurofen NUR2312C)
db.medicines.updateMany(
    { "batches.expiry_date": { $lt: new Date("2027-01-01") } },
    { $set: { "batches.$[b].expiring_soon": true } },
    { arrayFilters: [{ "b.expiry_date": { $lt: new Date("2027-01-01") } }] }
)


// ---------- 3. $inc and $push together - receiving stock ----------

// 3.1 A delivery of 60 Ventolin inhalers arrives.
//     $inc adds 60 to the stock quantity, and $push adds the new batch
//     to the end of the embedded batches array, so stock_qty still
//     equals the total of the batches. Ventolin was flagged in 2.2, so
//     $unset removes the reorder_needed flag now that it's restocked
db.medicines.updateOne(
    { name: "Ventolin Evohaler" },
    {
        $inc: { stock_qty: NumberInt(60) },
        $push: { batches: { batch_num: "VEN2511A", expiry_date: new Date("2028-05-31"), quantity: NumberInt(60) } },
        $unset: { reorder_needed: "" }
    }
)


// ---------- 4. Updating an element inside an embedded array ----------

// 4.1 The positional $ operator - update the element that matched the filter
//     28 Lipitor tablets are dispensed from batch LIP2501A.
//     "batches.$.quantity" means "the quantity of whichever batch matched
//     batches.batch_num in the filter"
db.medicines.updateOne(
    { name: "Lipitor", "batches.batch_num": "LIP2501A" },
    { $inc: { stock_qty: NumberInt(-28), "batches.$.quantity": NumberInt(-28) } }
)

// 4.2 arrayFilters - update specific elements chosen by a condition
//     Record the price charged for each item on the prescription dispensed in 1.5.
//     $[ator] and $[met] are named placeholders; arrayFilters says which
//     element each one refers to
db.prescriptions.updateOne(
    { _id: ObjectId("6716a3000000000000000010") },
    { $set: { "items.$[ator].price_charged": 14.50, "items.$[met].price_charged": 7.80 } },
    {
        arrayFilters: [
            { "ator.medicine_id": ObjectId("6716a2000000000000000004") },   // Atorvastatin
            { "met.medicine_id": ObjectId("6716a2000000000000000006") }     // Metformin
        ]
    }
)

// 4.3 Updating an element by its index (position) in the array
//     Aoife Murphy's workplace moves to a different unit in the business park.
//     Arrays start at 0, so "address.1" is her second address (work)
db.patients.updateOne(
    { first_name: "Aoife", last_name: "Murphy" },
    { $set: { "address.1.line_1": "Unit 9" } }
)


// ---------- 5. Array update operators ----------

// 5.1 $push - add a value to an array
//     Aoife Murphy reports a new allergy to ibuprofen
db.patients.updateOne(
    { first_name: "Aoife", last_name: "Murphy" },
    { $push: { allergies: "Ibuprofen" } }
)

// 5.2 $addToSet - add a value ONLY if it is not already in the array
//     Aoife already has Latex recorded, so nothing changes (modifiedCount: 0).
//     $push would have added a second "Latex"
db.patients.updateOne(
    { first_name: "Aoife", last_name: "Murphy" },
    { $addToSet: { allergies: "Latex" } }
)

// 5.3 $addToSet with $each - add several values, skipping any duplicates
//     Siobhán Ryan already has Penicillin recorded, so only Latex is added
db.patients.updateOne(
    { first_name: "Siobhán", last_name: "Ryan" },
    { $addToSet: { allergies: { $each: ["Penicillin", "Latex"] } } }
)

// 5.4 $pull - remove a value from an array
//     Patrick Doyle's codeine allergy was recorded in error
db.patients.updateOne(
    { first_name: "Patrick", last_name: "Doyle" },
    { $pull: { allergies: "Codeine" } }
)

// 5.5 $push a new subdocument into an array of subdocuments
//     Emma Kavanagh adds a home address alongside her college address
db.patients.updateOne(
    { first_name: "Emma", last_name: "Kavanagh" },
    { $push: { address: { line_1: "22 Cathedral Road", county: "Waterford", eircode: "X91 P8D3" } } }
)

// 5.6 $pop - remove the first or last element of an array
//     1 removes the LAST element, -1 removes the FIRST.
//     Siobhán Ryan has left her job, so her work address (the last one) is removed
db.patients.updateOne(
    { first_name: "Siobhán", last_name: "Ryan" },
    { $pop: { address: 1 } }
)


// ---------- 6. $unset - removing fields ----------

// 6.1 Michael Power's Drugs Payment Scheme membership has expired.
//     $set changes his scheme type, and $unset removes the scheme number
//     and expiry date completely, the same way Ciara Kelly's record is stored
//     (the value given to $unset doesn't matter - "" is the convention)
db.patients.updateOne(
    { first_name: "Michael", last_name: "Power" },
    {
        $set: { "scheme_details.scheme_type": "None" },
        $unset: { "scheme_details.scheme_num": "", "scheme_details.expiry_date": "" }
    }
)


// =====================================================================
// EXTRAS
// =====================================================================

// ---------- 7. upsert ----------

// 7.1 updateOne with { upsert: true } updates the document if it exists,
//     and INSERTS it if it doesn't.
//     A locum pharmacist starts work - no pharmacist has PSI number 23950,
//     so a new document is created with an automatically generated _id.
//     Running it a second time updates the same document instead of adding another
db.pharmacists.updateOne(
    { psi_num: "23950" },
    { $set: { first_name: "Aisling", last_name: "Quinn", role: "Pharmacist" } },
    { upsert: true }
)


// ---------- 8. replaceOne() ----------

// 8.1 replaceOne replaces the WHOLE document (except _id).
//     Dr Orla Nolan moves to a new practice. Every field must be included,
//     because any field left out of the new document is lost
db.prescribers.replaceOne(
    { imc_num: "407733" },
    {
        name: "Dr Orla Nolan",
        imc_num: "407733",
        practice_name: "Gorey Family Practice",
        practice_address: "Main Street, Gorey, Wexford, Y25 H2K7",
        contact: "053-9487654"
    }
)


// ---------- 9. findOneAndUpdate() ----------

// 9.1 findOneAndUpdate updates a document AND returns it.
//     updateOne only returns counts, so this is useful when you need to see
//     the result straight away.
//     Siobhán Ryan collects her last repeat - returnDocument: "after" shows
//     the document with num_repeats now at 0
db.prescriptions.findOneAndUpdate(
    { _id: ObjectId("6716a3000000000000000004") },
    { $inc: { num_repeats: NumberInt(-1) }, $currentDate: { dispense_date: true } },
    { returnDocument: "after" }
)


// #####################################################################
// PART 4 - DELETE
// #####################################################################

// ---------- 1. deleteOne() ----------
// Deletes the first document that matches the filter.

// 1.1 Delete the locum pharmacist added by the upsert in update 7.1
db.pharmacists.deleteOne({ psi_num: "23950" })

// 1.2 Delete Aoife Murphy's cancelled prescription
db.prescriptions.deleteOne({ status: "Cancelled", patient_id: ObjectId("6716a1000000000000000001") })


// ---------- 2. deleteMany() ----------
// Deletes every document that matches the filter.

// 2.1 Check which prescriptions will be deleted: dispensed, no repeats
//     left, and dispensed before 1 September 2026
db.prescriptions.find({
    status: "Dispensed",
    num_repeats: 0,
    dispense_date: { $lt: new Date("2026-09-01") }
})

// 2.2 Delete them - Michael Power's and Emma Kavanagh's (deletedCount: 2)
db.prescriptions.deleteMany({
    status: "Dispensed",
    num_repeats: 0,
    dispense_date: { $lt: new Date("2026-09-01") }
})


// =====================================================================
// EXTRAS
// =====================================================================

// ---------- 3. findOneAndDelete() ----------

// 3.1 Deletes a document and returns it, so you can see what was removed.
//     Michael Power has moved to another pharmacy
db.patients.findOneAndDelete({ first_name: "Michael", last_name: "Power" })


// ---------- 4. Deleting from an embedded array with $pull ----------

// 4.1 Remove Patrick Doyle's old nursing home address
db.patients.updateOne(
    { first_name: "Patrick", last_name: "Doyle" },
    { $pull: { address: { line_1: "Ashgrove Nursing Home" } } }
)

// 4.2 Remove Ventolin's expired batch and take its 15 inhalers off stock_qty
db.medicines.updateOne(
    { name: "Ventolin Evohaler" },
    {
        $pull: { batches: { batch_num: "VEN2410D" } },
        $inc: { stock_qty: -15 }
    }
)

db.medicines.find({ name: "Ventolin Evohaler" }, { _id: 0, name: 1, stock_qty: 1, batches: 1 })


// #####################################################################
// PART 5 - AGGREGATIONS
// #####################################################################

// ---------- 1. $match and $count ----------

// 1.1 Prescriptions still waiting to be dispensed
db.prescriptions.aggregate([
    { $match: { status: "Pending" } }
])

// 1.2 Count the prescription-only tablets
db.medicines.aggregate([
    { $match: { script_only: true, form: "Tablet" } },
    { $count: "script_only_tablets" }
])

// 1.3 Count the patients with a Medical Card (dot notation for a subdocument)
db.patients.aggregate([
    { $match: { "scheme_details.scheme_type": "Medical Card" } },
    { $count: "medical_card_holders" }
])


// ---------- 2. $project ----------

// 2.1 Patient names and phone numbers, with first and last name joined by $concat
db.patients.aggregate([
    {
        $project: {
            _id: 0,
            full_name: { $concat: ["$first_name", " ", "$last_name"] },
            phone_num: 1
        }
    }
])

// 2.2 Value of the stock on the shelf for each medicine (price x stock_qty)
//     $round to 2 decimal places stops results like 149.70000000000002
db.medicines.aggregate([
    {
        $project: {
            _id: 0,
            name: 1,
            price: 1,
            stock_qty: 1,
            stock_value: { $round: [{ $multiply: ["$price", "$stock_qty"] }, 2] }
        }
    }
])


// ---------- 3. $sort, $limit, $skip and $sample ----------

// 3.1 The three most expensive medicines (-1 = descending)
db.medicines.aggregate([
    { $sort: { price: -1 } },
    { $limit: 3 },
    { $project: { _id: 0, name: 1, price: 1 } }
])

// 3.2 The next three most expensive ($skip the first three)
db.medicines.aggregate([
    { $sort: { price: -1 } },
    { $skip: 3 },
    { $limit: 3 },
    { $project: { _id: 0, name: 1, price: 1 } }
])

// 3.3 Two patients picked at random
db.patients.aggregate([
    { $sample: { size: 2 } },
    { $project: { _id: 0, first_name: 1, last_name: 1 } }
])


// ---------- 4. $group ----------

// 4.1 Number of prescriptions in each status
db.prescriptions.aggregate([
    { $group: { _id: "$status", num_prescriptions: { $sum: 1 } } },
    { $sort: { num_prescriptions: -1 } }
])

// 4.2 Price statistics across all medicines (_id: null = one group for everything)
db.medicines.aggregate([
    {
        $group: {
            _id: null,
            average_price: { $avg: "$price" },
            cheapest: { $min: "$price" },
            dearest: { $max: "$price" },
            price_std_dev: { $stdDevPop: "$price" }
        }
    }
])

// 4.3 Group patients by how many allergies they have
//     $cond + $isArray checks allergies is an array before $size counts it
db.patients.aggregate([
    {
        $group: {
            _id: { $cond: [{ $isArray: "$allergies" }, { $size: "$allergies" }, 0] },
            num_patients: { $sum: 1 }
        }
    },
    { $sort: { _id: -1 } }
])

// 4.4 Count patients with a Waterford eircode (regex: starts with X91)
db.patients.aggregate([
    { $match: { "address.eircode": /^X91/ } },
    { $count: "waterford_patients" }
])


// ---------- 5. $unwind ----------

// 5.1 Revenue per medicine
//     $unwind gives one document per prescribed item, then $group totals them
db.prescriptions.aggregate([
    { $match: { status: "Dispensed" } },
    { $unwind: "$items" },
    {
        $group: {
            _id: "$items.name",
            times_dispensed: { $sum: 1 },
            revenue: { $sum: "$items.price_charged" }
        }
    },
    { $sort: { revenue: -1 } }
])

// 5.2 Number of medicines in each category (med_type is an array)
db.medicines.aggregate([
    { $unwind: "$med_type" },
    { $group: { _id: "$med_type", num_medicines: { $sum: 1 } } },
    { $sort: { num_medicines: -1, _id: 1 } }
])


// ---------- 6. $out ----------

// 6.1 Save the stock in each category to a new stock_by_category collection
//     $out must be the last stage
db.medicines.aggregate([
    { $unwind: "$med_type" },
    { $group: { _id: "$med_type", total_stock: { $sum: "$stock_qty" } } },
    { $out: "stock_by_category" }
])

db.stock_by_category.find().sort({ total_stock: -1 })


// ---------- 7. $lookup ----------

// 7.1 Prescriptions with the patient's name joined from patients
db.prescriptions.aggregate([
    { $lookup: { from: "patients", localField: "patient_id", foreignField: "_id", as: "patient" } },
    { $unwind: "$patient" },
    {
        $project: {
            _id: 0,
            patient: { $concat: ["$patient.first_name", " ", "$patient.last_name"] },
            status: 1,
            items: "$items.name"
        }
    }
])

// 7.2 Number of prescriptions written by each prescriber
db.prescriptions.aggregate([
    { $group: { _id: "$prescriber_id", num_prescriptions: { $sum: 1 } } },
    { $lookup: { from: "prescribers", localField: "_id", foreignField: "_id", as: "prescriber" } },
    { $unwind: "$prescriber" },
    { $project: { _id: 0, prescriber: "$prescriber.name", num_prescriptions: 1 } },
    { $sort: { num_prescriptions: -1 } }
])

// 7.3 Number of prescriptions dispensed by each pharmacist
//     (pending prescriptions have no pharmacist, so they are filtered out first)
db.prescriptions.aggregate([
    { $match: { pharmacist_id: { $ne: null } } },
    { $group: { _id: "$pharmacist_id", num_dispensed: { $sum: 1 } } },
    { $lookup: { from: "pharmacists", localField: "_id", foreignField: "_id", as: "pharmacist" } },
    { $unwind: "$pharmacist" },
    { $project: { _id: 0, pharmacist: "$pharmacist.last_name", num_dispensed: 1 } },
    { $sort: { num_dispensed: -1 } }
])

// 7.4 Revenue by payment scheme (Medical Card, DPS, GP Visit Card...)
db.prescriptions.aggregate([
    { $match: { status: "Dispensed" } },
    { $lookup: { from: "patients", localField: "patient_id", foreignField: "_id", as: "patient" } },
    { $unwind: "$patient" },
    { $unwind: "$items" },
    {
        $group: {
            _id: "$patient.scheme_details.scheme_type",
            revenue: { $sum: "$items.price_charged" }
        }
    },
    { $sort: { revenue: -1 } }
])


// =====================================================================
// EXTRAS
// =====================================================================

// ---------- 8. Extras ----------

// 8.1 Patient age bands
//     $dateDiff works out each patient's age, then $bucket groups the ages
//     into ranges: 0-17, 18-39, 40-64 and 65+
db.patients.aggregate([
    { $addFields: { age: { $dateDiff: { startDate: "$dob", endDate: "$$NOW", unit: "year" } } } },
    {
        $bucket: {
            groupBy: "$age",
            boundaries: [0, 18, 40, 65, 120],
            output: { num_patients: { $sum: 1 } }
        }
    }
])

// 8.2 Batches that expire in the next 90 days ($$NOW = today's date)
db.medicines.aggregate([
    { $unwind: "$batches" },
    { $addFields: { days_left: { $dateDiff: { startDate: "$$NOW", endDate: "$batches.expiry_date", unit: "day" } } } },
    { $match: { days_left: { $lte: 90 } } },
    { $project: { _id: 0, name: 1, batch_num: "$batches.batch_num", days_left: 1 } },
    { $sort: { days_left: 1 } }
])

// 8.3 Pending prescriptions that can't be filled because there isn't enough stock
//     $expr lets $match compare two fields: stock_qty against the quantity prescribed
db.prescriptions.aggregate([
    { $match: { status: "Pending" } },
    { $unwind: "$items" },
    { $lookup: { from: "medicines", localField: "items.medicine_id", foreignField: "_id", as: "medicine" } },
    { $unwind: "$medicine" },
    { $match: { $expr: { $lt: ["$medicine.stock_qty", "$items.quantity"] } } },
    { $project: { _id: 0, item: "$items.name", needed: "$items.quantity", in_stock: "$medicine.stock_qty" } }
])

// 8.4 $facet - several reports from the same documents in one pipeline
db.prescriptions.aggregate([
    {
        $facet: {
            by_status: [
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ],
            top_3_medicines: [
                { $unwind: "$items" },
                { $group: { _id: "$items.name", times_prescribed: { $sum: 1 } } },
                { $sort: { times_prescribed: -1 } },
                { $limit: 3 }
            ]
        }
    }
])