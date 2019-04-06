import * as React from 'react';

import EventCard from './EventCard';
import { User, Event } from './MainDisplay';

import * as styles from '../styles/UserEventsPage.css';

interface Props {
  viewEventDetails: Function,
  user: User
}

const UserEventsPage = (props: Props) => {
  if (props.user) {
    return (
      <div className={styles.container}>
        <h2 className={styles.h2}>My Events</h2>
        <div className={styles.eventListContainer}>
          <div className={styles.eventList}>
            <h3 className={styles.h3} >Events Created</h3>
            {props.user.eventsCreated.map((event: Event, index: number) => {
              return <EventCard event={event} key={index} viewEventDetails={props.viewEventDetails} />;
            })}
          </div>
          <div className={styles.eventList}>
            <h3 className={styles.h3}>Events Joined</h3>
            {props.user.eventsJoined.map((event: Event, index: number) => {
              return <EventCard event={event} key={index} viewEventDetails={props.viewEventDetails} />;
            })}
          </div>
        </div>
      </div>
    );
  }
  return <div />;
};

export default UserEventsPage;
