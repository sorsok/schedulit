import React from 'react';
import { graphql } from 'react-apollo';

import GroupPreview from './GroupPreview';
import IndividualPreview from './IndividualPreview';
import Navigation from './Navigation';

import createParticipation from '../queries/createParticipation';
import appStyles from '../styles/App.css';
import loader from '../assets/loader.gif';


class EventDetailsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.props.mutate({ variables: { eventId: props.match.params.id } })
      .then(({ data }) => {
        console.log(data);
        this.setState(data.createParticipation.event);
      });
    this.renderEventDetails = this.renderEventDetails.bind(this);
  }

  findEarliestMinutesInDay(slots) {
    let earliestMinutesInDay = 24 * 60;
    slots.forEach(slot => {
      let start = slot.startTime.getHours() * 60 + slot.startTime.getMinutes();
      if (start < earliestMinutesInDay) earliestMinutesInDay = start;
    });
    return earliestMinutesInDay;
  }

  findLatestMinutesInDay(slots) {
    let latestMinutesInDay = 0;
    slots.forEach(slot => {
      let end = slot.endTime.getHours() * 60 + slot.endTime.getMinutes();
      if (end > latestMinutesInDay) latestMinutesInDay = end;
    });
    return latestMinutesInDay;
  }

  renderEventDetails() {
    const { _id, title, description } = this.state;
    if (!title) {
      return <img className={appStyles.loader} src={loader} />;
    }
    if (title) {
      return (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 >{title}</h1>
            {description}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <IndividualPreview eventId={_id} />
            {/* <GroupPreview eventId={_id} /> */}
          </div>
        </>
      );
    } else {
      return <div>Oops, it seems as though this event doesn't exist!</div>
    }
  }

  render() {
    return (
      <div className={appStyles.masterContainer}>
        <Navigation />
        {this.renderEventDetails()}
      </div>
    );
  }
}

export default graphql(createParticipation)(EventDetailsPage);
