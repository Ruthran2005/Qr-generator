import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  Moon,
  Sun,
  History as HistoryIcon,
  Download,
  Trash2,
  RotateCcw,
  Upload,
  LayoutDashboard,
  QrCode,
  BarChart3,
  Settings,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";

import { toPng, toSvg } from "html-to-image";
import { jsPDF } from "jspdf";

import "./App.css";

const qrTypes = [
  ["url", "Website URL", "🔗"],
  ["wifi", "Wi-Fi", "📶"],
  ["whatsapp", "WhatsApp", "💬"],
  ["email", "Email", "✉️"],
  ["phone", "Phone", "☎️"],
  ["vcard", "vCard", "👤"],
  ["upi", "UPI Payment", "₹"],
];

const defaultData = {
  url: "https://example.com",

  ssid: "",
  wifiPassword: "",
  security: "WPA",
  hidden: false,

  whatsappPhone: "",
  whatsappMessage: "Hello!",

  email: "",
  emailSubject: "",
  emailBody: "",

  phone: "",

  name: "",
  company: "",
  jobTitle: "",
  vcardPhone: "",
  vcardEmail: "",
  website: "",
  address: "",

  vpa: "",
  payeeName: "",
  amount: "",
  note: "",
};

export default function App() {
  const [dark, setDark] = useState(
    localStorage.getItem("qr-theme") === "dark"
  );

  const [page, setPage] = useState("generator");
  const [type, setType] = useState("url");

  const [data, setData] = useState(defaultData);

  const [custom, setCustom] = useState({
    size: 280,
    fg: "#111827",
    bg: "#ffffff",
    margin: 2,
    logoSize: 20,
  });

  const [logo, setLogo] = useState(null);

  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("qr-history")) || [];
    } catch {
      return [];
    }
  });

  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");

  const qrRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);

    localStorage.setItem(
      "qr-theme",
      dark ? "dark" : "light"
    );
  }, [dark]);

  function updateData(key, value) {
    setData((old) => ({
      ...old,
      [key]: value,
    }));
  }

  function notify(message) {
    setToast(message);
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => setToast(""), 2400);
  }

  function getPayload() {
    switch (type) {
      case "url":
        return data.url;

      case "wifi":
        return `WIFI:T:${data.security};S:${escapeWifi(
          data.ssid
        )};P:${escapeWifi(
          data.wifiPassword
        )};H:${data.hidden ? "true" : "false"};;`;

      case "whatsapp":
        return `https://wa.me/${data.whatsappPhone.replace(
          /\D/g,
          ""
        )}?text=${encodeURIComponent(
          data.whatsappMessage
        )}`;

      case "email":
        return `mailto:${data.email}?subject=${encodeURIComponent(
          data.emailSubject
        )}&body=${encodeURIComponent(
          data.emailBody
        )}`;

      case "phone":
        return `tel:${data.phone}`;

      case "vcard":
        return `BEGIN:VCARD
VERSION:3.0
FN:${data.name}
ORG:${data.company}
TITLE:${data.jobTitle}
TEL:${data.vcardPhone}
EMAIL:${data.vcardEmail}
URL:${data.website}
ADR:;;${data.address}
END:VCARD`;

      case "upi": {
        const params = new URLSearchParams();

        params.set("pa", data.vpa);
        params.set("pn", data.payeeName);
        params.set("cu", "INR");

        if (data.amount) {
          params.set("am", data.amount);
        }

        if (data.note) {
          params.set("tn", data.note);
        }

        return `upi://pay?${params.toString()}`;
      }

      default:
        return "";
    }
  }

  const payload = getPayload();

  function saveQR() {
    if (!qrRef.current) return;

    const canvas =
      qrRef.current.querySelector("canvas");

    if (!canvas) return;

    const item = {
      id: Date.now(),
      type,
      data,
      custom,
      logo,
      payload,
      image: canvas.toDataURL("image/png"),
      date: new Date().toISOString(),
    };

    const updated = [item, ...history].slice(
      0,
      50
    );

    setHistory(updated);

    localStorage.setItem(
      "qr-history",
      JSON.stringify(updated)
    );

    notify("QR code saved to history");
  }

  function deleteQR(id) {
    const updated = history.filter(
      (item) => item.id !== id
    );

    setHistory(updated);

    localStorage.setItem(
      "qr-history",
      JSON.stringify(updated)
    );
  }

  function clearHistory() {
    if (
      history.length > 0 &&
      !window.confirm("Clear all saved QR codes?")
    ) {
      return;
    }

    setHistory([]);

    localStorage.removeItem("qr-history");
    notify("History cleared");
  }

  function resetGenerator() {
    setType("url");
    setData(defaultData);
    setCustom({
      size: 280,
      fg: "#111827",
      bg: "#ffffff",
      margin: 2,
      logoSize: 20,
    });
    setLogo(null);
    notify("Generator reset");
  }

  function restoreQR(item) {
    setType(item.type);
    setData(item.data);
    setCustom(item.custom);
    setLogo(item.logo);

    setPage("generator");
  }

  function uploadLogo(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setLogo(reader.result);
    };

    reader.readAsDataURL(file);
  }

  async function downloadPNG() {
    if (!qrRef.current) return;

    const image = await toPng(qrRef.current, {
      pixelRatio: 3,
      backgroundColor: "#ffffff",
    });

    download(image, "qr-studio.png");
  }

  async function downloadSVG() {
    if (!qrRef.current) return;

    const image = await toSvg(qrRef.current, {
      backgroundColor: "#ffffff",
    });

    download(image, "qr-studio.svg");
  }

  async function downloadPDF() {
    if (!qrRef.current) return;

    const image = await toPng(qrRef.current, {
      pixelRatio: 3,
      backgroundColor: "#ffffff",
    });

    const pdf = new jsPDF();

    pdf.addImage(
      image,
      "PNG",
      35,
      45,
      140,
      140
    );

    pdf.save("qr-studio.pdf");
  }

  async function copyQR() {
    try {
      await navigator.clipboard.writeText(
        payload
      );

      setCopied(true);
      notify("Payload copied to clipboard");

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      notify("Clipboard access is unavailable");
    }
  }

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">

        <div className="brand">

          <div className="brand-icon">
            <QrCode size={22} />
          </div>

          <div>
            <h2>QR Studio Pro</h2>
            <p>Smart QR Generator</p>
          </div>

        </div>

        <div className="header-right">

          <button
            className="history-button"
            onClick={() => setPage("history")}
          >
            <HistoryIcon size={18} />
            History
            <span>{history.length}</span>
          </button>

          <button
            className="theme-button"
            onClick={() => setDark(!dark)}
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            title={dark ? "Use light theme" : "Use dark theme"}
          >
            {dark ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

        </div>

      </header>

      <div className="body">

        {/* SIDEBAR */}

        <aside className="sidebar">

          <div className="side-label">
            WORKSPACE
          </div>

          <SideButton
            active={page === "dashboard"}
            icon={<LayoutDashboard />}
            text="Dashboard"
            onClick={() => setPage("dashboard")}
          />

          <SideButton
            active={page === "generator"}
            icon={<QrCode />}
            text="Create QR"
            onClick={() => setPage("generator")}
          />

          <div className="side-label qr-options-label">
            QR TYPES
          </div>

          <div className="sidebar-qr-options">
            {qrTypes.map((item) => (
              <button
                type="button"
                key={item[0]}
                className={
                  type === item[0] && page === "generator"
                    ? "side-qr-option active"
                    : "side-qr-option"
                }
                onClick={() => {
                  setType(item[0]);
                  setPage("generator");
                }}
              >
                <span>{item[2]}</span>
                {item[1]}
              </button>
            ))}
          </div>

          <SideButton
            active={page === "history"}
            icon={<HistoryIcon />}
            text="QR History"
            onClick={() => setPage("history")}
          />

          <SideButton
            active={page === "analytics"}
            icon={<BarChart3 />}
            text="Analytics"
            onClick={() => setPage("analytics")}
          />

          <div className="side-label">
            SYSTEM
          </div>

          <SideButton
            active={page === "settings"}
            icon={<Settings />}
            text="Settings"
            onClick={() => setPage("settings")}
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

        {/* CONTENT */}

        <main className="content">

          {page === "dashboard" && (
            <Dashboard
              history={history}
              setPage={setPage}
            />
          )}

          {page === "analytics" && (
            <Analytics history={history} />
          )}

          {page === "history" && (
            <HistoryPage
              history={history}
              restoreQR={restoreQR}
              deleteQR={deleteQR}
              clearHistory={clearHistory}
            />
          )}

          {page === "settings" && (
            <SettingsPage
              dark={dark}
              setDark={setDark}
              resetGenerator={resetGenerator}
              clearHistory={clearHistory}
              historyCount={history.length}
            />
          )}

          {page === "generator" && (
            <>
              <div className="mobile-types">

                {qrTypes.map((item) => (
                  <button
                    key={item[0]}
                    className={
                      type === item[0]
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setType(item[0])
                    }
                  >
                    {item[2]} {item[1]}
                  </button>
                ))}

              </div>

              <div className="page-heading">

                <div>
                  <div className="eyebrow">
                    QR GENERATOR
                  </div>

                  <h1>
                    Create your QR code
                  </h1>

                  <p>
                    Build, customize and
                    download professional
                    QR codes in seconds.
                  </p>
                </div>

                <button
                  className="primary-button"
                  onClick={saveQR}
                >
                  + Save QR
                </button>

              </div>

              <div className="generator-layout">

                <div className="left">

                  <div className="card">

                    <div className="card-heading">

                      <div className="heading-icon">
                        {getTypeIcon(type)}
                      </div>

                      <div>
                        <h3>
                          {getTypeName(type)}
                        </h3>

                        <p>
                          Enter your information
                          below.
                        </p>
                      </div>

                    </div>

                    <QRForm
                      type={type}
                      data={data}
                      updateData={updateData}
                    />

                  </div>

                  <Customizer
                    custom={custom}
                    setCustom={setCustom}
                    logo={logo}
                    uploadLogo={uploadLogo}
                    setLogo={setLogo}
                  />

                </div>

                <div className="right">

                  <div className="card preview-card">

                    <div className="preview-heading">

                      <div>
                        <h3>
                          Live Preview
                        </h3>

                        <p>
                          Your QR updates
                          automatically
                        </p>
                      </div>

                      <div className="live">
                        ● LIVE
                      </div>

                    </div>

                    <div className="qr-stage">

                      <div
                        ref={qrRef}
                        className="qr-export"
                        style={{
                          background:
                            custom.bg,
                          padding:
                            custom.margin * 5,
                        }}
                      >

                        <QRCodeCanvas
                          value={
                            payload ||
                            "https://example.com"
                          }
                          size={custom.size}
                          fgColor={custom.fg}
                          bgColor={custom.bg}
                          level="H"
                          imageSettings={
                            logo
                              ? {
                                  src: logo,
                                  width:
                                    custom.size *
                                    (custom.logoSize /
                                      100),
                                  height:
                                    custom.size *
                                    (custom.logoSize /
                                      100),
                                  excavate: true,
                                }
                              : undefined
                          }
                        />

                      </div>

                    </div>

                    <div className="scan-text">
                      Scan to open
                    </div>

                    <details className="payload-details">
                      <summary>View encoded payload</summary>
                      <code>{payload || "No payload yet"}</code>
                    </details>

                    <div className="action-row">

                      <button
                        onClick={downloadPNG}
                      >
                        <Download size={17} />
                        PNG
                      </button>

                      <button
                        onClick={downloadSVG}
                      >
                        <Download size={17} />
                        SVG
                      </button>

                      <button
                        onClick={downloadPDF}
                      >
                        <Download size={17} />
                        PDF
                      </button>

                      <button
                        onClick={copyQR}
                      >
                        {copied ? (
                          <Check size={17} />
                        ) : (
                          <Copy size={17} />
                        )}

                        {copied
                          ? "Copied"
                          : "Copy"}
                      </button>

                    </div>

                    <button
                      className="save-large"
                      onClick={saveQR}
                    >
                      Save QR Code
                    </button>

                  </div>

                </div>

              </div>
            </>
          )}

        </main>

      </div>

      {toast && (
        <div className="toast" role="status">
          <Check size={16} />
          {toast}
        </div>
      )}

    </div>
  );
}


