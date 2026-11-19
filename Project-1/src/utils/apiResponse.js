export function successResponse(message, data = null) {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(message, data = null) {
  return {
    success: false,
    message,
    data,
  };
}