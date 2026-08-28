const qrTypes = [
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

export default function QRForm({
  type,
  setType,
  data,
  updateData,
}) {
  return (
    <div>

      {/* QR TYPE SELECTOR */}

      <div className="qr-type-grid">

        {qrTypes.map((item) => (
          <button
            key={item.id}
            type="button"
            className={
              type === item.id
                ? "qr-type active"
                : "qr-type"
            }
            onClick={() =>
              setType(item.id)
            }
          >
            <span className="qr-type-icon">
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>
          </button>
        ))}

      </div>

      {/* FORM */}

      <div className="form-content">

        {type === "url" && (
          <URLForm
            data={data}
            updateData={updateData}
          />
        )}

        {type === "wifi" && (
          <WifiForm
            data={data}
            updateData={updateData}
          />
        )}

        {type === "whatsapp" && (
          <WhatsAppForm
            data={data}
            updateData={updateData}
          />
        )}

        {type === "email" && (
          <EmailForm
            data={data}
            updateData={updateData}
          />
        )}

        {type === "phone" && (
          <PhoneForm
            data={data}
            updateData={updateData}
          />
        )}

        {type === "vcard" && (
          <VCardForm
            data={data}
            updateData={updateData}
          />
        )}

        {type === "upi" && (
          <UPIForm
            data={data}
            updateData={updateData}
          />
        )}

      </div>

    </div>
  );
}


/* ================= URL ================= */

function URLForm({
  data,
  updateData,
}) {
  return (
    <div className="form-grid">

      <Field
        label="Website URL"
        value={data.url}
        placeholder="https://example.com"
        onChange={(value) =>
          updateData("url", value)
        }
      />

    </div>
  );
}


/* ================= WIFI ================= */

function WifiForm({
  data,
  updateData,
}) {
  return (
    <div className="form-grid">

      <Field
        label="Wi-Fi Name"
        value={data.ssid}
        placeholder="My Wi-Fi"
        onChange={(value) =>
          updateData("ssid", value)
        }
      />

      <Field
        label="Password"
        type="password"
        value={data.wifiPassword}
        placeholder="Wi-Fi password"
        onChange={(value) =>
          updateData(
            "wifiPassword",
            value
          )
        }
      />

      <div className="field">
        <label>
          Security
        </label>

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


/* ================= WHATSAPP ================= */

function WhatsAppForm({
  data,
  updateData,
}) {
  return (
    <div className="form-grid">

      <Field
        label="WhatsApp Number"
        value={data.whatsappPhone}
        placeholder="919876543210"
        onChange={(value) =>
          updateData(
            "whatsappPhone",
            value
          )
        }
      />

      <div className="field full">
        <label>
          Message
        </label>

        <textarea
          value={data.whatsappMessage}
          placeholder="Hello! I would like to know more..."
          onChange={(e) =>
            updateData(
              "whatsappMessage",
              e.target.value
            )
          }
        />
      </div>

    </div>
  );
}


/* ================= EMAIL ================= */

function EmailForm({
  data,
  updateData,
}) {
  return (
    <div className="form-grid">

      <Field
        label="Email Address"
        value={data.email}
        placeholder="hello@example.com"
        onChange={(value) =>
          updateData(
            "email",
            value
          )
        }
      />

      <Field
        label="Subject"
        value={data.emailSubject}
        placeholder="Hello"
        onChange={(value) =>
          updateData(
            "emailSubject",
            value
          )
        }
      />

      <div className="field full">
        <label>
          Message
        </label>

        <textarea
          value={data.emailBody}
          placeholder="Write your email message..."
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


/* ================= PHONE ================= */

function PhoneForm({
  data,
  updateData,
}) {
  return (
    <div className="form-grid">

      <Field
        label="Phone Number"
        value={data.phone}
        placeholder="+919876543210"
        onChange={(value) =>
          updateData(
            "phone",
            value
          )
        }
      />

    </div>
  );
}


/* ================= VCARD ================= */

function VCardForm({
  data,
  updateData,
}) {
  return (
    <div className="form-grid">

      <Field
        label="Full Name"
        value={data.name}
        placeholder="John Doe"
        onChange={(value) =>
          updateData(
            "name",
            value
          )
        }
      />

      <Field
        label="Company"
        value={data.company}
        placeholder="ABC Technologies"
        onChange={(value) =>
          updateData(
            "company",
            value
          )
        }
      />

      <Field
        label="Job Title"
        value={data.jobTitle}
        placeholder="Frontend Developer"
        onChange={(value) =>
          updateData(
            "jobTitle",
            value
          )
        }
      />

      <Field
        label="Phone"
        value={data.vcardPhone}
        placeholder="+919876543210"
        onChange={(value) =>
          updateData(
            "vcardPhone",
            value
          )
        }
      />

      <Field
        label="Email"
        value={data.vcardEmail}
        placeholder="john@example.com"
        onChange={(value) =>
          updateData(
            "vcardEmail",
            value
          )
        }
      />

      <Field
        label="Website"
        value={data.website}
        placeholder="https://example.com"
        onChange={(value) =>
          updateData(
            "website",
            value
          )
        }
      />

      <Field
        label="Address"
        value={data.address}
        placeholder="Madurai, Tamil Nadu"
        onChange={(value) =>
          updateData(
            "address",
            value
          )
        }
      />

    </div>
  );
}


/* ================= UPI ================= */

function UPIForm({
  data,
  updateData,
}) {
  return (
    <div className="form-grid">

      <Field
        label="UPI ID / VPA"
        value={data.vpa}
        placeholder="name@upi"
        onChange={(value) =>
          updateData(
            "vpa",
            value
          )
        }
      />

      <Field
        label="Payee Name"
        value={data.payeeName}
        placeholder="Your Name"
        onChange={(value) =>
          updateData(
            "payeeName",
            value
          )
        }
      />

      <Field
        label="Amount (₹)"
        type="number"
        value={data.amount}
        placeholder="500"
        onChange={(value) =>
          updateData(
            "amount",
            value
          )
        }
      />

      <Field
        label="Payment Note"
        value={data.note}
        placeholder="Payment"
        onChange={(value) =>
          updateData(
            "note",
            value
          )
        }
      />

    </div>
  );
}


/* ================= FIELD ================= */

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
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />

    </div>
  );
}