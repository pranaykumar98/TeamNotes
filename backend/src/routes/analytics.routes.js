const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { getAnalyticsSummary } = require("../controllers/analytics.controller");

router.use(auth);

router.get("/summary", getAnalyticsSummary);

module.exports = router;
