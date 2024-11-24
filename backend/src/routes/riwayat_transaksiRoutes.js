const express = require("express");
const router = express.Router();
const passport = require("passport");

const readRiwayatTransaksi = require("../controllers/riwayat_transaksi/read");
const createRiwayatTransaksi = require("../controllers/riwayat_transaksi/create");
const updateRiwayatTransaksi = require("../controllers/riwayat_transaksi/update");
const deleteRiwayatTransaksi = require("../controllers/riwayat_transaksi/delete");

router.get("/riwayat_transaksi", passport.authenticate('jwt', { session: false }), readRiwayatTransaksi);
router.post("/riwayat_transaksi", passport.authenticate('jwt', { session: false }), createRiwayatTransaksi);
router.put("/riwayat_transaksi/:id_rt", passport.authenticate('jwt', { session: false }), updateRiwayatTransaksi);
router.delete("/riwayat_transaksi/:id_rt", passport.authenticate('jwt', { session: false }), deleteRiwayatTransaksi);

module.exports = router;