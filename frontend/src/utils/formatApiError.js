/**
 * Turn Flask/Marshmallow API error payloads into a single readable string.
 */
export default function formatApiError(data) {
  if (!data || typeof data !== "object") {
    return "So‘rov bajarilmadi. Internet yoki serverni tekshiring.";
  }

  if (data.details && typeof data.details === "object") {
    const parts = [];
    for (const [field, messages] of Object.entries(data.details)) {
      if (Array.isArray(messages)) {
        parts.push(...messages.map((m) => `${field}: ${m}`));
      } else if (typeof messages === "string") {
        parts.push(`${field}: ${messages}`);
      }
    }
    if (parts.length) {
      return parts.join(" ");
    }
  }

  if (typeof data.error === "string") return data.error;
  if (typeof data.message === "string") return data.message;
  return "Xatolik yuz berdi.";
}
