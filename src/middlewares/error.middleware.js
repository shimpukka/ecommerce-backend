export function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(400).json({ error: err.message || "Something went wrong" });
  }
  