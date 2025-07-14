const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log error stack ke konsol untuk debugging

  // Kadang error sudah memiliki status code, jika tidak, defaultnya 500 (Internal Server Error)
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    // Tampilkan stack trace hanya jika kita tidak di lingkungan produksi
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = {
  errorHandler,
};