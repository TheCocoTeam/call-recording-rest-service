const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: process.env.OKTA_ISSUER,
  clientId: process.env.OKTA_CLIENT_ID,
});

module.exports = async (ctx, next) => {
  const {authorization} = ctx.headers;

  if (!authorization) {
    ctx.throw(401);
  }

  const [authType, token] = authorization.trim().split(' ');

  try {
    const {claims} = await oktaJwtVerifier.verifyAccessToken(token,
        process.env.OKTA_AUDIENCE);

    if (!claims) {
      ctx.throw(401);
    }

    if (!claims.scp.includes('api')) {
      ctx.throw(401);
    }
  } catch (err) {
    console.dir(err);
    ctx.throw(401);
  }

  await next();
};
