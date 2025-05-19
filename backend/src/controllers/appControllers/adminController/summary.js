const mongoose = require('mongoose');
const moment = require('moment');

const InvoiceModel = mongoose.model('Invoice');

const summary = async (Model, req, res) => {
  let defaultType = 'month';
  const { type } = req.query;

  if (type && ['week', 'month', 'year'].includes(type)) {
    defaultType = type;
  } else if (type) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid type',
    });
  }

  const currentDate = moment();
  let startDate = currentDate.clone().startOf(defaultType);
  let endDate = currentDate.clone().endOf(defaultType);

  const pipeline = [
    {
      $facet: {
        totalAdmins: [
          {
            $match: {
              removed: false,
              enabled: true,
            },
          },
          {
            $count: 'count',
          },
        ],
        newAdmins: [
          {
            $match: {
              removed: false,
              created: { $gte: startDate.toDate(), $lte: endDate.toDate() },
              enabled: true,
            },
          },
          {
            $count: 'count',
          },
        ],
        activeAdmins: [
          {
            $lookup: {
              from: InvoiceModel.collection.name,
              localField: '_id', // Match _id from ClientModel
              foreignField: 'admin', // Match client field in InvoiceModel
              as: 'invoice',
            },
          },
          {
            $match: {
              'invoice.removed': false,
            },
          },
          {
            $group: {
              _id: '$_id',
            },
          },
          {
            $count: 'count',
          },
        ],
      },
    },
  ];

  const aggregationResult = await Model.aggregate(pipeline);

  const result = aggregationResult[0];
  const totalAdmins = result.totalAdmins[0] ? result.totalAdmins[0].count : 0;
  const totalNewAdmins = result.newAdmins[0] ? result.newAdmins[0].count : 0;
  const activeAdmins = result.activeAdmins[0] ? result.activeAdmins[0].count : 0;

  const totalActiveAdminsPercentage = totalAdmins > 0 ? (activeAdmins / totalAdmins) * 100 : 0;
  const totalNewAdminsPercentage = totalAdmins > 0 ? (totalNewAdmins / totalAdmins) * 100 : 0;

  return res.status(200).json({
    success: true,
    result: {
      new: Math.round(totalNewAdminsPercentage),
      active: Math.round(totalActiveAdminsPercentage),
    },
    message: 'Successfully get summary of new Admins',
  });
};

module.exports = summary;