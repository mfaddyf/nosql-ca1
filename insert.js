// =====================================================================
// NoSQL Databases Project - Pharmacy Management System
//
//  comments and layout inserted! planning what insert statements to use, add in any ref links to bottom if used? - mon26oct
//  needs review, testing seems to work ok! - fri30oct
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
