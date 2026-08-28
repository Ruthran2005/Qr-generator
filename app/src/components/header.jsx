import {
  QrCode,
  Moon,
  Sun,
  History,
} from "lucide-react";

export default function Header({
  dark,
  setDark,
  historyCount,
  setPage,
}) {
  return (
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
          <History size={18} />
          <span className="history-text">
            History
          </span>

          <span className="history-count">
            {historyCount}
          </span>
        </button>

        <button
          className="theme-button"
          onClick={() => setDark(!dark)}
          aria-label="Toggle theme"
        >
          {dark ? (
            <Sun size={19} />
          ) : (
            <Moon size={19} />
          )}
        </button>
      </div>
    </header>
  );
}