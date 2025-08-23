import toast from "react-hot-toast";

export function handleApiError(error, defaultMessage) {
  if (error.response && error.response.data) {
    const { message, error: errorType, status } = error.response.data;
    const msg = message || errorType || defaultMessage;
    console.error("📌 API Error:", { status, errorType, message });
    toast.error(msg);
    return msg;
  }
  console.error("📌 Network Error:", error.message);
  toast.error(defaultMessage);
  return defaultMessage;
}
