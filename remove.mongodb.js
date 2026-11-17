// =====================================================================
// NoSQL Databases Project - Pharmacy Management System
// =====================================================================

use("pharmacy")

// ---------- 1. deleteOne() ----------
// deleteOne(filter) deletes the FIRST document that matches the filter,
// even if more than one document matches.

// 1.1 Delete a pharmacist by searching for psi number
//     Aisling Quinn's locum cover has finished (she was added by the
//     upsert in update 7.1), so her record is removed
db.pharmacists.deleteOne({ psi_num: "23950" })

// 1.2 Delete Aoife Murphy's cancelled prescription.
//     Searching on status AND patient_id makes sure only the right
//     prescription can match
db.prescriptions.deleteOne({ status: "Cancelled", patient_id: ObjectId("6716a1000000000000000001") })


// ---------- 2. deleteMany() ----------
// deleteMany(filter) deletes EVERY document that matches the filter.
// All the query operators from find() can be used in the filter.

// Completed prescriptions (dispensed, no repeats left) from before
// 1 September are moved off the live system into an archive collection.
// The same filter is used for every step, so it is stored in a variable
const archiveFilter = {
    status: "Dispensed",
    num_repeats: 0,
    dispense_date: { $lt: new Date("2026-09-01") }
}

// 2.1 Check which prescriptions match BEFORE deleting anything -
//     Michael Power's (August) and Emma Kavanagh's (July)
db.prescriptions.find(archiveFilter, { patient_id: 1, dispense_date: 1, status: 1, num_repeats: 1 })

// 2.2 Copy them into a prescription_archive collection first, so the
//     records aren't lost. $merge adds them to the archive (creating it
//     if it doesn't exist) without wiping anything already in it
db.prescriptions.aggregate([
    { $match: archiveFilter },
    { $merge: { into: "prescription_archive", whenMatched: "keepExisting", whenNotMatched: "insert" } }
])

// 2.3 Now delete them from the live prescriptions collection (deletedCount: 2)
db.prescriptions.deleteMany(archiveFilter)

// 2.4 The archive holds the two prescriptions, and they are gone from prescriptions
db.prescription_archive.countDocuments()
db.prescriptions.countDocuments(archiveFilter)


// =====================================================================
// EXTRAS
// =====================================================================

// ---------- 3. findOneAndDelete() ----------

// 3.1 findOneAndDelete deletes a document AND returns it, so you can see
//     exactly what was removed (deleteOne only returns a count).
//     Michael Power has moved away and transferred to another pharmacy.
//     His only prescription was archived in 2.2, so no live prescription
//     is left pointing at a patient who no longer exists
db.patients.findOneAndDelete({ first_name: "Michael", last_name: "Power" })


// ---------- 4. Deleting embedded subdocuments ----------
// deleteOne/deleteMany remove whole documents. To delete one element from
// an embedded array, update the parent document instead.

// 4.1 $pull with a condition - delete one subdocument from an array
//     Patrick Doyle has moved out of Ashgrove Nursing Home, so that
//     address is removed from his address array (his home address stays)
db.patients.updateOne(
    { first_name: "Patrick", last_name: "Doyle" },
    { $pull: { address: { line_1: "Ashgrove Nursing Home" } } }
)

// 4.2 Remove expired batches from EVERY medicine, and keep stock_qty correct
//     At the monthly stock check (1 December 2026) any batch expiring before
//     that date is taken off the shelf and destroyed.
//     A plain $pull would remove the batch but leave stock_qty too high.
//     Passing updateMany() an aggregation pipeline (the [ ] around $set)
//     lets one update do both:
//       $filter - keep only the batches that expire on or after the check date
//       $sum    - recalculate stock_qty from the batches that are left
//     Removes Ventolin batch VEN2410D (15 inhalers), so Ventolin's
//     stock_qty drops from 75 to 60
const stockCheckDate = new Date("2026-12-01")

db.medicines.find({ "batches.expiry_date": { $lt: stockCheckDate } }, { _id: 0, name: 1, stock_qty: 1, batches: 1 })

db.medicines.updateMany(
    { "batches.expiry_date": { $lt: stockCheckDate } },
    [
        {
            $set: {
                batches: {
                    $filter: {
                        input: "$batches",
                        as: "batch",
                        cond: { $gte: ["$$batch.expiry_date", stockCheckDate] }
                    }
                }
            }
        },
        { $set: { stock_qty: { $toInt: { $sum: "$batches.quantity" } } } }
    ]
)

db.medicines.find({ name: "Ventolin Evohaler" }, { _id: 0, name: 1, stock_qty: 1, batches: 1 })


// ---------- 5. drop() ----------

// 5.1 drop() deletes a whole collection, including all its documents and
//     indexes. Once the archive has been backed up with mongodump
//     (Practical 9), e.g.
//         mongodump --db pharmacy --collection prescription_archive
//     the collection can be dropped from the live database.
//     (db.dropDatabase() at the top of the insert script drops the
//     whole pharmacy database in the same way)
db.prescription_archive.drop()

db.getCollectionNames()