/* ---------------- FORM ---------------- */

function QRForm({
  type,
  data,
  updateData,
}) {
  if (type === "url") {
    return (
      <div className="form-grid">

        <Field
          label="Website URL"
          value={data.url}
          placeholder="https://example.com"
          onChange={(v) =>
            updateData("url", v)
          }
        />

      </div>
    );
  }

  if (type === "wifi") {
    return (
      <div className="form-grid">

        <Field
          label="Wi-Fi Name"
          value={data.ssid}
          placeholder="My Wi-Fi"
          onChange={(v) =>
            updateData("ssid", v)
          }
        />

        <Field
          label="Password"
          value={data.wifiPassword}
          placeholder="Wi-Fi password"
          onChange={(v) =>
            updateData(
              "wifiPassword",
              v
            )
          }
        />

        <div className="field">

          <label>Security</label>

          <select
            value={data.security}
            onChange={(e) =>
              updateData(
                "security",
                e.target.value
              )
            }
          >
            <option value="WPA">
              WPA / WPA2
            </option>

            <option value="WEP">
              WEP
            </option>

            <option value="nopass">
              None
            </option>

          </select>

        </div>

        <label className="check">
          <input
            type="checkbox"
            checked={data.hidden}
            onChange={(e) =>
              updateData(
                "hidden",
                e.target.checked
              )
            }
          />
          Hidden network
        </label>

      </div>
    );
  }

  if (type === "whatsapp") {
    return (
      <div className="form-grid">

        <Field
          label="WhatsApp Number"
          value={data.whatsappPhone}
          placeholder="919876543210"
          onChange={(v) =>
            updateData(
              "whatsappPhone",
              v
            )
          }
        />

        <Field
          label="Message"
          value={data.whatsappMessage}
          placeholder="Hello!"
          onChange={(v) =>
            updateData(
              "whatsappMessage",
              v
            )
          }
        />

      </div>
    );
  }

  if (type === "email") {
    return (
      <div className="form-grid">

        <Field
          label="Email Address"
          value={data.email}
          placeholder="hello@example.com"
          onChange={(v) =>
            updateData("email", v)
          }
        />

        <Field
          label="Subject"
          value={data.emailSubject}
          placeholder="Hello"
          onChange={(v) =>
            updateData(
              "emailSubject",
              v
            )
          }
        />

        <div className="field full">

          <label>Message</label>

          <textarea
            value={data.emailBody}
            placeholder="Write your message..."
            onChange={(e) =>
              updateData(
                "emailBody",
                e.target.value
              )
            }
          />

        </div>

      </div>
    );
  }

  if (type === "phone") {
    return (
      <div className="form-grid">

        <Field
          label="Phone Number"
          value={data.phone}
          placeholder="+919876543210"
          onChange={(v) =>
            updateData("phone", v)
          }
        />

      </div>
    );
  }

  if (type === "vcard") {
    return (
      <div className="form-grid">

        <Field
          label="Full Name"
          value={data.name}
          placeholder="John Doe"
          onChange={(v) =>
            updateData("name", v)
          }
        />

        <Field
          label="Company"
          value={data.company}
          placeholder="ABC Technologies"
          onChange={(v) =>
            updateData(
              "company",
              v
            )
          }
        />

        <Field
          label="Job Title"
          value={data.jobTitle}
          placeholder="Developer"
          onChange={(v) =>
            updateData(
              "jobTitle",
              v
            )
          }
        />

        <Field
          label="Phone"
          value={data.vcardPhone}
          placeholder="+919876543210"
          onChange={(v) =>
            updateData(
              "vcardPhone",
              v
            )
          }
        />

        <Field
          label="Email"
          value={data.vcardEmail}
          placeholder="john@example.com"
          onChange={(v) =>
            updateData(
              "vcardEmail",
              v
            )
          }
        />

        <Field
          label="Website"
          value={data.website}
          placeholder="https://example.com"
          onChange={(v) =>
            updateData(
              "website",
              v
            )
          }
        />

        <Field
          label="Address"
          value={data.address}
          placeholder="Madurai, Tamil Nadu"
          onChange={(v) =>
            updateData(
              "address",
              v
            )
          }
        />

      </div>
    );
  }

  if (type === "upi") {
    return (
      <div className="form-grid">

        <Field
          label="UPI ID / VPA"
          value={data.vpa}
          placeholder="name@upi"
          onChange={(v) =>
            updateData("vpa", v)
          }
        />

        <Field
          label="Payee Name"
          value={data.payeeName}
          placeholder="Your Name"
          onChange={(v) =>
            updateData(
              "payeeName",
              v
            )
          }
        />

        <Field
          label="Amount"
          type="number"
          value={data.amount}
          placeholder="500"
          onChange={(v) =>
            updateData(
              "amount",
              v
            )
          }
        />

        <Field
          label="Payment Note"
          value={data.note}
          placeholder="Payment"
          onChange={(v) =>
            updateData(
              "note",
              v
            )
          }
        />

      </div>
    );
  }
}


