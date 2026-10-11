import { ImageResponse } from "next/og";
import { profile } from "@/data/portfolio";

export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #05070a 0%, #11161d 60%, #0b1f26 100%)",
          color: "#d6dee7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 26, letterSpacing: 8, color: "#9aa6b4" }}>
          <div style={{ width: 56, height: 56, border: "2px solid #3ee8ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#eef3f8", fontSize: 22 }}>
            AB
          </div>
          ANIKET BARAI
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 84, lineHeight: 1, color: "#f4f7fa", maxWidth: 980 }}>{profile.headline}</div>
          <div style={{ fontSize: 28, color: "#9aa6b4", maxWidth: 900 }}>{profile.description}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: "#3ee8ff", letterSpacing: 4 }}>
          ● OPEN TO SOFTWARE ENGINEERING INTERNSHIPS
        </div>
      </div>
    ),
    { ...size },
  );
}
