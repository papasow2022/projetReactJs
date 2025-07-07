import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { t, currentLanguage, changeLanguage, languages } = useLanguage();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`${t('newsletter_success')}: ${email}`);
    setEmail("");
  };

  return (
    <footer className="bg-gradient-to-b from-dark to-black text-light">
      {/* Section garanties - déplacée en haut pour plus d'impact */}
      <div className="bg-dark py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column align-items-center text-center p-4 bg-black rounded-3 h-100 position-relative overflow-hidden">
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-warning opacity-10"></div>
                <div className="position-relative z-1">
                  <div className="bg-warning rounded-circle p-3 mb-3 d-inline-flex">
                    <i className="bi bi-truck text-dark fs-2"></i>
                  </div>
                  <h5 className="fw-bold text-light mb-2">{t('free_shipping')}</h5>
                  <p className="text-muted mb-0 small">{t('free_shipping_desc')}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column align-items-center text-center p-4 bg-black rounded-3 h-100 position-relative overflow-hidden">
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-warning opacity-10"></div>
                <div className="position-relative z-1">
                  <div className="bg-warning rounded-circle p-3 mb-3 d-inline-flex">
                    <i className="bi bi-shield-check text-dark fs-2"></i>
                  </div>
                  <h5 className="fw-bold text-light mb-2">{t('secure_payment')}</h5>
                  <p className="text-muted mb-0 small">{t('secure_payment_desc')}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column align-items-center text-center p-4 bg-black rounded-3 h-100 position-relative overflow-hidden">
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-warning opacity-10"></div>
                <div className="position-relative z-1">
                  <div className="bg-warning rounded-circle p-3 mb-3 d-inline-flex">
                    <i className="bi bi-arrow-clockwise text-dark fs-2"></i>
                  </div>
                  <h5 className="fw-bold text-light mb-2">{t('easy_returns')}</h5>
                  <p className="text-muted mb-0 small">{t('easy_returns_desc')}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column align-items-center text-center p-4 bg-black rounded-3 h-100 position-relative overflow-hidden">
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-warning opacity-10"></div>
                <div className="position-relative z-1">
                  <div className="bg-warning rounded-circle p-3 mb-3 d-inline-flex">
                    <i className="bi bi-headset text-dark fs-2"></i>
                  </div>
                  <h5 className="fw-bold text-light mb-2">{t('24_7_support')}</h5>
                  <p className="text-muted mb-0 small">{t('24_7_support_desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section principale du footer */}
      <div className="container-fluid py-5">
        <div className="container">
          <div className="row g-5">
            {/* Colonne 1 : Logo, description, réseaux sociaux */}
            <div className="col-lg-4 col-md-6">
              <div className="mb-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-warning rounded-3 p-2 me-3">
                    <i className="bi bi-shoe-prints text-dark fs-3"></i>
                  </div>
                  <h3 className="fw-bold text-warning mb-0 fs-2">
                    {t('company_name')}
                  </h3>
                </div>
                <p className="text-dark mb-4 fs-6 lh-lg">
                  {t('about_description')}
                </p>
                
                {/* Réseaux sociaux améliorés */}
                <div className="mb-4">
                  <h6 className="fw-bold text-warning mb-3 text-uppercase letter-spacing-1">
                    <i className="bi bi-share me-2"></i>
                    {t('follow_us')}
                  </h6>
                  <div className="d-flex gap-2">
                    <a href="#" className="btn btn-outline-warning btn-sm rounded-circle p-2 hover-lift" aria-label="Facebook" title="Facebook">
                      <i className="bi bi-facebook fs-5"></i>
                    </a>
                    <a href="#" className="btn btn-outline-warning btn-sm rounded-circle p-2 hover-lift" aria-label="Instagram" title="Instagram">
                      <i className="bi bi-instagram fs-5"></i>
                    </a>
                    <a href="#" className="btn btn-outline-warning btn-sm rounded-circle p-2 hover-lift" aria-label="Twitter" title="Twitter">
                      <i className="bi bi-twitter fs-5"></i>
                    </a>
                    <a href="#" className="btn btn-outline-warning btn-sm rounded-circle p-2 hover-lift" aria-label="YouTube" title="YouTube">
                      <i className="bi bi-youtube fs-5"></i>
                    </a>
                    <a href="#" className="btn btn-outline-warning btn-sm rounded-circle p-2 hover-lift" aria-label="TikTok" title="TikTok">
                      <i className="bi bi-tiktok fs-5"></i>
                    </a>
                  </div>
                </div>

                {/* Moyens de paiement améliorés */}
                <div>
                  <h6 className="fw-bold text-warning mb-3 text-uppercase letter-spacing-1">
                    <i className="bi bi-credit-card-2-front me-2"></i>
                    Moyens de paiement
                  </h6>
                  <div className="d-flex gap-2 flex-wrap">
                    <div className="bg-light rounded p-2 d-flex align-items-center justify-content-center" style={{width: '50px', height: '32px'}}>
                      <i className="bi bi-credit-card text-primary fs-5"></i>
                    </div>
                    <div className="bg-light rounded p-2 d-flex align-items-center justify-content-center" style={{width: '50px', height: '32px'}}>
                      <i className="bi bi-credit-card-2-back text-danger fs-5"></i>
                    </div>
                    <div className="bg-light rounded p-2 d-flex align-items-center justify-content-center" style={{width: '50px', height: '32px'}}>
                      <span className="fw-bold text-primary small">PP</span>
                    </div>
                    <div className="bg-light rounded p-2 d-flex align-items-center justify-content-center" style={{width: '50px', height: '32px'}}>
                      <span className="fw-bold text-success small">AP</span>
                    </div>
                    <div className="bg-light rounded p-2 d-flex align-items-center justify-content-center" style={{width: '50px', height: '32px'}}>
                      <i className="bi bi-bank text-dark fs-6"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne 2 : Catégories */}
            <div className="col-lg-2 col-md-6">
              <h6 className="fw-bold text-warning mb-4 text-uppercase letter-spacing-1">
                <i className="bi bi-lightning me-2"></i>
                {t('categories')}
              </h6>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <Link to="/categorie/homme" className="text-dark text-decoration-none d-flex align-items-center hover-warning">
                    <i className="bi bi-chevron-right me-2 text-warning transition-all"></i>
                    {t('man')}
                  </Link>
                </li>
                <li className="mb-3">
                  <Link to="/categorie/femme" className="text-dark text-decoration-none d-flex align-items-center hover-warning">
                    <i className="bi bi-chevron-right me-2 text-warning transition-all"></i>
                    {t('woman')}
                  </Link>
                </li>
                <li className="mb-3">
                  <Link to="/categorie/enfant" className="text-dark text-decoration-none d-flex align-items-center hover-warning">
                    <i className="bi bi-chevron-right me-2 text-warning transition-all"></i>
                    {t('child')}
                  </Link>
                </li>
                <li className="mb-3">
                  <Link to="/categorie/bebe" className="text-dark text-decoration-none d-flex align-items-center hover-warning">
                    <i className="bi bi-chevron-right me-2 text-warning transition-all"></i>
                    {t('baby')}
                  </Link>
                </li>
                <li className="mb-3">
                  <Link to="/accessoires" className="text-dark text-decoration-none d-flex align-items-center hover-warning">
                    <i className="bi bi-chevron-right me-2 text-warning transition-all"></i>
                    Accessoires
                  </Link>
                </li>
                <li className="mb-3">
                  <Link to="/catalogue" className="text-dark text-decoration-none d-flex align-items-center hover-warning">
                    <i className="bi bi-chevron-right me-2 text-warning transition-all"></i>
                    {t('all_products')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colonne 3 : Service client */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold text-warning mb-4 text-uppercase letter-spacing-1">
                <i className="bi bi-headset me-2"></i>
                {t('customer_service')}
              </h6>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <Link to="/contact" className="text-dark text-decoration-none d-flex align-items-center hover-warning">
                    <i className="bi bi-envelope me-2 text-warning"></i>
                    {t('contact_us')}
                  </Link>
                </li>
                <li className="mb-3">
                  <Link to="/shipping" className="text-dark text-decoration-none d-flex align-items-center hover-warning">
                    <i className="bi bi-truck me-2 text-warning"></i>
                    {t('shipping_info')}
                  </Link>
                </li>
                <li className="mb-3">
                  <Link to="/returns" className="text-dark text-decoration-none d-flex align-items-center hover-warning">
                    <i className="bi bi-arrow-clockwise me-2 text-warning"></i>
                    {t('returns_exchanges')}
                  </Link>
                </li>
                <li className="mb-3">
                  <Link to="/size-guide" className="text-dark text-decoration-none d-flex align-items-center hover-warning">
                    <i className="bi bi-rulers me-2 text-warning"></i>
                    {t('size_guide')}
                  </Link>
                </li>
                <li className="mb-3">
                  <Link to="/faq" className="text-dark text-decoration-none d-flex align-items-center hover-warning">
                    <i className="bi bi-question-circle me-2 text-warning"></i>
                    {t('faq')}
                  </Link>
                </li>
                <li className="mb-3">
                  <Link to="/cgv" className="text-dark text-decoration-none d-flex align-items-center hover-warning">
                    <i className="bi bi-file-earmark-text me-2 text-warning"></i>
                    CGV
                  </Link>
                </li>
                <li className="mb-3">
                  <Link to="/plan-du-site" className="text-dark text-decoration-none d-flex align-items-center hover-warning">
                    <i className="bi bi-diagram-3 me-2 text-warning"></i>
                    Plan du site
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colonne 4 : Newsletter et contact */}
            <div className="col-lg-3 col-md-6">
              {/* Newsletter */}
              <div className="mb-4">
                <h6 className="fw-bold text-warning mb-3 text-uppercase letter-spacing-1">
                  <i className="bi bi-envelope-paper me-2"></i>
                  {t('newsletter')}
                </h6>
                <p className="text-dark mb-3 fs-6">
                  {t('newsletter_description')}
                </p>
                <form onSubmit={handleNewsletterSubmit} className="mb-4">
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control border-0 bg-light"
                      placeholder={t('email_placeholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button className="btn btn-warning text-dark fw-bold px-4" type="submit">
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </form>
              </div>

              {/* Contact */}
              <div className="mb-4">
                <h6 className="fw-bold text-warning mb-3 text-uppercase letter-spacing-1">
                  <i className="bi bi-geo-alt me-2"></i>
                  {t('get_in_touch')}
                </h6>
                <div className="text-dark small mb-2 d-flex align-items-start">
                  <i className="bi bi-geo-alt-fill text-warning me-2 mt-1"></i>
                  <address className="mb-0 text-dark">
                    123 Avenue de la Mode<br/>
                    75001 Paris, France
                  </address>
                </div>
                <div className="text-dark small mb-2 d-flex align-items-center">
                  <i className="bi bi-telephone-fill text-warning me-2"></i>
                  <a href="tel:+33123456789" className="text-dark text-decoration-none hover-warning">
                    +33 1 23 45 67 89
                  </a>
                </div>
                <div className="text-dark small mb-3 d-flex align-items-center">
                  <i className="bi bi-envelope-fill text-warning me-2"></i>
                  <a href="mailto:contact@ventechaussure.fr" className="text-dark text-decoration-none hover-warning">
                    contact@ventechaussure.fr
                  </a>
                </div>
              </div>

              {/* Langues et devises */}
              <div className="row g-3">
                <div className="col-6">
                  <h6 className="fw-bold text-warning mb-2 text-uppercase small">
                    <i className="bi bi-globe me-1"></i>
                    {t('language')}
                  </h6>
                  <div className="d-flex gap-1 flex-wrap">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`btn btn-sm ${currentLanguage === lang.code ? 'btn-warning text-dark' : 'btn-outline-warning'} p-1`}
                        style={{minWidth: '40px'}}
                        aria-label={lang.name}
                        title={lang.name}
                      >
                        <img
                          src={lang.flag}
                          alt={lang.name}
                          style={{ width: '16px', height: '12px' }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-6">
                  <h6 className="fw-bold text-warning mb-2 text-uppercase small">
                    <i className="bi bi-currency-exchange me-1"></i>
                    Devise
                  </h6>
                  <select
                    className="form-select form-select-sm bg-dark text-light border-warning"
                    aria-label="Sélecteur de devise"
                  >
                    <option value="EUR">€ EUR</option>
                    <option value="USD">$ USD</option>
                    <option value="GBP">£ GBP</option>
                    <option value="JPY">¥ JPY</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright et liens légaux */}
      <div className="bg-black py-4 border-top border-warning border-opacity-25">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="d-flex align-items-center">
                <p className="text-light mb-0 small me-3">
                  © 2024 {t('company_name')}. {t('all_rights_reserved')}
                </p>
                <div className="d-flex align-items-center text-success small">
                  <i className="bi bi-shield-check me-1"></i>
                  <span>{t('privacy_protected')}</span>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex gap-3 justify-content-md-end flex-wrap">
                <Link to="/privacy" className="text-light text-decoration-none small hover-warning">
                  {t('privacy_policy')}
                </Link>
                <Link to="/terms" className="text-light text-decoration-none small hover-warning">
                  {t('terms_conditions')}
                </Link>
                <Link to="/cookies" className="text-light text-decoration-none small hover-warning">
                  {t('cookies_policy')}
                </Link>
                <Link to="/mentions-legales" className="text-light text-decoration-none small hover-warning">
                  {t('legal')}
                </Link>
              </div>
            </div>
          </div>
          
          {/* Signature */}
          <div className="text-center mt-3 pt-3 border-top border-secondary border-opacity-25">
            <p className="text-light small mb-0 d-flex align-items-center justify-content-center">
              Fait avec <i className="bi bi-heart-fill text-danger mx-1"></i> en Guinée
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
