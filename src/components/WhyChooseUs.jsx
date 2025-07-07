import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const advantages = [
  {
    id: 1,
    icon: "bi-award",
    title: "quality_guarantee_title",
    description: "quality_guarantee_desc",
    color: "text-primary"
  },
  {
    id: 2,
    icon: "bi-truck",
    title: "fast_delivery_title",
    description: "fast_delivery_desc",
    color: "text-success"
  },
  {
    id: 3,
    icon: "bi-shield-check",
    title: "secure_payment_title",
    description: "secure_payment_desc",
    color: "text-info"
  },
  {
    id: 4,
    icon: "bi-arrow-clockwise",
    title: "easy_returns_title",
    description: "easy_returns_desc",
    color: "text-warning"
  },
  {
    id: 5,
    icon: "bi-headset",
    title: "customer_support_title",
    description: "customer_support_desc",
    color: "text-danger"
  },
  {
    id: 6,
    icon: "bi-globe",
    title: "worldwide_shipping_title",
    description: "worldwide_shipping_desc",
    color: "text-secondary"
  }
];

const stats = [
  { number: "50K+", label: "happy_customers" },
  { number: "1000+", label: "products" },
  { number: "24/7", label: "support" },
  { number: "98%", label: "satisfaction_rate" }
];

export default function WhyChooseUs() {
  const { t } = useLanguage();

  return (
    <section className="py-5" style={{ backgroundColor: "#ffffff" }}>
      <div className="container">
        {/* Header */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="fw-bold mb-3" style={{ color: "#232f3e" }}>
              <i className="bi bi-star-fill me-2 text-warning"></i>
              {t('why_choose_us')}
            </h2>
            <p className="text-muted" style={{ fontSize: "18px" }}>
              {t('why_choose_us_subtitle')}
            </p>
          </div>
        </div>

        {/* Advantages Grid */}
        <div className="row g-4 mb-5">
          {advantages.map((advantage) => (
            <div key={advantage.id} className="col-lg-4 col-md-6">
              <div 
                className="card h-100 border-0 shadow-sm text-center p-4"
                style={{ 
                  transition: "all 0.3s ease",
                  borderRadius: "15px"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                <div className="mb-3">
                  <div 
                    className={`${advantage.color} d-inline-flex align-items-center justify-content-center rounded-circle`}
                    style={{ 
                      width: "80px", 
                      height: "80px", 
                      fontSize: "2rem",
                      backgroundColor: "rgba(0,123,255,0.1)"
                    }}
                  >
                    <i className={`bi ${advantage.icon}`}></i>
                  </div>
                </div>
                
                <h5 className="fw-bold mb-3" style={{ color: "#232f3e" }}>
                  {t(advantage.title)}
                </h5>
                
                <p className="text-muted mb-0">
                  {t(advantage.description)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="bg-gradient-primary rounded-lg p-5 text-white">
              <div className="row text-center">
                {stats.map((stat, index) => (
                  <div key={index} className="col-md-3 mb-3">
                    <div className="d-flex flex-column align-items-center">
                      <div className="fw-bold" style={{ fontSize: "3rem" }}>
                        {stat.number}
                      </div>
                      <div className="text-white-50">
                        {t(stat.label)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="row mt-5 pt-5">
          <div className="col-12">
            <div className="text-center">
              <h5 className="fw-bold mb-4" style={{ color: "#232f3e" }}>
                {t('trusted_by')}
              </h5>
              <div className="row justify-content-center align-items-center">
                <div className="col-md-2 col-4 mb-3">
                  <div className="bg-light rounded p-3 text-center">
                    <i className="bi bi-patch-check text-success fs-2"></i>
                    <div className="small text-muted mt-1">{t('certified_products')}</div>
                  </div>
                </div>
                <div className="col-md-2 col-4 mb-3">
                  <div className="bg-light rounded p-3 text-center">
                    <i className="bi bi-shield-lock text-primary fs-2"></i>
                    <div className="small text-muted mt-1">{t('secure_website')}</div>
                  </div>
                </div>
                <div className="col-md-2 col-4 mb-3">
                  <div className="bg-light rounded p-3 text-center">
                    <i className="bi bi-award text-warning fs-2"></i>
                    <div className="small text-muted mt-1">{t('award_winning')}</div>
                  </div>
                </div>
                <div className="col-md-2 col-4 mb-3">
                  <div className="bg-light rounded p-3 text-center">
                    <i className="bi bi-people text-info fs-2"></i>
                    <div className="small text-muted mt-1">{t('community_trusted')}</div>
                  </div>
                </div>
                <div className="col-md-2 col-4 mb-3">
                  <div className="bg-light rounded p-3 text-center">
                    <i className="bi bi-clock-history text-secondary fs-2"></i>
                    <div className="small text-muted mt-1">{t('years_experience')}</div>
                  </div>
                </div>
                <div className="col-md-2 col-4 mb-3">
                  <div className="bg-light rounded p-3 text-center">
                    <i className="bi bi-heart text-danger fs-2"></i>
                    <div className="small text-muted mt-1">{t('customer_loved')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="row mt-5 pt-5">
          <div className="col-12 text-center">
            <div className="bg-light rounded-lg p-5">
              <h4 className="fw-bold mb-3" style={{ color: "#232f3e" }}>
                {t('ready_to_shop')}
              </h4>
              <p className="text-muted mb-4">
                {t('ready_to_shop_desc')}
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button className="btn btn-primary btn-lg px-4">
                  <i className="bi bi-cart me-2"></i>
                  {t('start_shopping')}
                </button>
                <button className="btn btn-outline-primary btn-lg px-4">
                  <i className="bi bi-question-circle me-2"></i>
                  {t('learn_more')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 