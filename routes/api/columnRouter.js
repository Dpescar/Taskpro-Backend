const express = require("express");
const router = express.Router();
const authenticate = require("../../middlewares/authenticate");
const {
  getById,
  updateById,
  addNew,
  removeById,
} = require("../../controllers/columnController");

router.post("/:dashboardId", authenticate, addNew);
router.get("/:columnId", authenticate, getById);
router.put("/:columnId", authenticate, updateById);
router.delete("/:columnId", authenticate, removeById);

module.exports = router;
