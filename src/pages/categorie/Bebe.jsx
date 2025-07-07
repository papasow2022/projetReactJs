import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

function Bebe() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h2>{t("baby_category_page")}</h2>
      <p>{t("welcome_to_baby_page")}</p>
    </div>
  );
}

export default Bebe;
