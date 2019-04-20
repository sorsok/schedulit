import React from 'react';

import GroupPreview from './GroupPreview';
import IndividualPreview from './IndividualPreview';
import Navigation from './Navigation';

import appStyles from '../styles/App.css';


class EventDetailsPage extends React.Component {
  constructor(props) {
    const socket = io();
    super(props);
    this.state = {
      socket,
      earliestMinutesInDay: this.findEarliestMinutesInDay(this.props.eventData.availableSlots),
      latestMinutesInDay: this.findLatestMinutesInDay(this.props.eventData.availableSlots),
    }
    this.getEventParticipationData = this.getEventParticipationData.bind(this);
    this.getEventParticipationData();
    socket.on('participation', () => {
      this.getEventParticipationData();
    });
  }

  getEventData(eventId) {
    return axios
      .get('/api/event/' + eventId)
      .then(({ data }) => {
        return data;
      })
  }


  getEventParticipationData() {
    this.getEventData(this.props.eventData.id)
      .then((eventData) => {
        axios.get('/api/user').then(({ data }) => {
          let userData = data;
          this.setState({ userData });
          Promise.all(eventData.participations.map(participationId => {
            return axios.get('/api/participation/' + participationId).then(({ data }) => data);
          }))
            .then((participations) => {
              let eventParticipationData = eventData;
              // place user participation first in array
              eventParticipationData.participations = participations
                .filter((participation) => participation.userId === userData.id)
                .concat(participations
                  .filter((participation) => participation.userId !== userData.id));
              // convert utc store in db to user timezone
              eventParticipationData.participations =
                eventParticipationData.participations.map((participation => {
                  participation.timeAvailable = participation.timeAvailable.map(timeSlot => {
                    timeSlot.startTime = new Date(timeSlot.startTime);
                    timeSlot.endTime = new Date(timeSlot.endTime);
                    return timeSlot;
                  });
                  return participation;
                }));
              eventParticipationData.availableSlots = eventParticipationData.availableSlots.map(timeSlot => {
                return {
                  startTime: new Date(timeSlot.startTime),
                  endTime: new Date(timeSlot.endTime)
                  // not including preference level as not meaningful
                };
              });
              this.setState({ eventParticipationData });
            })
        })
      })
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

  render() {
    if (this.state.eventParticipationData === undefined) return <div />;
    return (
      <div className={appStyles.masterContainer}>
        <Navigation />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 >{this.props.eventData.title}</h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <IndividualPreview
            socket={this.state.socket}
            eventData={this.state.eventParticipationData}
            earliestMinutesInDay={this.state.earliestMinutesInDay}
            latestMinutesInDay={this.state.latestMinutesInDay}
          />
          <GroupPreview
            eventData={this.state.eventParticipationData}
            earliestMinutesInDay={this.state.earliestMinutesInDay}
            latestMinutesInDay={this.state.latestMinutesInDay}
          />
        </div>
      </div>
    );
  }
}

export default EventDetailsPage;
