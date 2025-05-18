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
        totalServices: [
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
        newServices: [
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
        activeServices: [
          {
            $lookup: {
              from: InvoiceModel.collection.name,
              localField: '_id', // Match _id from ClientModel
              foreignField: 'service', // Match client field in InvoiceModel
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
  const totalServices = result.totalServices[0] ? result.totalServices[0].count : 0;
  const totalNewServices = result.newServices[0] ? result.newServices[0].count : 0;
  const activeServices = result.activeServices[0] ? result.activeServices[0].count : 0;

  const totalActiveServicesPercentage = totalServices > 0 ? (activeServices / totalServices) * 100 : 0;
  const totalNewServicesPercentage = totalServices > 0 ? (totalNewServices / totalServices) * 100 : 0;

  return res.status(200).json({
    success: true,
    result: {
      new: Math.round(totalNewServicesPercentage),
      active: Math.round(totalActiveServicesPercentage),
    },
    message: 'Successfully get summary of new Service',
  });
};

module.exports = summary;
