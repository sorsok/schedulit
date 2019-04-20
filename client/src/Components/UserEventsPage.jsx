import React from 'react';
import { graphql } from 'react-apollo';

import EventCard from './EventCard';
import query from '../queries/userEvents';

import styles from '../styles/UserEventsPage.css';

class UserEventsPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.data.loading) {
      return <div>Loading...</div>;
    }
    console.log(this.props.data);
    const { participations } = this.props.data.me;
    return (
      <div className={styles.container}>
        <h2 className={styles.h2}>My Events</h2>
        <div className={styles.eventListContainer}>
          <div className={styles.eventList}>
            {participations.map(({ event }, index) => {
              return <EventCard event={event} key={index} />;
            })}
          </div>
        </div>
      </div>
    );

  }
};


export default graphql(query)(UserEventsPage);
