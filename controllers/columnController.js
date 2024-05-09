const HttpError = require("../helpers/HttpError");
const controllerWrapper = require("../helpers/decorators");
const Card = require("../models/schemas/cardSchema");
const Column = require("../models/schemas/columnSchema");

async function addNew(req, res) {
  const { dashboardId } = req.params;

  try {
    const existingColumn = await Column.findOne({
      owner: dashboardId,
      title: req.body.title,
    });
    if (existingColumn) {
      return res.status(400).json({
        error: "A column with the same title already exists in this dashboard",
      });
    }
    const newColumn = await Column.create({
      ...req.body,
      owner: dashboardId,
    });
    res.status(201).json(newColumn);
  } catch (error) {
    const httpError = new HttpError("Failed to add new column", 500);
    res.status(httpError.status).json({ error: httpError.message });
  }
}

async function getById(req, res) {
  try {
    const { columnId } = req.params;
    const column = await Column.findById(columnId);
    if (!column) {
      return res.status(404).json({ error: "Column not found" });
    }
    const cards = await Card.find({ owner: column._id });
    if (!cards || cards.length === 0) {
      return res.status(404).json({ error: "No cards found for this column" });
    }
    res.json({
      column,
      cards,
    });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Failed to fetch column";
    res.status(status).json({ error: message });
  }
}

async function updateById(req, res) {
  try {
    const { columnId } = req.params;
    const result = await Column.findByIdAndUpdate(columnId, req.body, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ error: "Column not found" });
    }
    res.json(result);
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Failed to update column";
    res.status(status).json({ error: message });
  }
}
async function removeById(req, res) {
  try {
    const { columnId } = req.params;
    const result = await Column.findByIdAndRemove(columnId);
    if (!result) {
      return res.status(404).json({ error: "Column not found" });
    }
    res.json({ message: "Column deleted successfully", deletedColumn: result });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Failed to remove column";
    res.status(status).json({ error: message });
  }
}

module.exports = {
  getById: controllerWrapper(getById),
  addNew: controllerWrapper(addNew),
  removeById: controllerWrapper(removeById),
  updateById: controllerWrapper(updateById),
};
