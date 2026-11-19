// =====================================================================
// NoSQL Databases Project - Pharmacy Management System
// =====================================================================

use("pharmacy")


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