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
// $lookup joins documents from another collection, like a JOIN in SQL.
// It follows a reference (e.g. patient_id) to the matching document:
//   from:         the collection to join
//   localField:   the reference field in THIS collection
//   foreignField: the field it matches in the "from" collection
//   as:           the name of the new field holding the match
// The match always comes back as an ARRAY, even when there is only one,
// so $lookup is followed by $unwind to turn it into a plain subdocument.

// 7.1 Prescriptions with the patient's name
//     A prescription only stores the patient's _id, so on its own it doesn't
//     say who the patient is. This joins each prescription to its patient:
//       $lookup  - finds the patient whose _id matches patient_id
//       $unwind  - turns the one-element patient array into a subdocument
//       $project - joins first and last name with $concat, and shows only
//                  the item names from the items array ("$items.name")
//     Returns 7 prescriptions, e.g. Aoife Murphy: Amoxicillin and Cetirizine
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
//     Shows each doctor's workload.
//       $group   - one document per prescriber_id, counting prescriptions with $sum: 1
//       $lookup  - joins the prescriber's details. Grouping FIRST means only 4
//                  lookups (one per prescriber) instead of one per prescription
//       $unwind  - turns the prescriber array into a subdocument
//       $project - shows the prescriber's name and their count
//       $sort    - busiest prescriber first
//     Returns: Dr Ciarán Walsh 3, Dr Brian Hennessy 2, Dr Sinéad Moran 1, Dr Orla Nolan 1
db.prescriptions.aggregate([
    { $group: { _id: "$prescriber_id", num_prescriptions: { $sum: 1 } } },
    { $lookup: { from: "prescribers", localField: "_id", foreignField: "_id", as: "prescriber" } },
    { $unwind: "$prescriber" },
    { $project: { _id: 0, prescriber: "$prescriber.name", num_prescriptions: 1 } },
    { $sort: { num_prescriptions: -1 } }
])

// 7.3 Number of prescriptions dispensed by each pharmacist
//     Same pattern as 7.2, for pharmacists.
//       $match   - pending prescriptions have pharmacist_id: null because no one
//                  has dispensed them yet, so $ne: null removes them first
//       $group   - counts prescriptions per pharmacist
//       $lookup / $unwind - join the pharmacist's details
//       $project - shows the pharmacist's surname and count
//       $sort    - most prescriptions dispensed first
//     Returns: Byrne 3, Daly 2, Healy 1
db.prescriptions.aggregate([
    { $match: { pharmacist_id: { $ne: null } } },
    { $group: { _id: "$pharmacist_id", num_dispensed: { $sum: 1 } } },
    { $lookup: { from: "pharmacists", localField: "_id", foreignField: "_id", as: "pharmacist" } },
    { $unwind: "$pharmacist" },
    { $project: { _id: 0, pharmacist: "$pharmacist.last_name", num_dispensed: 1 } },
    { $sort: { num_dispensed: -1 } }
])

// 7.4 Revenue by payment scheme (Medical Card, DPS, GP Visit Card...)
//     The scheme type is stored on the PATIENT, but the prices charged are
//     stored on the PRESCRIPTION, so the two collections have to be joined.
//       $match   - only dispensed prescriptions have been charged
//       $lookup / $unwind - join the patient to get their scheme_details
//       $unwind "$items" - one document per item, so each price can be added up
//       $group   - groups by the patient's scheme type and totals price_charged
//       $sort    - highest revenue first
//     Returns: Drugs Payment Scheme €44.05, Long-Term Illness €31.95,
//              Medical Card €29.13, GP Visit Card €6.20
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
// $$NOW is a system variable holding the current date and time (two $ signs
// mean it's a variable, not a field). Pipelines that use it give different
// results depending on the day they are run.

// 8.1 Patient age bands
//     Groups patients into age ranges, e.g. to see what age groups the
//     pharmacy serves.
//       $addFields - adds an age field: $dateDiff counts the whole years
//                    between the patient's dob and today ($$NOW)
//       $bucket    - sorts the ages into ranges. Each boundary is the START
//                    of a range, and the range stops before the next one:
//                    [0, 18) = 0-17, [18, 40) = 18-39, [40, 65) = 40-64,
//                    [65, 120) = 65+. Each range's _id is its starting age
//     Returns: 0-17: 1, 18-39: 3, 40-64: 1, 65+: 2
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

// 8.2 Batches that expire in the next 90 days
//     Lets staff see which stock to use or remove first.
//       $unwind    - one document per batch, so each batch is checked on its own
//       $addFields - days_left: $dateDiff counts the days from today ($$NOW)
//                    to the batch's expiry_date
//       $match     - keeps batches with 90 days or fewer left
//       $project   - shows the medicine name, batch number and days left
//       $sort      - soonest to expire first
//     The days left change daily. On 24/11/2026 it returned
//     Glucophage GLU2409F (21 days), Nurofen NUR2312C (37), Difflam DIF2405C (68)
db.medicines.aggregate([
    { $unwind: "$batches" },
    { $addFields: { days_left: { $dateDiff: { startDate: "$$NOW", endDate: "$batches.expiry_date", unit: "day" } } } },
    { $match: { days_left: { $lte: 90 } } },
    { $project: { _id: 0, name: 1, batch_num: "$batches.batch_num", days_left: 1 } },
    { $sort: { days_left: 1 } }
])

// 8.3 Pending prescriptions that can't be filled because there isn't enough stock
//     Checks every item on a pending prescription against the stock on the shelf.
//       $match   - only pending prescriptions still need to be filled
//       $unwind  - one document per item on the prescription
//       $lookup  - joins each item to its medicine using medicine_id
//       $unwind  - turns the medicine array into a subdocument
//       $match + $expr - a normal query can't compare two fields with each
//                  other, so $expr is used to keep items where the stock
//                  (medicine.stock_qty) is LESS THAN the quantity prescribed
//       $project - shows the item, how many are needed and how many are in stock
//     Returns: Escitalopram 10mg Tablets - 28 needed, 0 in stock (Ciara Kelly's)
db.prescriptions.aggregate([
    { $match: { status: "Pending" } },
    { $unwind: "$items" },
    { $lookup: { from: "medicines", localField: "items.medicine_id", foreignField: "_id", as: "medicine" } },
    { $unwind: "$medicine" },
    { $match: { $expr: { $lt: ["$medicine.stock_qty", "$items.quantity"] } } },
    { $project: { _id: 0, item: "$items.name", needed: "$items.quantity", in_stock: "$medicine.stock_qty" } }
])

// 8.4 $facet - several reports from the same documents in one pipeline
//     $facet runs separate mini-pipelines on the SAME input documents and
//     returns all their results together in one document, like a dashboard.
//       by_status       - $group counts the prescriptions in each status
//       top_3_medicines - $unwind the items, $group counts how many times each
//                         medicine was prescribed, $sort most first, $limit 3
//     Returns one document:
//       by_status: Dispensed 6, Pending 1
//       top_3_medicines: Salbutamol 3, Atorvastatin 3, Cetirizine 2
//       (Salbutamol and Atorvastatin are tied, so their order can swap)
//     use("pharmacy") is repeated here so this pipeline can be run on its own
//     with "Run Selected Lines" (select both lines)
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