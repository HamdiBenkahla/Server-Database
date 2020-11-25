const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers["x-access-token"].split(' ')[1];
    const decodedToken = jwt.verify(token, 'HAMDI_IS_DYING');
    const id = decodedToken.id;
    console.log(id)
    if (req.body.id && req.body.id !== id) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};