const Bill = require('../models/Bill');
const Patient = require('../models/Patient');
const User = require('../models/User');
const { Op } = require('sequelize');

// Get all bills
exports.getAllBills = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, patientId } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    
    if (status) whereClause.status = status;
    if (patientId) whereClause.patientId = patientId;

    // Role-based filtering
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ where: { userId: req.user.id } });
      if (patient) whereClause.patientId = patient.id;
    }

    const { count, rows } = await Bill.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['billDate', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        bills: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get bills error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bills',
      error: error.message
    });
  }
};

// Get single bill
exports.getBillById = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await Bill.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        }
      ]
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    res.json({
      success: true,
      data: bill
    });
  } catch (error) {
    console.error('Get bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bill',
      error: error.message
    });
  }
};

// Create bill
exports.createBill = async (req, res) => {
  try {
    const { patientId, services, dueDate, notes } = req.body;

    // Check if patient exists
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Calculate total amount from services
    let totalAmount = 0;
    if (services && Array.isArray(services)) {
      totalAmount = services.reduce((sum, service) => {
        return sum + (service.quantity * service.price);
      }, 0);
    }

    // Create bill
    const bill = await Bill.create({
      patientId,
      totalAmount,
      balanceAmount: totalAmount,
      services,
      dueDate,
      notes
    });

    const fullBill = await Bill.findByPk(bill.id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      data: fullBill
    });
  } catch (error) {
    console.error('Create bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create bill',
      error: error.message
    });
  }
};

// Update bill
exports.updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { services, dueDate, notes, status } = req.body;

    const bill = await Bill.findByPk(id);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    // Recalculate total if services updated
    let updateData = { dueDate, notes, status };
    
    if (services && Array.isArray(services)) {
      const totalAmount = services.reduce((sum, service) => {
        return sum + (service.quantity * service.price);
      }, 0);
      
      updateData.services = services;
      updateData.totalAmount = totalAmount;
      updateData.balanceAmount = totalAmount - bill.paidAmount;
    }

    await bill.update(updateData);

    const updatedBill = await Bill.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Bill updated successfully',
      data: updatedBill
    });
  } catch (error) {
    console.error('Update bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update bill',
      error: error.message
    });
  }
};

// Process payment
exports.processPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod } = req.body;

    const bill = await Bill.findByPk(id);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    if (amount <= 0 || amount > bill.balanceAmount) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount'
      });
    }

    const newPaidAmount = parseFloat(bill.paidAmount) + parseFloat(amount);
    const newBalanceAmount = parseFloat(bill.totalAmount) - newPaidAmount;

    let newStatus = bill.status;
    if (newBalanceAmount === 0) {
      newStatus = 'paid';
    } else if (newPaidAmount > 0 && newBalanceAmount > 0) {
      newStatus = 'partially_paid';
    }

    await bill.update({
      paidAmount: newPaidAmount,
      balanceAmount: newBalanceAmount,
      status: newStatus,
      paymentMethod
    });

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: bill
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message
    });
  }
};

// Delete bill
exports.deleteBill = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await Bill.findByPk(id);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    // Don't allow deletion of paid bills
    if (bill.status === 'paid' || bill.paidAmount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a bill that has been paid'
      });
    }

    await bill.destroy();

    res.json({
      success: true,
      message: 'Bill deleted successfully'
    });
  } catch (error) {
    console.error('Delete bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete bill',
      error: error.message
    });
  }
};

// Get billing statistics
exports.getBillingStats = async (req, res) => {
  try {
    const totalRevenue = await Bill.sum('paidAmount');
    const pendingAmount = await Bill.sum('balanceAmount', {
      where: { status: { [Op.in]: ['pending', 'partially_paid', 'overdue'] } }
    });
    
    const totalBills = await Bill.count();
    const paidBills = await Bill.count({ where: { status: 'paid' } });
    const pendingBills = await Bill.count({ where: { status: 'pending' } });
    const overdueBills = await Bill.count({ where: { status: 'overdue' } });

    res.json({
      success: true,
      data: {
        totalRevenue: totalRevenue || 0,
        pendingAmount: pendingAmount || 0,
        totalBills,
        paidBills,
        pendingBills,
        overdueBills
      }
    });
  } catch (error) {
    console.error('Get billing stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get billing statistics',
      error: error.message
    });
  }
};