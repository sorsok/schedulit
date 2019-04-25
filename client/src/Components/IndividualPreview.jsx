import React from "react";
import { graphql } from 'react-apollo';

import SelectableTimeSlot from "./SelectableTimeSlot";
import styles from "../styles/IndividualPreview.css";
import TimeAxis from "./TimeAxis";

import myParticipation from '../queries/myParticipation';
import updateMyParticipation from '../queries/updateMyParticipation';
import loader from '../assets/loader.gif';
import appStyles from '../styles/App.css';


class IndividualPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateTimeAvailable = this.updateTimeAvailable.bind(this);
  }

  findEarliestLatestTime(availableSlots) {
    let earliestTimeInDay = 24 * 60 * 60 * 1000;
    let latestTimeInDay = 0;
    availableSlots.forEach(slot => {
      let startOfDay = new Date(slot.startTime.toDateString());
      let start = slot.startTime.getTime() - startOfDay.getTime();
      earliestTimeInDay = start < earliestTimeInDay ? start : earliestTimeInDay;
      let end = slot.endTime.getTime() - startOfDay.getTime();
      latestTimeInDay = end > latestTimeInDay ? end : latestTimeInDay;
    });
    return { earliestTimeInDay, latestTimeInDay };
  }

  findAvailableDates(availableSlots) {
    let availableDates = {};
    availableSlots.forEach(slot => {
      availableDates[slot.startTime.toDateString()] = true;
    });
    availableDates = Object.keys(availableDates).map(date => new Date(date));
    availableDates.sort();
    return availableDates;
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.checked });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { eventId } = this.props;
    let newParticipation = {};
    newParticipation.unavailable = this.state.unavailable;
    newParticipation.timeAvailable = [];
    if (!this.state.unavailable) {
      for (let timestamp in this.state.allTimeSlotStatuses) {
        if (this.state.allTimeSlotStatuses[timestamp]) {
          let timestampObject = new Date(timestamp);
          let currTimeSlot = {};
          currTimeSlot.startTime = timestampObject;
          currTimeSlot.endTime = new Date(
            timestampObject.getTime() + 15 * 60 * 1000
          );
          newParticipation.timeAvailable.push(currTimeSlot);
        }
      }
    }
    this.props.mutate({
      variables: { participation: newParticipation },
      refetchQueries: [{ query: myParticipation, variables: { eventId } }]
    });
  }

  updateTimeAvailable(timestamp, value) {
    let { timeAvailable } = this.state;
    timeAvailable[timestamp] = value;
    this.setState({ timeAvailable });
  }

  timestampLiesInSlot(timestamp, timeSlot) {
    timestamp = new Date(timestamp);
    return (
      timestamp.getTime() >= timeSlot.startTime.getTime() &&
      timestamp.getTime() < timeSlot.endTime.getTime()
    );
  }

  parseTimeSlot(slot) {
    return {
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data.loading && !this.props.data.loading) {
      //just received data from server
      //initialize state
      const { timeAvailable, unavailable } = this.props.data.myParticipation;
      const { availableSlots } = this.props.data.myParticipation.event;
      const timeAvailableParsed = timeAvailable.map(this.parseTimeSlot);
      const availableSlotsParsed = availableSlots.map(this.parseTimeSlot);
      this.setState({
        timeAvailable: timeAvailableParsed,
        unavailable,
        availableSlots: availableSlotsParsed
      });
    }
  }

  render() {
    if (!this.state.availableSlots) {
      return <img className={appStyles.loader} src={loader} />;
    }
    const { timeAvailable, unavailable, availableSlots } = this.state;
    const { earliestTimeInDay, latestTimeInDay } = this.findEarliestLatestTime(availableSlots);
    const availableDates = this.findAvailableDates(availableSlots);
    return (
      <div className={styles.container}>
        <div className={styles.title}>My Availability</div>
        <form onSubmit={this.handleSubmit}>
          <div
            className={styles.timeSlotsContainer}
            style={unavailable ? { display: "none" } : {}}
          >
            <TimeAxis
              earliestTimeInDay={earliestTimeInDay}
              latestTimeInDay={latestTimeInDay}
              numberOfDays={availableDates.length}
            />
            {availableDates.map((date) => {
              return (
                <SelectableTimeSlot
                  earliestTimeInDay={earliestTimeInDay}
                  latestTimeInDay={latestTimeInDay}
                  date={date}
                  key={date}
                  availableSlots={availableSlots}
                  timeAvailable={timeAvailable}
                  updateTimeAvailable={this.updateTimeAvailable}
                />
              );
            })}
          </div>
          <div className={styles.submitContainer}>
            <input className={styles.submit} type="submit" name="submit" />
          </div>
        </form>
      </div>
    );
  }
}
export default graphql(updateMyParticipation)
  (graphql(myParticipation, {
    options: (props) => ({ variables: { eventId: props.eventId } })
  })(IndividualPreview));
