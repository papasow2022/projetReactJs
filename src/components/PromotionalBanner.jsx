import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const promotionalOffers = [
  {
    id: 1,
    title: "flash_sale_title",
    subtitle: "flash_sale_subtitle",
    discount: "50%",
    endTime: "2024-12-31T23:59:59",
    backgroundColor: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
    image: "/assets/promotional/flash-sale.jpg",
    link: "/catalogue?promo=flash-sale"
  },
  {
    id: 2,
    title: "new_customer_offer_title",
    subtitle: "new_customer_offer_subtitle",
    discount: "20€",
    endTime: "2024-12-31T23:59:59",
    backgroundColor: "linear-gradient(135deg, #4ecdc4, #44a08d)",
    image: "/assets/promotional/new-customer.jpg",
    link: "/catalogue?promo=new-customer"
  },
  {
    id: 3,
    title: "free_shipping_offer_title",
    subtitle: "free_shipping_offer_subtitle",
    discount: "GRATUIT",
    endTime: "2024-12-31T23:59:59",
    backgroundColor: "linear-gradient(135deg, #a8edea, #fed6e3)",
    image: "/assets/promotional/free-shipping.jpg",
    link: "/catalogue?promo=free-shipping"
  }
];

export default function PromotionalBanner() {
  const { t } = useLanguage();
  const [currentOffer, setCurrentOffer] = useState(0);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(promotionalOffers[currentOffer].endTime).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentOffer]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % promotionalOffers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  const currentPromo = promotionalOffers[currentOffer];

  return (
    <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div 
              className="rounded-lg p-4 text-white position-relative overflow-hidden"
              style={{
                background: currentPromo.backgroundColor,
                minHeight: "200px"
              }}
            >
              {/* Background pattern */}
              <div className="position-absolute top-0 end-0 opacity-25">
                <i className="bi bi-gift" style={{ fontSize: "8rem" }}></i>
              </div>

              <div className="row align-items-center">
                <div className="col-lg-8">
                  <div className="mb-3">
                    <span className="badge bg-white text-dark px-3 py-2 mb-2">
                      <i className="bi bi-clock me-1"></i>
                      {t('limited_time')}
                    </span>
                  </div>

                  <h2 className="fw-bold mb-2" style={{ fontSize: "2.5rem" }}>
                    {t(currentPromo.title)}
                  </h2>
                  
                  <p className="mb-3" style={{ fontSize: "1.2rem", opacity: 0.9 }}>
                    {t(currentPromo.subtitle)}
                  </p>

                  {/* Countdown timer */}
                  <div className="mb-4">
                    <div className="d-flex gap-3">
                      <div className="text-center">
                        <div className="bg-white text-dark rounded p-2" style={{ minWidth: "60px" }}>
                          <div className="fw-bold fs-4">{formatNumber(timeLeft.days || 0)}</div>
                          <small className="text-muted">{t('days')}</small>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-white text-dark rounded p-2" style={{ minWidth: "60px" }}>
                          <div className="fw-bold fs-4">{formatNumber(timeLeft.hours || 0)}</div>
                          <small className="text-muted">{t('hours')}</small>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-white text-dark rounded p-2" style={{ minWidth: "60px" }}>
                          <div className="fw-bold fs-4">{formatNumber(timeLeft.minutes || 0)}</div>
                          <small className="text-muted">{t('minutes')}</small>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-white text-dark rounded p-2" style={{ minWidth: "60px" }}>
                          <div className="fw-bold fs-4">{formatNumber(timeLeft.seconds || 0)}</div>
                          <small className="text-muted">{t('seconds')}</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link 
                    to={currentPromo.link}
                    className="btn btn-light btn-lg px-4 fw-bold"
                    style={{ 
                      fontSize: "1.1rem",
                      transition: "all 0.3s ease"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <i className="bi bi-arrow-right me-2"></i>
                    {t('shop_now')}
                  </Link>
                </div>

                <div className="col-lg-4 text-center">
                  <div className="position-relative">
                    <div 
                      className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto"
                      style={{ 
                        width: "120px", 
                        height: "120px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                      }}
                    >
                      <div className="text-center">
                        <div className="fw-bold text-danger" style={{ fontSize: "2rem" }}>
                          {currentPromo.discount}
                        </div>
                        <div className="text-muted small">
                          {t('off')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation dots */}
              <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                <div className="d-flex gap-2">
                  {promotionalOffers.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentOffer(index)}
                      className={`btn btn-sm rounded-circle ${
                        index === currentOffer ? 'bg-white' : 'bg-white opacity-50'
                      }`}
                      style={{ width: "12px", height: "12px" }}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 