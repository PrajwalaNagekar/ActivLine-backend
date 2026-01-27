export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true, // 🔥 VERY IMPORTANT for form-data
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map(d => d.message).join(", "),
      data: null,
    });
  }

  req.body = value;
  next();
};
