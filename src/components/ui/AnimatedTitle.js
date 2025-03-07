"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const AnimatedTitle = ({ children, className }) => {
  const titleRef = useRef(null);

  useEffect(() => {
    // Assurez-vous que le DOM est chargé
    if (titleRef.current) {
      // Animation initiale - masquer le titre et le mettre à l'échelle 0.8
      gsap.set(titleRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 20,
      });

      // Animation d'apparition
      gsap.to(titleRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      });
    }
  }, []);

  return (
    <h1 ref={titleRef} className={className}>
      {children}
    </h1>
  );
};

export default AnimatedTitle;
