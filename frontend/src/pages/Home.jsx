// src/pages/Home.jsx
import React from "react";
import MainContent from "../components/MainContent";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <MainContent />
      <WhyChooseUs />
      <Testimonials />
      <Footer />
    </>
  );
}
