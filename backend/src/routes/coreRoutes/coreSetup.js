// routes/coreRoutes/coreSetup.js
const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const setupController = require('@/controllers/coreControllers/setup');

const router = express.Router();

router.route('/setup').post(catchErrors(setupController.setup)); // Note the .setup

module.exports = router;