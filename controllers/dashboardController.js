const HttpError = require("../helpers/HttpError");
const controllerWrapper = require("../helpers/decorators");
const Dashboard = require("../models/schemas/dashboardSchema");
const Column = require("../models/schemas/columnSchema");
const Card = require("../models/schemas/cardSchema");

async function addNew(req, res) {
  const { _id: owner } = req.user;

  try {
    const result = await Dashboard.create({ ...req.body, owner });
    res.status(201).json(result);
  } catch (error) {
    const httpError = new HttpError("Failed to add new dashboard", 500);
    res.status(httpError.status).json({ error: httpError.message });
  }
}

async function getAll(req, res) {
  const { _id: owner } = req.user;

  try {
    const result = await Dashboard.find(
      { owner },
      { createdAt: 0, updatedAt: 0 }
    );
    res.json(result);
  } catch (error) {
    const httpError = new HttpError("Failed to retrieve dashboards", 500);
    res.status(httpError.status).json({ error: httpError.message });
  }
}
async function getById(req, res) {
  try {
    const { dashboardId } = req.params;
    const dashboard = await Dashboard.findById(dashboardId);

    if (!dashboard) {
      return res.status(404).json({ error: "Dashboard not found" });
    }
    const columns = await Column.find({ owner: dashboard._id });
    let columnsWithCards = [];
    if (columns.length > 0) {
      columnsWithCards = await Column.aggregate([
        {
          $match: { _id: { $in: columns.map((col) => col._id) } },
        },
        {
          $lookup: {
            from: "cards",
            localField: "_id",
            foreignField: "owner",
            as: "cards",
          },
        },
      ]);
    }

    res.json({
      dashboard,
      columns: columnsWithCards,
    });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Failed to get dashboard";
    res.status(status).json({ error: message });
  }
}

async function removeById(req, res) {
  try {
    const { dashboardId } = req.params;
    const deletedDashboard = await Dashboard.findByIdAndDelete(dashboardId);
    if (!deletedDashboard) {
      return res.status(404).json({ error: "Dashboard not found" });
    }

    const dashboardColumns = await Column.find({ owner: dashboardId });
    const deletedColumns = await Column.deleteMany({ owner: dashboardId });
    const columnIds = dashboardColumns.map((column) => column._id);
    const deletedCards = await Card.deleteMany({ owner: { $in: columnIds } });

    res.json({
      message: `Dashboard with ID ${dashboardId} was successfully removed`,
      deletedDashboard,
      deletedColumns,
      deletedCards,
    });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Failed to remove dashboard";
    res.status(status).json({ error: message });
  }
}

async function updateById(req, res) {
  try {
    const { dashboardId } = req.params;
    const updatedDashboard = await Dashboard.findByIdAndUpdate(
      dashboardId,
      req.body,
      { new: true }
    );

    if (!updatedDashboard) {
      return res.status(404).json({ error: "Dashboard not found" });
    }
    res.json(updatedDashboard);
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Failed to update dashboard";
    res.status(status).json({ error: message });
  }
}
async function updateCurrentDashboard(req, res) {
  try {
    const { dashboardId } = req.params;
    const updatedDashboard = await Dashboard.findByIdAndUpdate(
      dashboardId,
      { ...req.body },
      { new: true }
    );

    if (!updatedDashboard) {
      return res.status(404).json({ error: "Dashboard not found" });
    }

    res.json(updatedDashboard);
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "Failed to update current dashboard";
    res.status(status).json({ error: message });
  }
}

module.exports = {
  getAll: controllerWrapper(getAll),
  getById: controllerWrapper(getById),
  addNew: controllerWrapper(addNew),
  removeById: controllerWrapper(removeById),
  updateById: controllerWrapper(updateById),
  updateCurrentDashboard: controllerWrapper(updateCurrentDashboard),
};
