export const qrTypes = [
  {
    id: "url",
    name: "Website URL",
    icon: "🔗",
  },
  {
    id: "wifi",
    name: "Wi-Fi",
    icon: "📶",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "💬",
  },
  {
    id: "email",
    name: "Email",
    icon: "✉️",
  },
  {
    id: "phone",
    name: "Phone",
    icon: "☎️",
  },
  {
    id: "vcard",
    name: "vCard",
    icon: "👤",
  },
  {
    id: "upi",
    name: "UPI Payment",
    icon: "₹",
  },
];

export function getTypeName(type) {
  return (
    qrTypes.find(
      (item) => item.id === type
    )?.name || "QR Code"
  );
}

export function getTypeIcon(type) {
  return (
    qrTypes.find(
      (item) => item.id === type
    )?.icon || "▣"
  );
}