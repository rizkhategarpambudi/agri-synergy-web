const express = require("express");
const cors = require("cors");
const injectDb = require("./middlewares/injectDb");
const bodyParser = require("body-parser");
const passport = require("passport");

const userRoutes = require("./routes/userRoutes");
const produkRoutes = require("./routes/produkRoutes");
const kalenderRoutes = require("./routes/kalenderRoutes");
const sawahRoutes = require("./routes/sawahRoutes");
const sawahdetailRoutes = require("./routes/sawahdetailRoutes");
const keranjangRoutes = require("./routes/keranjangRoutes");
const pemesananRoutes = require("./routes/pemesananRoutes");
const pengirimanRoutes = require("./routes/pengirimanRoutes");
const riwayatTransaksiRoutes = require("./routes/riwayat_transaksiRoutes");
const kategoriRoutes = require("./routes/kategoriRoutes");

const loginRoutes = require("./routes/loginRoutes");
const joinRoutes = require("./routes/joinRoutes");

const app = express();

app.use(passport.initialize());
require("./middlewares/passport");

app.use(cors());
app.use(bodyParser.json());
app.use(injectDb);

const apiRoutes = express.Router();
apiRoutes.use("/auth", loginRoutes);
apiRoutes.use(userRoutes);
apiRoutes.use(produkRoutes);
apiRoutes.use(kalenderRoutes);
apiRoutes.use(sawahRoutes);
apiRoutes.use(sawahdetailRoutes);
apiRoutes.use(keranjangRoutes);
apiRoutes.use(pemesananRoutes);
apiRoutes.use(pengirimanRoutes);
apiRoutes.use(riwayatTransaksiRoutes);
apiRoutes.use(kategoriRoutes);
apiRoutes.use(joinRoutes);

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

module.exports = app;