/* ---------------- CUSTOMIZER ---------------- */

function Customizer({
  custom,
  setCustom,
  logo,
  uploadLogo,
  setLogo,
}) {
  return (
    <div className="card">

      <div className="card-heading">

        <div className="heading-icon">
          🎨
        </div>

        <div>
          <h3>Customize</h3>
          <p>
            Make your QR match your brand.
          </p>
        </div>

      </div>

      <div className="custom-grid">

        <Range
          label="QR Size"
          value={custom.size}
          min={180}
          max={420}
          onChange={(v) =>
            setCustom({
              ...custom,
              size: Number(v),
            })
          }
        />

        <Range
          label="Margin"
          value={custom.margin}
          min={0}
          max={5}
          onChange={(v) =>
            setCustom({
              ...custom,
              margin: Number(v),
            })
          }
        />

        <div className="control">

          <label>Foreground</label>

          <div className="color">

            <input
              type="color"
              value={custom.fg}
              onChange={(e) =>
                setCustom({
                  ...custom,
                  fg: e.target.value,
                })
              }
            />

            {custom.fg}

          </div>

        </div>

        <div className="control">

          <label>Background</label>

          <div className="color">

            <input
              type="color"
              value={custom.bg}
              onChange={(e) =>
                setCustom({
                  ...custom,
                  bg: e.target.value,
                })
              }
            />

            {custom.bg}

          </div>

        </div>

      </div>

      <div className="logo-area">

        <input
          id="qr-logo"
          type="file"
          accept="image/*"
          onChange={uploadLogo}
        />

        <label htmlFor="qr-logo">
          <Upload size={19} />
          {logo
            ? "Change Logo"
            : "Upload Logo"}
        </label>

        {logo && (
          <button
            onClick={() => setLogo(null)}
          >
            Remove
          </button>
        )}

      </div>

      {logo && (
        <Range
          label="Logo Size"
          value={custom.logoSize}
          min={10}
          max={30}
          onChange={(v) =>
            setCustom({
              ...custom,
              logoSize: Number(v),
            })
          }
        />
      )}

    </div>
  );
}

