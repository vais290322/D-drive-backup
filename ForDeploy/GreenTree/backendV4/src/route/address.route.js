const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/authorization");
const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setaddress,
  getAddressesbyuser
} = require("../controller/address.controller");

router.post("/address", authenticate,authorize(["user"]), addAddress);
router.get("/address",authenticate,authorize(["user"]), getAddresses);
router.put("/address/:id", authenticate,authorize(["user"]), updateAddress);
router.delete("/address/:id",  authenticate,authorize(["user"]), deleteAddress);

router.put("/setaddress/:id", authenticate,authorize(["user"]), setaddress);
router.get("/addressbyuser",authenticate,authorize(["user"]), getAddressesbyuser);

module.exports = router;