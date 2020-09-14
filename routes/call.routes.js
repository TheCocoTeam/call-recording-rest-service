const dataValidation = require('../middlewares/dataValidation');

module.exports = (router) => {
  const calls = require('../controllers/call.controller.js');

  // Create a call recording
  router.post('/api/v1/calls', dataValidation.createRequest, calls.create);

  // Get call recordings by Date and time, name, UserId, fromNo and supports pagination
  router.get('/api/v1/calls', dataValidation.findAllRequest, calls.findAll);

  // Update a call recording to mark as a robocall
  router.put('/api/v1/calls/:callId/actions/report-robocall',
      dataValidation.reportRobocallRequest, calls.reportRobocall);

  // Delete a call recording
  router.delete('/api/v1/calls/:callId', dataValidation.deleteRequest,
      calls.delete);
};
