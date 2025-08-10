import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router-dom";

const SIDE_MENU_CATEGORIES = [
  {
    titleKey: "digitalContent",
    items: [
      { labelKey: "primeVideo" },
      { labelKey: "amazonMusic" },
      { labelKey: "kindleBooks" },
      { labelKey: "amazonAppstore" },
    ],
  },
  {
    titleKey: "shopByDepartment",
    items: [
      { labelKey: "electronics" },
      { labelKey: "computers" },
      { labelKey: "smartHome" },
      { labelKey: "artsCrafts" },
      { labelKey: "automotive" },
      { labelKey: "baby" },
      { labelKey: "beautyPersonalCare" },
    ],
  },
];

export default function AmazonSideMenu({ open, onClose, onSignIn }) {
  const { t } = useLanguage();

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        zIndex: 2000,
        display: "flex",
      }}
      onClick={onClose}
    >
      <aside
        style={{
          width: 340,
          maxWidth: "90vw",
          height: "100vh",
          background: "#fff",
          boxShadow: "2px 0 12px rgba(0,0,0,0.12)",
          overflowY: "auto",
          position: "relative",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: "#232f3e", color: "#fff", padding: 18, display: "flex", alignItems: "center", fontWeight: 700, fontSize: 18 }}>
          <i className="bi bi-person-circle" style={{ fontSize: 24, marginRight: 10 }}></i>
          <span>{t("helloSignIn")}</span>
          <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>
            ×
          </button>
        </div>
        {/* Sign in button */}
        <div style={{ padding: "18px 20px 10px 20px", borderBottom: "1px solid #eee" }}>
          <button
            onClick={onSignIn}
            style={{ width: "100%", background: "#ffd814", color: "#232f3e", border: "none", borderRadius: 4, fontWeight: 700, fontSize: 16, padding: "10px 0", cursor: "pointer" }}
          >
            {t("signIn")}
          </button>
        </div>
        {/* Categories */}
        <div style={{ padding: "0 0 20px 0" }}>
          {SIDE_MENU_CATEGORIES.map((cat, idx) => (
            <div key={cat.titleKey} style={{ borderTop: idx === 0 ? "none" : "1px solid #eee", padding: "0 20px" }}>
              <div style={{ fontWeight: 700, fontSize: 15, margin: "18px 0 8px 0" }}>{t(cat.titleKey)}</div>
              {cat.items.map(item => (
                <div key={item.labelKey} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", fontSize: 15 }}>
                  <span>{t(item.labelKey)}</span>
                  <i className="bi bi-chevron-right" style={{ fontSize: 14, color: "#888" }}></i>
                </div>
              ))}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
} 