const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    const status = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    const data = err.data || null;
  
    res.status(status).json({ message, data });
  };
  
  module.exports = errorHandler;