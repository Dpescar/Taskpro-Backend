const express = require("express");
const router = express.Router();
const authenticate = require("../../middlewares/authenticate");
const {
  getAll,
  getById,
  addNew,
  updateById,
  removeById,
  updateCurrentDashboard,
} = require("../../controllers/dashboardController");

router.post("/", authenticate, addNew);
router.get("/", authenticate, getAll);
router.get("/:dashboardId", authenticate, getById);
router.put("/:dashboardId", authenticate, updateById);
router.patch("/:dashboardId", authenticate, updateCurrentDashboard);
router.delete("/:dashboardId", authenticate, removeById);

module.exports = router;
