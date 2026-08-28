import {
  useRef,
  useState,
} from "react";

import {
  Download,
  Copy,
  Check,
  Save,
} from "lucide-react";

import { QRCodeCanvas } from "qrcode.react";

import {
  toPng,
  toSvg,
} from "html-to-image";

import { jsPDF } from "jspdf";

export default function QRPreview({
  payload,
  custom,
  logo,
  saveQR,
}) {
  const qrRef = useRef(null);

  const [copied, setCopied] =
    useState(false);

  async function downloadPNG() {
    if (!qrRef.current) return;

    const image = await toPng(
      qrRef.current,
      {
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      }
    );

    downloadFile(
      image,
      "qr-studio.png"
    );
  }

  async function downloadSVG() {
    if (!qrRef.current) return;

    const image = await toSvg(
      qrRef.current,
      {
        backgroundColor: "#ffffff",
      }
    );

    downloadFile(
      image,
      "qr-studio.svg"
    );
  }

  async function downloadPDF() {
    if (!qrRef.current) return;

    const image = await toPng(
      qrRef.current,
      {
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      }
    );

    const pdf = new jsPDF();

    pdf.addImage(
      image,
      "PNG",
      35,
      45,
      140,
      140
    );

    pdf.save(
      "qr-studio.pdf"
    );
  }

  async function copyPayload() {
    try {
      await navigator.clipboard.writeText(
        payload
      );

      setCopied(true);

      setTimeout(
        () => setCopied(false),
        1500
      );
    } catch {
      alert(
        "Unable to copy."
      );
    }
  }

  return (
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
            size={
              Number(custom.size)
            }
            fgColor={
              custom.fg
            }
            bgColor={
              custom.bg
            }
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
          onClick={copyPayload}
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
        <Save size={17} />
        Save QR Code
      </button>

    </div>
  );
}

function downloadFile(
  url,
  filename
) {
  const link =
    document.createElement(
      "a"
    );

  link.href = url;
  link.download = filename;

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );
}