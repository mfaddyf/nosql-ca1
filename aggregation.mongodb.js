// =====================================================================
// NoSQL Databases Project - Pharmacy Management System
// =====================================================================

use("pharmacy")


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
use("pharmacy")
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
use("pharmacy")
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