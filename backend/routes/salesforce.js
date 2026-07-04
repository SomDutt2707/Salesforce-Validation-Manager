const express = require("express");

const salesforceController = require("../controllers/salesforceController");

const router = express.Router();

/*
=========================================
Login
=========================================
*/

router.get("/login", salesforceController.login);

/*
=========================================
OAuth Callback
=========================================
*/

router.get("/auth/callback", salesforceController.callback);

/*
=========================================
Status
=========================================
*/

router.get("/status", salesforceController.status);

/*
=========================================
Validation Rules
=========================================
*/

router.get("/validation-rules", salesforceController.getValidationRules);

/*
=========================================
Toggle Validation Rule
=========================================
*/

router.post(
  "/toggle-validation-rule",
  salesforceController.toggleValidationRule,
);

module.exports = router;
