export const toList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

export const formatServiceArea = (serviceArea) => {
  if (!serviceArea) return "City-wide";
  if (typeof serviceArea === "string") return serviceArea;

  const parts = [];
  if (serviceArea.city) parts.push(serviceArea.city);
  if (serviceArea.radiusKm) parts.push(`${serviceArea.radiusKm} km radius`);
  if (serviceArea.address) parts.push(serviceArea.address);
  return parts.length ? parts.join(" • ") : "City-wide";
};

export const formatDeliveryTimings = (deliveryTimings, deliverySlots) => {
  if (deliveryTimings && typeof deliveryTimings === "object") {
    if (deliveryTimings.start || deliveryTimings.end) {
      return [deliveryTimings.start, deliveryTimings.end].filter(Boolean).join(" - ");
    }
    if (Array.isArray(deliveryTimings.slots) && deliveryTimings.slots.length) {
      return deliveryTimings.slots.join(", ");
    }
  }

  if (Array.isArray(deliverySlots) && deliverySlots.length) {
    return deliverySlots.join(", ");
  }

  return "Flexible";
};

export const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};
