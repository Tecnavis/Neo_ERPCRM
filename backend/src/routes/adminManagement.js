// routes/adminManagement.js
const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const adminManagementController = require('@/controllers/adminManagementController');
const adminAuth = require('@/controllers/coreControllers/adminAuth');

const router = express.Router();

router.post('/admin/create', 
  adminAuth.isValidAuthToken,
  catchErrors(adminManagementController.createAdmin)
);

module.exports = router;