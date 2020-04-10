import jwt from 'jsonwebtoken';

const authentication = {
  verifyUser: (req, res, next) => {
    const token = req.headers.authorization || req.headers['x-access-token'];

    if (!token) {
      return res.status(403).send({
        status: 'Error',
        message: 'Not Authorized'
      });
    }

    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).send({
          status: 'Error',
          message: 'Invalid token'
        });
      }

      req.decoded = decoded;
      next();
    });
  },

  verifyAdmin: (req, res, next) => {
    if (req.decoded && req.decoded.role === 'ADMIN') return next();

    return res.status(401).send({
      status: 'Error', 
      message: 'Admin access only' 
    });
  },

  verifyStudent: (req, res, next) => {
    if (req.decoded && req.decoded.role === 'STUDENT') return next();

    return res.status(401).send({
      status: 'Error', 
      message: 'Student access only' 
    });
  },

  verifyLecturer: (req, res, next) => {
    if (req.decoded && req.decoded.role === 'LECTURER') return next();

    return res.status(401).send({
      status: 'Error', 
      message: 'Lecturer access only' 
    });
  }
};

export default authentication;
