"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface BannerCarouselProps {
  images: string[];
}

export default function BannerCarousel({ images }: BannerCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto rotate images every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Drag handling functions
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX - translateX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newTranslateX = clientX - startX;
    setTranslateX(newTranslateX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // If dragged more than 100px, change image
    if (Math.abs(translateX) > 100) {
      if (translateX > 0) {
        // Previous image
        setCurrentImageIndex((prevIndex) =>
          prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
      } else {
        // Next image
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }

    // Reset translate
    setTranslateX(0);
  };

  return (<div
    ref={carouselRef}
    className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl"
    onMouseDown={handleDragStart}
    onMouseMove={handleDragMove}
    onMouseUp={handleDragEnd}
    onMouseLeave={handleDragEnd}
    onTouchStart={handleDragStart}
    onTouchMove={handleDragMove}
    onTouchEnd={handleDragEnd}
  >
    {images.map((image, index) => (
      <div
        key={index}
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
        style={{ transform: `translateX(${index === currentImageIndex ? translateX : 0}px)` }}
      >
        <Image
          src={image}
          alt={`ADMISSION CHALLENGE ${index + 1}`}
          fill
          className="object-cover"
          priority={index === 0}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      </div>
    ))}

    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
      {images.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentImageIndex(index)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
            ? 'bg-white w-8'
            : 'bg-white/50'
            }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  </div>
  );
}
