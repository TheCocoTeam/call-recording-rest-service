const db = require('../models');
const Call = db.calls;

module.exports = {
  create: async (ctx, next) => {
    const requestData = ctx.request.body;

    const call = {
      to_phone_number: requestData['to-phone-number'],
      from_phone_number: requestData['from-phone-number'],
      duration: requestData['duration'],
      time_when_occurred: requestData['time-when-occurred'],
    };

    try {
      let newCall = Call.build(call);
      await newCall.save();

      ctx.response.status = 201;
      ctx.body = {result: 'success', id: newCall.id};
    } catch (exception) {
      ctx.response.status = 500;
      ctx.body = {result: 'error', message: exception.message};
    }

    next();
  },
  findAll: async (ctx, next) => {
    let order = [['createdAt', 'desc'], ['id', 'desc']];
    let limit = 10;
    let offset = 0;

    const requestData = ctx.request.body;

    if (requestData['page-number']) {
      let pageNumber = requestData['page-number'];
      offset = limit * (pageNumber - 1);
    }

    let where = {};

    const queryParams = ctx.request.query;

    if ('date' in queryParams) {
      where = {
        [db.Sequelize.Op.and]: db.sequelize.literal(
            `DATE_FORMAT(FROM_UNIXTIME(time_when_occurred), '%Y-%m-%d') = "${queryParams['date']}"`),
      };
    }

    where['record_active'] = true;

    if ('to-phone-number' in queryParams) {
      where['to_phone_number'] = queryParams['to-phone-number'];
    }

    if ('from-phone-number' in queryParams) {
      where['from_phone_number'] = queryParams['from-phone-number'];
    }

    const calls = await Call.findAndCountAll({
      attributes: {exclude: ['record_active']},
      order: order,
      limit: limit,
      offset: offset,
      where: where,
    });

    try {
      ctx.response.status = 200;
      ctx.body = {result: 'success', calls};
    } catch (exception) {
      ctx.response.status = 500;
      ctx.body = {result: 'error', message: exception.message};
    }

    next();
  },
  reportRobocall: async (ctx, next) => {
    const [numberOfAffectedRows, affectedRows] = await Call.update(
        {
          is_robocall: true,
        },
        {
          returning: true,
          where: {
            id: ctx.params.callId,
          },
        },
    );

    ctx.response.status = 200;
    ctx.body = {result: 'success'};

    next();
  },
  delete: async (ctx, next) => {
    const [numberOfAffectedRows, affectedRows] = await Call.update(
        {
          record_active: false,
        },
        {
          returning: true,
          where: {
            id: ctx.params.callId,
          },
        },
    );

    ctx.response.status = 200;
    ctx.body = {result: 'success'};

    next();
  },
};
