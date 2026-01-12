"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BrandLetterProps } from "../types/BrandLetter";

export const BrandLetter = ({
  letter,
  quantity = 2,
  delay = 0,
  time = 1000,
  height = 18,
}: BrandLetterProps) => {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(1);

  useEffect(() => {
    const changeLetter = setTimeout(() => {
      setInterval(() => {
        setCurrentLetterIndex((prev) => {
          if (prev < quantity) {
            return prev + 1;
          }
          return 1;
        });
      }, time);
    }, delay);

    return () => {
      clearInterval(changeLetter);
    };
  }, []);

  return (
    <div id={letter} className="relative">
      <img
        src={`/brand/${letter}-${currentLetterIndex}.svg`}
        style={{
          height: height,
          width: "auto",
        }}
        alt={letter}
      />
    </div>
  );
};
