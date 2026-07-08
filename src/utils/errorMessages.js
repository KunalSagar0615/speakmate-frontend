const map = {
  400: "Request failed. Please check your input.",
  401: "Unauthorized. Please login again.",
  403: "Forbidden. You do not have access.",
  404: "Requested resource not found.",
  500: "Internal server error. Please try later.",
};

export const getErrorMessage = (error) => {
  if (!error?.response) {
    return "Network error. Check your internet connection.";
  }
  const status = error.response.status;
  const text = error.response.data?.message || error.response.data?.error;
  if (text) {
    if (text.toLowerCase().includes("otp")) return "Invalid or expired OTP.";
    if (text.toLowerCase().includes("gemini")) return "AI service is currently unavailable.";
    return text;
  }
  return map[status] || "Something went wrong. Please try again.";
};
