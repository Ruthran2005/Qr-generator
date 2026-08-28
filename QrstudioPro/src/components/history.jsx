import React from "react";

import {
  History as HistoryIcon,
  Trash2,
  RotateCcw,
  Download,
  QrCode,
  Search,
} from "lucide-react";

import { getTypeName } from "../utils/qrHelpers";

export default function History({
  history,
  restoreQR,
  deleteQR,
  clearHistory,
}) {
  const [search, setSearch] =
    React.useState("");

  const filtered =
    history.filter((item) =>
      getTypeName(item.type)
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div>

      {/* HEADER */}

      <div className="page-heading">

        <div>

          <div className="eyebrow">
            HISTORY
          </div>

          <h1>
            QR History
          </h1>

          <p>
            Manage your saved QR
            code designs.
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

      {/* SEARCH */}

      {history.length > 0 && (
        <div className="history-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search QR codes..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>
      )}

      {/* HISTORY */}

      {filtered.length === 0 ? (
        <div className="card empty">

          <div className="empty-icon">
            <HistoryIcon size={42} />
          </div>

          <h3>
            No QR codes found
          </h3>

          <p>
            Create and save a QR
            code to see it here.
          </p>

        </div>
      ) : (
        <div className="history-grid">

          {filtered.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              restoreQR={restoreQR}
              deleteQR={deleteQR}
            />
          ))}

        </div>
      )}

    </div>
  );
}


/* ================= CARD ================= */

function HistoryCard({
  item,
  restoreQR,
  deleteQR,
}) {
  return (
    <div className="history-card">

      <div className="history-image">

        {item.image ? (
          <img
            src={item.image}
            alt="Saved QR code"
          />
        ) : (
          <QrCode size={45} />
        )}

      </div>

      <div className="history-info">

        <div className="history-type">

          <span className="history-type-icon">
            {getTypeIcon(
              item.type
            )}
          </span>

          <strong>
            {getTypeName(
              item.type
            )}
          </strong>

        </div>

        <small>
          {formatDate(
            item.date
          )}
        </small>

        <p>
          {getPayloadPreview(
            item.payload
          )}
        </p>

      </div>

      <div className="history-actions">

        <button
          title="Restore"
          onClick={() =>
            restoreQR(item)
          }
        >
          <RotateCcw size={16} />
        </button>

        <button
          title="Download"
          onClick={() =>
            downloadImage(
              item.image
            )
          }
        >
          <Download size={16} />
        </button>

        <button
          className="delete"
          title="Delete"
          onClick={() =>
            deleteQR(item.id)
          }
        >
          <Trash2 size={16} />
        </button>

      </div>

    </div>
  );
}


/* ================= HELPERS ================= */

function getTypeIcon(type) {
  const icons = {
    url: "🔗",
    wifi: "📶",
    whatsapp: "💬",
    email: "✉️",
    phone: "☎️",
    vcard: "👤",
    upi: "₹",
  };

  return icons[type] || "▣";
}

function formatDate(date) {
  return new Date(
    date
  ).toLocaleString(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

function getPayloadPreview(
  payload = ""
) {
  if (!payload) {
    return "No data";
  }

  if (payload.length <= 45) {
    return payload;
  }

  return (
    payload.substring(0, 45) +
    "..."
  );
}

function downloadImage(
  image
) {
  if (!image) return;

  const link =
    document.createElement(
      "a"
    );

  link.href = image;
  link.download =
    "qr-studio-history.png";

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );
}