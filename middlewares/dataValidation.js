const db = require('../models');
const Call = db.calls;

module.exports = {
  createRequest: async (ctx, next) => {
    const requestData = ctx.request.body;

    if (!requestData['to-phone-number']) {
      ctx.throw(400, 'to-phone-number can not be null');
    }

    if (!requestData['from-phone-number']) {
      ctx.throw(400, 'from-phone-number can not be null');
    }

    if (!requestData['duration']) {
      ctx.throw(400, 'duration can not be null');
    }

    if (!requestData['time-when-occurred']) {
      ctx.throw(400, 'time-when-occurred can not be null');
    }

    await next();
  },
  findAllRequest: async (ctx, next) => {
    const requestData = ctx.request.body;

    if (requestData['page-number']) {
      let pageNumber = requestData['page-number'];

      if (isNaN(pageNumber)) {
        ctx.throw(400, 'page-number must be a number');
      }

      if (pageNumber < 1) {
        ctx.throw(400,
            'page-number must be a number between 1 and the maximum page number');
      }
    }

    const queryParams = ctx.request.query;

    if ('date' in queryParams) {
      if (!queryParams['date']) {
        ctx.throw(400, 'date can not be empty');
      }
    }

    if ('to-phone-number' in queryParams) {
      if (!queryParams['to-phone-number']) {
        ctx.throw(400, 'to-phone-number can not be empty');
      }
    }

    if ('from-phone-number' in queryParams) {
      if (!queryParams['from-phone-number']) {
        ctx.throw(400, 'from-phone-number can not be empty');
      }
    }

    await next();
  },
  reportRobocallRequest: async (ctx, next) => {
    const result = await Call.findOne({
      where: {
        id: ctx.params.callId,
        record_active: true,
      },
    });

    if (typeof result === 'undefined' || result === null) {
      ctx.throw(404, 'Record not found, can not report as robocall');
    }

    await next();
  },
  deleteRequest: async (ctx, next) => {
    const result = await Call.findOne({
      where: {
        id: ctx.params.callId,
        record_active: true,
      },
    });

    if (typeof result === 'undefined' || result === null) {
      ctx.throw(404, 'Record not found, can not delete');
    }

    await next();
  },
};
