const express = require("express");
const {
  register,
  login,
  refresh,
  getCurrent,
  logout,
  updateTheme,
  updateProfile,
  sendHelpRequest,
} = require("../../controllers/auth");

const validateBody = require("../../middlewares/validateBody");
const authenticate = require("../../middlewares/authenticate");
const schemas = require("../../models/validation-schemas/user-validation");
const imageUpload = require("../../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), register);
router.post("/login", validateBody(schemas.loginSchema), login);
router.post("/refresh", validateBody(schemas.refreshSchema), refresh);
router.get("/current", authenticate, getCurrent);
router.post("/logout", authenticate, logout);
router.patch(
  "/theme",
  authenticate,
  validateBody(schemas.themeSchema),
  updateTheme
);
router.put(
  "/profile",
  authenticate,
  imageUpload.single("avatarURL"),
  validateBody(schemas.registerSchema),
  updateProfile
);

router.post(
  "/help",
  authenticate,
  validateBody(schemas.helpSchema),
  sendHelpRequest
);

module.exports = router;
