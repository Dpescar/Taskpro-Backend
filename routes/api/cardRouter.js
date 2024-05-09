const express = require("express");
const router = express.Router();
const authenticate = require("../../middlewares/authenticate");
const {
  getById,
  updateById,
  addNew,
  removeById,
  setNewCardOwner,
} = require("../../controllers/cardController");

router.get("/:cardId", authenticate, getById);
router.post("/:columnId", authenticate, addNew);
router.put("/:cardId", authenticate, updateById);
router.delete("/:cardId", authenticate, removeById);
router.patch("/:cardId/owner/:columnId", authenticate, setNewCardOwner);

module.exports = router;
