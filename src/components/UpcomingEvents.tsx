import EventCard from './EventCard';
import styles from './UpcomingEvents.module.css';

const events = [
  {
    id: 1,
    title: 'Thai Tea Sale',
    location: 'Mckeldin Mall',
    time: '9am – 7pm',
    imageUrl: '',
  },
  {
    id: 2,
    title: 'Thai Tea Sale',
    location: 'Mckeldin Mall',
    time: '9am – 7pm',
    imageUrl: '',
  },
  {
    id: 3,
    title: 'Thai Tea Sale',
    location: 'Mckeldin Mall',
    time: '9am – 7pm',
    imageUrl: '',
  },
];

const UpcomingEvents = () => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.badge}>Events</span>
        <h2 className={styles.heading}>Upcoming Events</h2>
        <p className={styles.subtitle}>
          Here's Everything Exciting We've Got Planned for You Soon
        </p>
      </div>

      <div className={styles.grid}>
        {events.map((event, i) => (
          <EventCard
            key={event.id}
            index={i}
            title={event.title}
            location={event.location}
            time={event.time}
            imageUrl={event.imageUrl}
          />
        ))}
      </div>
    </section>
  );
};

export default UpcomingEvents;
