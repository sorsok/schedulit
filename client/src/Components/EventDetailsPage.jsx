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
        const newState = {
          participationId: data.createParticipation._id,
          eventId: data.createParticipation.event._id,
          title: data.createParticipation.event.title,
          description: data.createParticipation.event.description,
          availableSlots: data.createParticipation.event.availableSlots.map(this.parseTimeSlot)
        }
        this.setState(newState);
      });
    this.renderEventDetails = this.renderEventDetails.bind(this);
    this.findMinMaxTime = this.findMinMaxTime.bind(this);
    this.findAvailableDates = this.findAvailableDates.bind(this);
  }

  parseTimeSlot(slot) {
    return {
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime)
    }
  }

  findMinMaxTime() {
    let earliestTimeInDay = 24 * 60 * 60 * 1000;
    let latestTimeInDay = 0;
    this.state.availableSlots.forEach(slot => {
      let startOfDay = new Date(slot.startTime.toDateString());
      let start = slot.startTime.getTime() - startOfDay.getTime();
      earliestTimeInDay = start < earliestTimeInDay ? start : earliestTimeInDay;
      let end = slot.endTime.getTime() - startOfDay.getTime();
      latestTimeInDay = end > latestTimeInDay ? end : latestTimeInDay;
    });
    return { earliestTimeInDay, latestTimeInDay };
  }


  findAvailableDates() {
    let availableDates = {};
    this.state.availableSlots.forEach(slot => {
      availableDates[slot.startTime.toDateString()] = true;
    });
    availableDates = Object.keys(availableDates).map(date => new Date(date));
    availableDates.sort();
    return availableDates;
  }

  renderEventDetails() {
    const { eventId, participationId, title, description } = this.state;
    if (!title) {
      return <div />;
    }
    const minMaxTime = this.findMinMaxTime();
    const availableDates = this.findAvailableDates();

    if (title) {
      return (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 >{title}</h1>
            {description}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <IndividualPreview
              participationId={participationId}
              eventId={eventId}
              minMaxTime={minMaxTime}
              availableDates={availableDates}
            />
            <GroupPreview
              eventId={eventId}
              minMaxTime={minMaxTime}
              availableDates={availableDates}
            />
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
