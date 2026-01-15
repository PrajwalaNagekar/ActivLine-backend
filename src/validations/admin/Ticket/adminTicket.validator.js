export const validateAdminTickets = (body) => {
  const errors = [];

  if (!body.page || isNaN(body.page)) {
    errors.push("page is required and must be a number");
  }

  if (!body.perPage || isNaN(body.perPage)) {
    errors.push("perPage is required and must be a number");
  }

  if (body.perPage > 500) {
    errors.push("perPage cannot exceed 500");
  }

  if (body.status && !Array.isArray(body.status)) {
    errors.push("status must be an array");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
