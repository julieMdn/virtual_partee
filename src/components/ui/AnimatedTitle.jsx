"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const AnimatedTitle = ({ children, className }) => {
  const titleRef = useRef(null);
  let tl = gsap.timeline();

  useEffect(() => {
    // Assurez-vous que le DOM est chargé
    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
        },
        ">0.3"
      );
    }
  }, []);

  return (
    <h1 ref={titleRef} className={className}>
      {children}
    </h1>
  );
};

export default AnimatedTitle;