function Range({
  label,
  value,
  min,
  max,
  onChange,
}) {
  return (
    <div className="control">

      <label>{label}</label>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />

      <span>{value}</span>

    </div>
  );
}


/* ---------------- SETTINGS ---------------- */

function SettingsPage({
  dark,
  setDark,
  resetGenerator,
  clearHistory,
  historyCount,
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">SYSTEM</div>
          <h1>Settings</h1>
          <p>Control your workspace preferences.</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="card settings-card">
          <div className="settings-copy">
            <h3>Appearance</h3>
            <p>Choose the theme that feels right for your workspace.</p>
          </div>
          <button
            className="settings-toggle"
            onClick={() => setDark(!dark)}
            aria-pressed={dark}
          >
            <span>{dark ? "Dark theme" : "Light theme"}</span>
            <span className="toggle-track"><i /></span>
          </button>
        </div>

        <div className="card settings-card">
          <div className="settings-copy">
            <h3>Start fresh</h3>
            <p>Clear the current form and return to the default QR setup.</p>
          </div>
          <button className="secondary-button" onClick={resetGenerator}>
            Reset generator
          </button>
        </div>

        <div className="card settings-card">
          <div className="settings-copy">
            <h3>Saved data</h3>
            <p>{historyCount} saved QR {historyCount === 1 ? "code" : "codes"} in this browser.</p>
          </div>
          <button className="danger-button" onClick={clearHistory}>
            <Trash2 size={16} />
            Clear saved data
          </button>
        </div>
      </div>
    </>
  );
}


