import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

function Femme() {
  const { t } = useLanguage();
  
  return (
    <div style={{ padding: "20px" }}>
      <h1>{t("welcome_to_woman_page")}</h1>
      <p>{t("woman_category_page")}</p>
    </div>
  );
}

export default Femme;
