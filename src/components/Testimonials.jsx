import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const testimonials = [
  {
    id: 1,
    name: "Marie Dubois",
    location: "Paris, France",
    rating: 5,
    image: "/assets/avis/20241029_100602.jpg",
    text: "testimonial_1_text",
    product: "Nike Air Max 270"
  },
  {
    id: 2,
    name: "Carlos Rodriguez",
    location: "Madrid, Espagne",
    rating: 5,
    image: "/assets/avis/IMG_6378.jpeg",
    text: "testimonial_2_text",
    product: "Adidas Ultraboost 22"
  },
  {
    id: 3,
    name: "Anna Schmidt",
    location: "Berlin, Allemagne",
    rating: 5,
    image: "/assets/avis/IMG_3580.JPG",
    text: "testimonial_3_text",
    product: "Puma RS-X"
  },
  {
    id: 4,
    name: "John Smith",
    location: "Londres, UK",
    rating: 5,
    image: "/assets/avis/IMG_5789.JPG",
    text: "testimonial_4_text",
    product: "New Balance 574"
  }
];

export default function Testimonials() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i 
        key={i} 
        className={`bi bi-star${i < rating ? '-fill' : ''} text-warning`}
        style={{ fontSize: '16px' }}
      ></i>
    ));
  };

  return (
    <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center mb-5">
            <h2 className="fw-bold mb-3" style={{ color: "#232f3e" }}>
              <i className="bi bi-chat-quote-fill me-2 text-primary"></i>
              {t('customer_testimonials')}
            </h2>
            <p className="text-muted" style={{ fontSize: "18px" }}>
              {t('testimonials_subtitle')}
            </p>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="position-relative">
              {/* Boutons de navigation */}
              <button
                onClick={prevTestimonial}
                className="btn btn-light position-absolute top-50 start-0 translate-middle-y"
                style={{
                  zIndex: 10,
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              
              <button
                onClick={nextTestimonial}
                className="btn btn-light position-absolute top-50 end-0 translate-middle-y"
                style={{
                  zIndex: 10,
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}
              >
                <i className="bi bi-chevron-right"></i>
              </button>

              {/* Témoignage actif */}
              <div className="bg-white rounded-lg p-5 shadow-lg">
                <div className="row align-items-center">
                  <div className="col-md-4 text-center mb-4 mb-md-0">
                    <div className="position-relative d-inline-block">
                      <img
                        src={testimonials[activeIndex].image}
                        alt={testimonials[activeIndex].name}
                        className="rounded-circle"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          border: "4px solid #fff",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                        }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/120x120/6c757d/ffffff?text=" + testimonials[activeIndex].name.charAt(0);
                        }}
                      />
                      <div className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                           style={{ width: "30px", height: "30px" }}>
                        <i className="bi bi-quote fs-6"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-8">
                    <div className="mb-3">
                      {renderStars(testimonials[activeIndex].rating)}
                    </div>
                    
                    <blockquote className="mb-3" style={{ fontSize: "18px", fontStyle: "italic", color: "#495057" }}>
                      "{testimonials[activeIndex].text.startsWith('testimonial_') ? t(testimonials[activeIndex].text) : testimonials[activeIndex].text}"
                    </blockquote>
                    
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h6 className="fw-bold mb-1" style={{ color: "#232f3e" }}>
                          {testimonials[activeIndex].name}
                        </h6>
                        <small className="text-muted">
                          {testimonials[activeIndex].location}
                        </small>
                      </div>
                      <div className="text-end">
                        <small className="text-muted d-block">{t('purchased')}</small>
                        <span className="fw-bold text-primary">{testimonials[activeIndex].product}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicateurs */}
              <div className="text-center mt-4">
                <div className="d-flex justify-content-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`btn btn-sm rounded-circle ${
                        index === activeIndex ? 'btn-primary' : 'btn-outline-primary'
                      }`}
                      style={{ width: "12px", height: "12px" }}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="row mt-5 pt-5">
          <div className="col-12">
            <div className="row text-center">
              <div className="col-md-3 mb-3">
                <div className="d-flex flex-column align-items-center">
                  <div className="fw-bold text-primary" style={{ fontSize: "2.5rem" }}>98%</div>
                  <div className="text-muted">{t('satisfied_customers')}</div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="d-flex flex-column align-items-center">
                  <div className="fw-bold text-primary" style={{ fontSize: "2.5rem" }}>50K+</div>
                  <div className="text-muted">{t('happy_customers')}</div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="d-flex flex-column align-items-center">
                  <div className="fw-bold text-primary" style={{ fontSize: "2.5rem" }}>4.9/5</div>
                  <div className="text-muted">{t('average_rating')}</div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="d-flex flex-column align-items-center">
                  <div className="fw-bold text-primary" style={{ fontSize: "2.5rem" }}>24/7</div>
                  <div className="text-muted">{t('customer_support')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 