export const Logger = (req, res, next) => {
  console.log(
    `[${new Date().toDateString()}] ${req.method} ${req.originalUrl}`,
  );
  next();
};
