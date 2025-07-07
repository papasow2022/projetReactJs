import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const videos = [
  {
    id: 1,
    title: "video_collection_title",
    description: "video_collection_desc",
    thumbnail: "/assets/videopromo/Partie1DDLAvec Drop.mp4",
    videoUrl: "/assets/videopromo/Partie1DDLAvec Drop.mp4",
    duration: "",
    category: "collection"
  },
  {
    id: 2,
    title: "video_quality_title",
    description: "video_quality_desc",
    thumbnail: "/assets/videopromo/Partie1DDLAlter.mp4",
    videoUrl: "/assets/videopromo/Partie1DDLAlter.mp4",
    duration: "",
    category: "quality"
  },
  {
    id: 3,
    title: "video_trends_title",
    description: "video_trends_desc",
    thumbnail: "/assets/videopromo/Partie1DDL.mp4",
    videoUrl: "/assets/videopromo/Partie1DDL.mp4",
    duration: "",
    category: "trends"
  }
];

export default function VideoSection() {
  const { t } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openVideo = (video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
  };

  return (
    <>
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          {/* Header */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <h2 className="fw-bold mb-3" style={{ color: "#232f3e" }}>
                <i className="bi bi-play-circle-fill me-2 text-primary"></i>
                {t('discover_our_videos')}
              </h2>
              <p className="text-muted" style={{ fontSize: "18px" }}>
                {t('video_section_subtitle')}
              </p>
            </div>
          </div>

          {/* Video Grid */}
          <div className="row g-4">
            {videos.map((video) => (
              <div key={video.id} className="col-lg-4 col-md-6">
                <div 
                  className="card border-0 shadow-sm h-100"
                  style={{ 
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                  }}
                  onClick={() => openVideo(video)}
                >
                  {/* Thumbnail */}
                  <div className="position-relative">
                    <img
                      src={video.thumbnail}
                      className="card-img-top"
                      alt={t(video.title)}
                      style={{ height: "200px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x200/6c757d/ffffff?text=Video+Thumbnail";
                      }}
                    />
                    
                    {/* Play button overlay */}
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <div className="bg-white rounded-circle d-flex align-items-center justify-content-center"
                           style={{ width: "60px", height: "60px", opacity: 0.9 }}>
                        <i className="bi bi-play-fill text-primary fs-4"></i>
                      </div>
                    </div>

                    {/* Duration badge */}
                    <div className="position-absolute bottom-0 end-0 m-2">
                      <span className="badge bg-dark text-white px-2 py-1">
                        {video.duration}
                      </span>
                    </div>
                  </div>

                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-2" style={{ color: "#232f3e" }}>
                      {t(video.title)}
                    </h5>
                    <p className="card-text text-muted">
                      {t(video.description)}
                    </p>
                    
                    <div className="d-flex align-items-center justify-content-between">
                      <small className="text-muted">
                        <i className="bi bi-eye me-1"></i>
                        {t('watch_now')}
                      </small>
                      <span className="badge bg-primary">
                        {t(video.category)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Video */}
          <div className="row mt-5 pt-5">
            <div className="col-12">
              <div className="bg-white rounded-lg p-5 shadow-lg">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <h3 className="fw-bold mb-3" style={{ color: "#232f3e" }}>
                      {t('featured_video_title')}
                    </h3>
                    <p className="text-muted mb-4">
                      {t('featured_video_desc')}
                    </p>
                    <div className="d-flex gap-3">
                      <button 
                        className="btn btn-primary btn-lg"
                        onClick={() => openVideo(videos[0])}
                      >
                        <i className="bi bi-play-fill me-2"></i>
                        {t('watch_featured')}
                      </button>
                      <button className="btn btn-outline-primary btn-lg">
                        <i className="bi bi-share me-2"></i>
                        {t('share_video')}
                      </button>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div 
                      className="position-relative rounded overflow-hidden"
                      style={{ cursor: "pointer" }}
                      onClick={() => openVideo(videos[0])}
                    >
                      <img
                        src={videos[0].thumbnail}
                        alt={t(videos[0].title)}
                        className="w-100"
                        style={{ height: "300px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/600x300/6c757d/ffffff?text=Featured+Video";
                        }}
                      />
                      <div className="position-absolute top-50 start-50 translate-middle">
                        <div className="bg-white rounded-circle d-flex align-items-center justify-content-center"
                             style={{ width: "80px", height: "80px", opacity: 0.9 }}>
                          <i className="bi bi-play-fill text-primary fs-1"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video categories */}
          <div className="row mt-5 pt-5">
            <div className="col-12">
              <div className="text-center">
                <h4 className="fw-bold mb-4" style={{ color: "#232f3e" }}>
                  {t('video_categories')}
                </h4>
                <div className="row justify-content-center">
                  <div className="col-md-3 col-6 mb-3">
                    <div className="bg-light rounded p-3 text-center">
                      <i className="bi bi-collection-play text-primary fs-1 mb-2"></i>
                      <div className="fw-bold">{t('product_collections')}</div>
                      <small className="text-muted">12 {t('videos')}</small>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <div className="bg-light rounded p-3 text-center">
                      <i className="bi bi-star text-warning fs-1 mb-2"></i>
                      <div className="fw-bold">{t('quality_tests')}</div>
                      <small className="text-muted">8 {t('videos')}</small>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <div className="bg-light rounded p-3 text-center">
                      <i className="bi bi-trending-up text-success fs-1 mb-2"></i>
                      <div className="fw-bold">{t('fashion_trends')}</div>
                      <small className="text-muted">15 {t('videos')}</small>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <div className="bg-light rounded p-3 text-center">
                      <i className="bi bi-people text-info fs-1 mb-2"></i>
                      <div className="fw-bold">{t('customer_reviews')}</div>
                      <small className="text-muted">20 {t('videos')}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showModal && selectedVideo && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">{t(selectedVideo.title)}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body p-0">
                <div className="ratio ratio-16x9">
                  <iframe
                    src={selectedVideo.videoUrl}
                    title={t(selectedVideo.title)}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div className="modal-footer border-0">
                <p className="text-muted mb-0">
                  {t(selectedVideo.description)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 