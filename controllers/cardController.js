const HttpError = require("../helpers/HttpError");
const controllerWrapper = require("../helpers/decorators");
const Card = require("../models/schemas/cardSchema");
const Column = require("../models/schemas/columnSchema");

async function addNew(req, res) {
  try {
    const { columnId } = req.params;
    const column = await Column.findById(columnId);
    if (!column) {
      return res.status(404).json({ error: "Column not found" });
    }
    const newCard = await Card.create({
      ...req.body,
      owner: columnId,
    });
    res.status(201).json(newCard);
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Failed to add new card";
    res.status(status).json({ error: message });
  }
}

async function getById(req, res) {
  try {
    const { cardId } = req.params;
    const result = await Card.findById(cardId);
    if (!result) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Failed to fetch card";
    res.status(status).json({ error: message });
  }
}

async function removeById(req, res) {
  try {
    const { cardId } = req.params;
    const result = await Card.findByIdAndDelete(cardId);
    if (!result) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.json({ message: "Card deleted successfully", deletedCard: result });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Failed to remove card";
    res.status(status).json({ error: message });
  }
}

async function updateById(req, res) {
  try {
    const { cardId } = req.params;
    const result = await Card.findByIdAndUpdate(cardId, req.body, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Failed to update card";
    res.status(status).json({ error: message });
  }
}
async function setNewCardOwner(req, res) {
  const { cardId, columnId } = req.params;
  const result = await Card.findByIdAndUpdate(
    cardId,
    { owner: columnId },
    {
      new: true,
    }
  );
  if (!result) throw HttpError(404);
  res.json(result);
}

module.exports = {
  getById: controllerWrapper(getById),
  addNew: controllerWrapper(addNew),
  removeById: controllerWrapper(removeById),
  updateById: controllerWrapper(updateById),
  setNewCardOwner: controllerWrapper(setNewCardOwner),
};
