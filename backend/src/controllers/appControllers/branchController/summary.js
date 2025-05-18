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
        totalBranchs: [
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
        newBranchs: [
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
        activeBranchs: [
          {
            $lookup: {
              from: InvoiceModel.collection.name,
              localField: '_id', // Match _id from ClientModel
              foreignField: 'branch', // Match client field in InvoiceModel
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
  const totalBranchs = result.totalBranchs[0] ? result.totalBranchs[0].count : 0;
  const totalNewBranchs = result.newBranchs[0] ? result.newBranchs[0].count : 0;
  const activeBranchs = result.activeBranchs[0] ? result.activeBranchs[0].count : 0;

  const totalActiveBranchsPercentage = totalBranchs > 0 ? (activeBranchs / totalBranchs) * 100 : 0;
  const totalNewBranchsPercentage = totalBranchs > 0 ? (totalNewBranchs / totalBranchs) * 100 : 0;

  return res.status(200).json({
    success: true,
    result: {
      new: Math.round(totalNewBranchsPercentage),
      active: Math.round(totalActiveBranchsPercentage),
    },
    message: 'Successfully get summary of new branchs',
  });
};

module.exports = summary;
