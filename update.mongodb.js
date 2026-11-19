// =====================================================================
// NoSQL Databases Project - Pharmacy Management System
// =====================================================================

use("pharmacy")

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