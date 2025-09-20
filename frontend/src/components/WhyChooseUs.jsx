import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { BiCheckShield, BiPackage, BiLock, BiUndo, BiSupport, BiWorld } from 'react-icons/bi';

const WhyChooseUs = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      id: 'quality',
      icon: <BiCheckShield />,
      title: t('quality_guarantee_title'),
      description: t('quality_guarantee_desc')
    },
    {
      id: 'delivery',
      icon: <BiPackage />,
      title: t('fast_delivery_title'),
      description: t('fast_delivery_desc')
    },
    {
      id: 'payment',
      icon: <BiLock />,
      title: t('secure_payment_title'),
      description: t('secure_payment_desc')
    },
    {
      id: 'returns',
      icon: <BiUndo />,
      title: t('easy_returns_title'),
      description: t('easy_returns_desc')
    },
    {
      id: 'support',
      icon: <BiSupport />,
      title: t('customer_support_title'),
      description: t('customer_support_desc')
    },
    {
      id: 'shipping',
      icon: <BiWorld />,
      title: t('worldwide_shipping_title'),
      description: t('worldwide_shipping_desc')
    }
  ];

  return (
    <section className="why-choose-us py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2" style={{ color: '#232f3e' }}>{t('why_choose_us')}</h2>
          <p className="text-muted">{t('why_choose_us_subtitle')}</p>
        </div>

        <div className="row g-4">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body text-center p-4">
                  <div className="icon-wrapper mb-3">
                    <span className="icon-circle">
                      {React.cloneElement(benefit.icon, { className: 'fs-3 text-primary' })}
                    </span>
                  </div>
                  <h5 className="card-title fw-bold mb-3">{benefit.title}</h5>
                  <p className="card-text text-muted">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .why-choose-us {
          background-color: #f8f9fa;
        }
        .icon-circle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background-color: rgba(0, 123, 255, 0.1);
          margin-bottom: 1rem;
        }
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;