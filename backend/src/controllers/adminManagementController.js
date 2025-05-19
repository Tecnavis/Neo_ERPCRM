// controllers/adminManagementController.js
const mongoose = require('mongoose');
const Joi = require('joi');
const { generate: uniqueId } = require('shortid');

exports.createAdmin = async (req, res) => {
  try {
    const Admin = mongoose.model('Admin');
    const AdminPassword = mongoose.model('AdminPassword');
    
    // Check if requester is owner
    const requester = await Admin.findById(req.admin._id);
    if (!requester || requester.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only owner can create new admins',
      });
    }

     const { name, email, password, country, address,role } = req.body;

    // Update validation schema
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      country: Joi.string().allow('').optional(),
      address: Joi.string().allow('').optional(),
      // phone: Joi.string().allow('').optional(),
            role: Joi.string().allow('').optional()

    });


    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email, removed: false });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

  // Create new admin with all fields
    const newAdmin = await new Admin({
      name,
      email,
      country,
      address,
    
      role: 'branch_manager',
      enabled: true
    }).save();


    // Create password
    const salt = uniqueId();
    const passwordHash = new AdminPassword().generateHash(salt, password);

    await new AdminPassword({
      password: passwordHash,
      salt,
      user: newAdmin._id,
      emailVerified: true
    }).save();

    return res.status(201).json({
      success: true,
       result: {
        _id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        country: newAdmin.country,
        address: newAdmin.address,
        phone: newAdmin.phone,
        role: newAdmin.role
      },
      message: 'Admin created successfully'
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
// --------------------------
exports.getAdmins = async (req, res) => {
  try {
    const Admin = mongoose.model('Admin');

    const admins = await Admin.find({ role: 'branch_manager', removed: false }); // ✅ filter here
    return res.status(200).json({
      success: true,
      result: admins,
      message: 'Admins fetched successfully'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
// controllers/adminManagementController.js
exports.getAdmins = async (req, res) => {
  try {
    const Admin = mongoose.model('Admin');
    // build filter from query
    const filter = { removed: false };
    if (req.query.role) filter.role = req.query.role;

    const admins = await Admin.find(filter);
    return res.status(200).json({
      success: true,
      result: admins,
      message: 'Admins fetched successfully'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

