import {
  Upload,
  X,
  Palette,
} from "lucide-react";

export default function Customizer({
  custom,
  setCustom,
  logo,
  uploadLogo,
  setLogo,
}) {
  function update(key, value) {
    setCustom((old) => ({
      ...old,
      [key]: value,
    }));
  }

  return (
    <div className="card">

      <div className="card-heading">

        <div className="heading-icon">
          <Palette size={19} />
        </div>

        <div>
          <h3>
            Customize QR
          </h3>

          <p>
            Match your QR with
            your brand.
          </p>
        </div>

      </div>

      <div className="custom-grid">

        {/* SIZE */}

        <RangeControl
          label="QR Size"
          value={custom.size}
          min={180}
          max={420}
          suffix="px"
          onChange={(value) =>
            update(
              "size",
              Number(value)
            )
          }
        />

        {/* MARGIN */}

        <RangeControl
          label="Margin"
          value={custom.margin}
          min={0}
          max={5}
          suffix=""
          onChange={(value) =>
            update(
              "margin",
              Number(value)
            )
          }
        />

        {/* FOREGROUND */}

        <div className="control">

          <label>
            Foreground Color
          </label>

          <div className="color-picker">

            <input
              type="color"
              value={custom.fg}
              onChange={(e) =>
                update(
                  "fg",
                  e.target.value
                )
              }
            />

            <span>
              {custom.fg}
            </span>

          </div>

        </div>

        {/* BACKGROUND */}

        <div className="control">

          <label>
            Background Color
          </label>

          <div className="color-picker">

            <input
              type="color"
              value={custom.bg}
              onChange={(e) =>
                update(
                  "bg",
                  e.target.value
                )
              }
            />

            <span>
              {custom.bg}
            </span>

          </div>

        </div>

      </div>

      {/* LOGO */}

      <div className="logo-section">

        <div className="logo-title">
          <b>Center Logo</b>

          <small>
            Optional
          </small>
        </div>

        {!logo ? (
          <>
            <input
              id="qr-logo-upload"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={uploadLogo}
              hidden
            />

            <label
              htmlFor="qr-logo-upload"
              className="logo-upload"
            >
              <Upload size={18} />

              <div>
                <b>
                  Upload Logo
                </b>

                <small>
                  PNG, JPG, WEBP or SVG
                </small>
              </div>
            </label>
          </>
        ) : (
          <div className="logo-preview">

            <img
              src={logo}
              alt="QR Logo"
            />

            <div>
              <b>
                Logo uploaded
              </b>

              <small>
                Center logo enabled
              </small>
            </div>

            <button
              onClick={() =>
                setLogo(null)
              }
              title="Remove logo"
            >
              <X size={17} />
            </button>

          </div>
        )}

      </div>

      {logo && (
        <RangeControl
          label="Logo Size"
          value={custom.logoSize}
          min={10}
          max={30}
          suffix="%"
          onChange={(value) =>
            update(
              "logoSize",
              Number(value)
            )
          }
        />
      )}

      {/* QUICK COLORS */}

      <div className="quick-colors">

        <label>
          Quick Colors
        </label>

        <div className="color-presets">

          {[
            "#111827",
            "#000000",
            "#2563eb",
            "#7c3aed",
            "#dc2626",
            "#059669",
          ].map((color) => (
            <button
              key={color}
              style={{
                backgroundColor:
                  color,
              }}
              onClick={() =>
                update(
                  "fg",
                  color
                )
              }
              aria-label={
                `Use ${color}`
              }
            />
          ))}

        </div>

      </div>

    </div>
  );
}


/* ================= RANGE ================= */

function RangeControl({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}) {
  return (
    <div className="control">

      <div className="range-header">

        <label>
          {label}
        </label>

        <span>
          {value}
          {suffix}
        </span>

      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
      />

    </div>
  );
}