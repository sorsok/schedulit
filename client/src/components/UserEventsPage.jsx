import React from 'react';
import { graphql } from 'react-apollo';

import Navigation from './Navigation';
import EventCard from './EventCard';
import userEvents from '../queries/userEvents';

import loader from '../assets/loader.gif';
import appStyles from '../styles/App.module.css';
import styles from '../styles/UserEventsPage.module.css';

class UserEventsPage extends React.Component {
  parseTimeSlot = (slot) => {
    return {
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime)
    }
  }

  renderEvents = () => {
    if (this.props.data.loading) {
      return <img alt="loader" className={appStyles.loader} src={loader} />;
    }
    if (!this.props.data.me && !this.props.data.loading) {
      this.props.history.push('/login');
      return <div />;
    }
    const { participations } = this.props.data.me;
    return participations.map(({ event }, index) => {
      event.availableSlots = event.availableSlots.map(this.parseTimeSlot)
      return <EventCard event={event} key={index} />;
    });

  }

  render() {
    return (
      <div className={appStyles.masterContainer}>
        <Navigation />
        <div className={styles.container}>
          <h2 className={styles.h2}>My Events</h2>
          <div className={styles.eventListContainer}>
            <div className={styles.eventList}>
              {this.renderEvents()}
            </div>
          </div>
        </div>
      </div>
    );

  }
};


export default graphql(userEvents)(UserEventsPage);
