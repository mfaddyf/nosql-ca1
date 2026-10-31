// =====================================================================
// NoSQL Databases Project - Pharmacy Management System
// =====================================================================

use("pharmacy")

// ---------- 1. find() and .pretty() ----------

// 1.1 Return every document in each collection
db.patients.find().pretty()
db.medicines.find().pretty()
db.prescribers.find().pretty()
db.pharmacists.find().pretty()
db.prescriptions.find().pretty()

// 1.2 Find a single document by its _id
db.patients.findOne({ _id: ObjectId("6716a1000000000000000001") })

// 1.3 Find a single document by _id using $eq
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
// EXTRAS - beyond Practical 4
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