// =====================================================================
// NoSQL Databases Project - Pharmacy Management System
//
//  comments and layout inserted! planning what find statements to use, add in ref links to bottom - mon26oct
//  finish and review! - sat20oct
//
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

// 5.2 Combine $gte and $lte to find dates between two dates


// ---------- 6. $in and $nin ----------

// 6.1 Use $in to find documents matching any value in a list

// 6.2 Use $nin to find documents matching none of the values in a list


// ---------- 7. Subdocuments (dot notation) ----------

// 7.1 Find documents using a field inside an embedded subdocument
//     (field name wrapped in double quotes)

// 7.2 Find documents using a field inside an array of subdocuments

// 7.3 Combine dot notation with a range ($gt / $lt)


// ---------- 8. Querying arrays ----------

// 8.1 Find documents where an array contains a single value

// 8.2 Use $all to find documents where an array contains several values

// 8.3 Query an array with $gt and $lt WITHOUT $elemMatch
//     (comment: conditions can be met by different elements)


// ---------- 9. $elemMatch ----------

// 9.1 Use $elemMatch so ONE array element must meet both conditions
//     (comment: compare the result with 8.3)

// 9.2 Use $elemMatch with more than one field in the same element


// ---------- 10. Projection ----------

// 10.1 Show only one field for matching documents (note _id still appears)

// 10.2 Show only that field and hide _id ( _id: 0 )

// 10.3 Show several chosen fields

// 10.4 Exclude fields instead - show the whole document except chosen fields

// 10.5 Combine a query with $elemMatch and a projection


// ---------- 11. Cursor methods ----------

// 11.1 countDocuments() - count the results of a query

// 11.2 limit() - return only the first few results

// 11.3 skip() - skip a number of results

// 11.4 sort() - sort results ascending (1)

// 11.5 sort() - sort results descending (-1)

// 11.6 Combine a query, projection, sort and limit in one statement


// ---------- 12. distinct() ----------

// 12.1 List every distinct value of a field (like SELECT DISTINCT in SQL)


// =====================================================================
// EXTRAS
// =====================================================================

// ---------- 13. $exists and null ----------

// 13.1 Use $exists: false to find documents missing a field

// 13.2 Find documents where a field is null


// ---------- 14. $size ----------

// 14.1 Find documents where an array is empty, or has a set number of elements


// ---------- 15. Regular expressions ----------

// 15.1 Find text containing a word, case-insensitive ( /text/i )

// 15.2 Find text starting with a pattern ( ^ )


// ---------- 16. Paging and multi-field sort ----------

// 16.1 Combine skip() and limit() to show "page 2" of results

// 16.2 Sort on two fields at once


// ---------- 17. Following references between collections ----------

// 17.1 Look up one document, then use its _id to find related documents
//      in another collection