/* ---------------- DASHBOARD ---------------- */

function Dashboard({
  history,
  setPage,
}) {
  return (
    <>

      <div className="page-heading">

        <div>
          <div className="eyebrow">
            DASHBOARD
          </div>

          <h1>
            Welcome to QR Studio
          </h1>

          <p>
            Create and manage your
            professional QR codes.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            setPage("generator")
          }
        >
          + Create QR
        </button>

      </div>

      <div className="stats">

        <Stat
          icon={<QrCode />}
          title="Total QR Codes"
          value={history.length}
        />

        <Stat
          icon={<Download />}
          title="Saved Designs"
          value={history.length}
        />

        <Stat
          icon={<Sparkles />}
          title="QR Types"
          value={7}
        />

      </div>

      <div className="card dashboard-card">

        <h3>Recent QR Codes</h3>

        {history.length === 0 ? (
          <div className="empty">
            <QrCode size={42} />

            <p>
              Create your first QR code.
            </p>
          </div>
        ) : (
          history
            .slice(0, 5)
            .map((item) => (
              <div
                className="recent"
                key={item.id}
              >
                <img
                  src={item.image}
                  alt="QR"
                />

                <div>
                  <b>
                    {getTypeName(
                      item.type
                    )}
                  </b>

                  <small>
                    {new Date(
                      item.date
                    ).toLocaleString()}
                  </small>
                </div>
              </div>
            ))
        )}

      </div>

    </>
  );
}

