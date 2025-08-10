// src/pages/Home.jsx
import React from "react";
import MainContent from "../components/MainContent";
import DailyDealsHomeSection from "../components/DailyDealsHomeSection";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <MainContent />
      <DailyDealsHomeSection />
      <WhyChooseUs />
      <Testimonials />
      <Footer />
    </>
  );
}
