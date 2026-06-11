import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styling/PhotoCarousel.css';

const SWIPE_THRESHOLD = 60;

export default function PhotoCarousel({ photos = [], alt = 'Profile photo', className = '' }) {
  const [[index, dir], setState] = useState([0, 0]);
  if (!photos.length) return null;

  // Clamp in case a photo was just removed
  const current = Math.min(index, photos.length - 1);
  const go = (d) => setState([(current + d + photos.length) % photos.length, d]);

  return (
    <div className={`photo-carousel ${className}`}>
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <motion.img
          key={photos[current]}
          src={photos[current]}
          alt={alt}
          className="photo-carousel-img"
          custom={dir}
          initial={{ x: dir > 0 ? 90 : dir < 0 ? -90 : 0, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: dir > 0 ? -90 : 90, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          drag={photos.length > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.5}
          onDragEnd={(_, info) => {
            if (info.offset.x < -SWIPE_THRESHOLD) go(1);
            else if (info.offset.x > SWIPE_THRESHOLD) go(-1);
          }}
          draggable={false}
        />
      </AnimatePresence>

      {photos.length > 1 && (
        <>
          <button type="button" className="carousel-arrow carousel-arrow--left"
            aria-label="Previous photo" onClick={() => go(-1)}>‹</button>
          <button type="button" className="carousel-arrow carousel-arrow--right"
            aria-label="Next photo" onClick={() => go(1)}>›</button>
          <div className="carousel-dots">
            {photos.map((p, i) => (
              <button
                key={p}
                type="button"
                aria-label={`Photo ${i + 1}`}
                className={`carousel-dot${i === current ? ' active' : ''}`}
                onClick={() => setState([i, i > current ? 1 : -1])}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