function Stat({
  icon,
  title,
  value,
}) {
  return (
    <div className="stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

    </div>
  );
}


/* ---------------- ANALYTICS ---------------- */

function Analytics({ history }) {
  const counts = {};

  history.forEach((item) => {
    counts[item.type] =
      (counts[item.type] || 0) + 1;
  });

  return (
    <>

      <div className="page-heading">

        <div>
          <div className="eyebrow">
            ANALYTICS
          </div>

          <h1>QR Analytics</h1>

          <p>
            Overview of your QR creation
            activity.
          </p>
        </div>

      </div>

      <div className="stats">

        <Stat
          icon={<QrCode />}
          title="Total Created"
          value={history.length}
        />

        <Stat
          icon={<BarChart3 />}
          title="QR Types Used"
          value={Object.keys(counts).length}
        />

        <Stat
          icon={<Sparkles />}
          title="Available Types"
          value={7}
        />

      </div>

      <div className="card analytics-card">

        <h3>QR Type Distribution</h3>

        {qrTypes.map((item) => {

          const count =
            counts[item[0]] || 0;

          const percentage =
            history.length
              ? (count /
                  history.length) *
                100
              : 0;

          return (
            <div
              className="bar-row"
              key={item[0]}
            >

              <div>
                <span>
                  {item[2]} {item[1]}
                </span>

                <b>{count}</b>
              </div>

              <div className="bar">

                <i
                  style={{
                    width: `${percentage}%`,
                  }}
                />

              </div>

            </div>
          );
        })}

      </div>

    </>
  );
}


/* ---------------- HISTORY ---------------- */

function HistoryPage({
  history,
  restoreQR,
  deleteQR,
  clearHistory,
}) {
  return (
    <>

      <div className="page-heading">

        <div>
          <div className="eyebrow">
            HISTORY
          </div>

          <h1>QR History</h1>

          <p>
            Manage your saved QR codes.
          </p>
        </div>

        {history.length > 0 && (
          <button
            className="danger-button"
            onClick={clearHistory}
          >
            <Trash2 size={17} />
            Clear History
          </button>
        )}

      </div>

      <div className="history-grid">

        {history.length === 0 ? (
          <div className="card empty">
            <HistoryIcon size={45} />

            <h3>
              No saved QR codes
            </h3>

            <p>
              Your saved designs will
              appear here.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              className="history-card"
              key={item.id}
            >

              <div className="history-image">
                <img
                  src={item.image}
                  alt="QR"
                />
              </div>

              <div className="history-info">

                <span>
                  {getTypeName(
                    item.type
                  )}
                </span>

                <small>
                  {new Date(
                    item.date
                  ).toLocaleString()}
                </small>

              </div>

              <div className="history-actions">

                <button
                  onClick={() =>
                    restoreQR(item)
                  }
                >
                  <RotateCcw size={16} />
                </button>

                <button
                  className="delete"
                  onClick={() =>
                    deleteQR(item.id)
                  }
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </>
  );
}


/* ---------------- SIDEBAR ---------------- */

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


/* ---------------- HELPERS ---------------- */

function Field({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
}) {
  return (
    <div className="field">

      <label>{label}</label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />

    </div>
  );
}

function getTypeName(type) {
  return (
    qrTypes.find(
      (item) => item[0] === type
    )?.[1] || "QR Code"
  );
}

function getTypeIcon(type) {
  return (
    qrTypes.find(
      (item) => item[0] === type
    )?.[2] || "▣"
  );
}

function escapeWifi(value = "") {
  return value.replace(
    /([\\;,:"])/g,
    "\\$1"
  );
}

function download(url, filename) {
  const a =
    document.createElement("a");

  a.href = url;
  a.download = filename;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);
}