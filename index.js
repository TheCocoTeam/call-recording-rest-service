require('dotenv').config();
const Koa = require('koa');
const router = require('@koa/router')();
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const jwtVerifier = require('./middlewares/jwtVerifier');

app.use(bodyParser());

// Set a middleware to perform jwt verification.
router.use(['/api'], jwtVerifier);

require('./routes/call.routes')(router);

app.use(router.routes());
app.listen(3000);
