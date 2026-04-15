import { useEffect, useRef, useState } from 'react';
import styles from './EventCard.module.css';
import { MapPin, Clock } from 'lucide-react';

interface EventCardProps {
  title: string;
  location: string;
  time: string;
  imageUrl: string;
  index?: number;
}

const EventCard = ({ title, location, time, imageUrl, index = 0 }: EventCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${visible ? styles.visible : ''}`}
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={title} className={styles.image} />
      ) : (
        <div className={styles.imageFallback} />
      )}

      <div className={styles.overlay} />

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          <div className={styles.metaRow}>
            <MapPin size={14} aria-hidden />
            <span>{location}</span>
          </div>
          <div className={styles.metaRow}>
            <Clock size={14} aria-hidden />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
