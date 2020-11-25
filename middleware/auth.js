const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    const { id, email } = decodedToken;
    if (!(id && email)) {
      throw Error('error');
    } else {
      next();
    }
  } catch (_error) {
    res.status(401).json({
      error: new Error('Invalid request!'),
    });
  }
};
