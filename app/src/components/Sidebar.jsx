import {
  LayoutDashboard,
  QrCode,
  History,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";

const qrTypes = [
  { id: "url", name: "Website URL", icon: "🔗" },
  { id: "wifi", name: "Wi-Fi", icon: "📶" },
  { id: "whatsapp", name: "WhatsApp", icon: "💬" },
  { id: "email", name: "Email", icon: "✉️" },
  { id: "phone", name: "Phone", icon: "☎️" },
  { id: "vcard", name: "vCard", icon: "👤" },
  { id: "upi", name: "UPI Payment", icon: "₹" },
];

export default function Sidebar({
  page,
  setPage,
  type,
  setType,
}) {
  return (
    <aside className="sidebar">

      <div className="side-label">
        WORKSPACE
      </div>

      <SideButton
        active={page === "dashboard"}
        icon={<LayoutDashboard />}
        text="Dashboard"
        onClick={() =>
          setPage("dashboard")
        }
      />

      <SideButton
        active={page === "generator"}
        icon={<QrCode />}
        text="Create QR"
        onClick={() =>
          setPage("generator")
        }
      />

      <div className="side-label qr-options-label">
        QR TYPES
      </div>

      <div className="sidebar-qr-options">
        {qrTypes.map((item) => (
          <button
            type="button"
            key={item.id}
            className={
              type === item.id && page === "generator"
                ? "side-qr-option active"
                : "side-qr-option"
            }
            onClick={() => {
              setType(item.id);
              setPage("generator");
            }}
          >
            <span>{item.icon}</span>
            {item.name}
          </button>
        ))}
      </div>

      <SideButton
        active={page === "history"}
        icon={<History />}
        text="QR History"
        onClick={() =>
          setPage("history")
        }
      />

      <SideButton
        active={page === "analytics"}
        icon={<BarChart3 />}
        text="Analytics"
        onClick={() =>
          setPage("analytics")
        }
      />

      <div className="side-label system-label">
        SYSTEM
      </div>

      <SideButton
        active={page === "settings"}
        icon={<Settings />}
        text="Settings"
        onClick={() =>
          setPage("settings")
        }
      />

      <div className="sidebar-bottom">

        <div className="pro-card">
          <Sparkles size={22} />

          <b>QR Studio Pro</b>

          <p>
            Create beautiful,
            professional QR codes.
          </p>
        </div>

      </div>
    </aside>
  );
}

function SideButton({
  icon,
  text,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      className={
        active
          ? "side-button active"
          : "side-button"
      }
      aria-current={active ? "page" : undefined}
      onClick={onClick}
    >
      {icon}

      <span>{text}</span>
    </button>
  );
}