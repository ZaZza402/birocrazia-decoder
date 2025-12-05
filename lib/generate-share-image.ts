import html2canvas from "html2canvas";

interface ShareImageData {
  prompt: string;
  laVerita: string;
  livelloDiRischio: "BASSO" | "MEDIO" | "ALTO";
  cosaDeviFare: string;
  notaDelBurocrate: string;
  persona: string;
}

export async function generateShareImage(data: ShareImageData): Promise<Blob> {
  // Create a hidden container for the image content
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "1200px";
  container.style.background = "#f0f0f0";
  container.style.padding = "60px";
  container.style.fontFamily = "monospace";

  // Get risk color
  const getRiskColor = (level: "BASSO" | "MEDIO" | "ALTO") => {
    switch (level) {
      case "ALTO":
        return { bg: "#dc2626", text: "#ffffff" };
      case "MEDIO":
        return { bg: "#facc15", text: "#000000" };
      case "BASSO":
        return { bg: "#22c55e", text: "#000000" };
      default:
        return { bg: "#e5e5e5", text: "#000000" };
    }
  };

  const riskColor = getRiskColor(data.livelloDiRischio);

  // Build the HTML content to capture
  container.innerHTML = `
    <div style="background: white; border: 4px solid black; box-shadow: 12px 12px 0px 0px rgba(0,0,0,1); position: relative;">
      <!-- Watermark Header -->
      <div style="background: #fef08a; border-bottom: 4px solid black; padding: 24px; text-align: center; position: relative;">
        <h1 style="font-size: 48px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: -2px; color: black;">
          BUR0
        </h1>
        <p style="font-size: 16px; font-weight: 700; margin: 8px 0 0 0; text-transform: uppercase; color: black;">
          Il Decodificatore di Burocrazia
        </p>
      </div>

      <!-- Prompt Context -->
      <div style="background: #f3f4f6; border-bottom: 4px solid black; padding: 24px;">
        <div style="background: black; color: white; display: inline-block; padding: 8px 16px; margin-bottom: 12px; font-weight: 900; font-size: 12px; text-transform: uppercase;">
          IL TUO DOCUMENTO
        </div>
        <p style="font-size: 16px; line-height: 1.6; margin: 0; color: #374151; max-height: 120px; overflow: hidden;">
          ${data.prompt.substring(0, 300)}${
    data.prompt.length > 300 ? "..." : ""
  }
        </p>
      </div>

      <!-- Risk Level -->
      <div style="background: ${riskColor.bg}; color: ${
    riskColor.text
  }; border-bottom: 4px solid black; padding: 20px 32px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">
          ⚠️ LIVELLO DI RISCHIO
        </span>
        <span style="font-weight: 900; font-size: 36px; text-transform: uppercase; letter-spacing: -2px;">
          ${data.livelloDiRischio}
        </span>
      </div>

      <!-- Main Content -->
      <div style="padding: 40px;">
        <!-- La Verità -->
        <div style="margin-bottom: 32px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="background: black; color: white; padding: 8px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 24px;">"</span>
            </div>
            <span style="background: #fef08a; border: 2px solid black; padding: 4px 12px; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: black;">
              LA VERITÀ
            </span>
          </div>
          <p style="font-size: 18px; line-height: 1.8; margin: 0; color: black;">
            ${data.laVerita}
          </p>
        </div>

        <!-- Cosa Devi Fare -->
        <div style="background: #f3f4f6; border: 4px solid black; padding: 32px; margin-bottom: 32px; position: relative;">
          <div style="position: absolute; top: -16px; left: -16px; background: black; color: white; padding: 8px 16px; font-weight: 900; font-size: 12px; text-transform: uppercase; border: 2px solid white; box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);">
            COSA DEVI FARE
          </div>
          <p style="font-size: 16px; line-height: 1.8; margin: 16px 0 0 0; color: black;">
            ${data.cosaDeviFare}
          </p>
        </div>

        <!-- Nota del Burocrate -->
        <div style="border-top: 4px dashed #d1d5db; padding-top: 24px; display: flex; gap: 16px; align-items: start;">
          <div style="font-size: 48px; color: #dc2626; opacity: 0.8; transform: rotate(12deg); flex-shrink: 0;">
            🏛️
          </div>
          <div>
            <p style="font-size: 12px; font-weight: 900; color: #6b7280; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px 0;">
              NOTA DEL BUROCRATE
            </p>
            <p style="font-size: 16px; font-style: italic; color: #4b5563; line-height: 1.8; margin: 0; border-left: 4px solid black; padding-left: 16px;">
              "${data.notaDelBurocrate}"
            </p>
          </div>
        </div>
      </div>

      <!-- Footer Watermark -->
      <div style="background: black; color: white; text-align: center; padding: 20px; border-top: 4px solid black;">
        <p style="margin: 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
          Decodificato da <span style="color: #fef08a;">BUR0.APP</span> • La Burocrazia fa schifo, noi la distruggiamo.
        </p>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // Generate the canvas
    const canvas = await html2canvas(container, {
      backgroundColor: "#f0f0f0",
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to generate image blob"));
        }
      }, "image/png");
    });

    return blob;
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
}

export function downloadImage(
  blob: Blob,
  filename: string = "bur0-decodifica.png"
) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
