export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'נתונים חסרים או שגויים', details: err.message });
  }
  if (err.code === 11000) {
    return res.status(400).json({ message: 'ערך זה כבר קיים במערכת' });
  }
  res.status(err.status || 500).json({ message: err.message || 'שגיאת שרת' });
}
