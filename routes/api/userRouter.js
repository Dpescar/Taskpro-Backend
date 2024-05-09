const express = require("express");
const validateBody = require("../../middlewares/validateBody");
const authenticate = require("../../middlewares/authenticate");
const userValidation = require("../../models/validation/userValidation");
const imageUpload = require("../../middlewares/uploadMiddleware");

const router = express.Router();
const {
  register,
  login,
  refresh,
  getCurrent,
  logout,
  updateTheme,
  updateProfile,
  sendHelpRequest,
} = require("../../controllers/userController");

router.post("/register", validateBody(userValidation.registerSchema), register);
router.post("/login", validateBody(userValidation.loginSchema), login);
router.post("/refresh", validateBody(userValidation.refreshSchema), refresh);
router.get("/current", authenticate, getCurrent);
router.post("/logout", authenticate, logout);
router.patch(
  "/theme",
  authenticate,
  validateBody(userValidation.themeSchema),
  updateTheme
);
router.put(
  "/profile",
  authenticate,
  imageUpload.single("avatarURL"),
  validateBody(userValidation.registerSchema),
  updateProfile
);

router.post(
  "/help",
  authenticate,
  validateBody(userValidation.helpSchema),
  sendHelpRequest
);

module.exports = router;
