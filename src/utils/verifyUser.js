import jwt from 'jsonwebtoken';

const verifyUser = (request, requireAuth = true) => {
  // The ternary operator is to determine where the token is.
  // Unlike queries and mutations that use HTTP, subscriptions use
  // web sockets. In that event, the token comes on a different
  // object on the request.
  const httpToken = request.request
    ? request.request.headers.authorization
    : undefined;
  const webSocketToken = request.connection
    ? request.connection.context.Authorization
    : undefined;
  // If the request.request object exists, that means it was an
  // http request. If not, it's a web socket. So, we'll set the
  // headerToken accordingly.
  const headerToken = request.request
    ? httpToken
    : webSocketToken;

  if (headerToken) {
    const token = headerToken.replace("Bearer ", "");
    const decoded = jwt.verify(token, "supersecretsecret");
    return decoded.userId;
  }
  // Unless verifyUser has false passed in to requireAuth,
  // we'll throw the error.
  if (requireAuth) {
    throw new Error("Authorization required");
  }
  // If requireAuth is set to false, we'll have the function
  // return null. (See the post method in Query.js for explanation
  // for returning null.)
  return null;
};

export { verifyUser as default };