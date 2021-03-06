const express = require('express');
const router = express.Router();

const indexController = require("../controllers/indexController");

/* GET home page. */
router.get('/', indexController.home);

/* GET detail page */
router.get('/detail', indexController.detail);

/* GET payment status page */
router.get('/payment', indexController.paymentStatus);

/* POST webhooks */
router.post('/webhooks', indexController.webhooks);

/* POST purchase */
router.post('/purchase', indexController.purchase);

module.exports = router;
