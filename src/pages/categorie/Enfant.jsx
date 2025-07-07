import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

function Enfant() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h2>{t("child_category_page")}</h2>
      <p>{t("welcome_to_child_page")}</p>
    </div>
  );
}

export default Enfant;
