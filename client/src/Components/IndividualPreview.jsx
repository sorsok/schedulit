import React from "react";
import { graphql } from 'react-apollo';

import SelectableTimeSlot from "./SelectableTimeSlot";
import styles from "../styles/IndividualPreview.css";
import TimeAxis from "./TimeAxis";

import myParticipation from '../queries/myParticipation';
import updateMyParticipation from '../queries/updateMyParticipation';
import loader from '../assets/loader.gif';
import appStyles from '../styles/App.css';

const UNIT_INCREMENTS = 15;

class IndividualPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selecting: true,
      mouseDown: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleTimeAvailable = this.toggleTimeAvailable.bind(this);
    this.turnOffSelection = this.turnOffSelection.bind(this);
    this.updateState = this.updateState.bind(this);
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
    const { unavailable, timeAvailable } = this.state;
    const newParticipation = {
      _id: this.props.participationId,
      unavailable,
      timeAvailable
    };
    this.props.mutate({
      variables: { participation: newParticipation },
      optimisticResponse: newParticipation
    });
  }

  toggleTimeAvailable(timestamp) {
    //returns true if toggled on and false if toggled off
    //assumes timeAvailable is array of 15min slots
    let { timeAvailable } = this.state;
    const newTimeAvailable = this.state.timeAvailable.filter(slot => {
      return !this.timestampLiesInSlot(timestamp, slot);
    });
    if (timeAvailable.length == newTimeAvailable.length) {
      newTimeAvailable.push({
        startTime: timestamp,
        endTime: new Date(timestamp.getTime() + UNIT_INCREMENTS * 60 * 1000)
      });
    }
    this.setState({ timeAvailable: newTimeAvailable });
    return newTimeAvailable.length > timeAvailable.length;

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

  turnOffSelection() {
    this.setState({
      mouseDown: false,
      selecting: false
    });
  }

  updateState(newState) {
    this.setState(newState);
  }

  render() {
    if (!this.state.availableSlots) {
      return <img className={appStyles.loader} src={loader} />;
    }
    const { timeAvailable, unavailable, availableSlots, selecting, mouseDown } = this.state;
    const { earliestTimeInDay, latestTimeInDay } = this.findEarliestLatestTime(availableSlots);
    const availableDates = this.findAvailableDates(availableSlots);
    return (
      <div className={styles.container}>
        <div className={styles.title}>My Availability</div>
        <form onSubmit={this.handleSubmit}>
          <div
            className={styles.timeSelection}
            style={unavailable ? { display: "none" } : {}}
          >
            <TimeAxis
              earliestTimeInDay={earliestTimeInDay}
              latestTimeInDay={latestTimeInDay}
              numberOfDays={availableDates.length}
            />
            <div className={styles.timeSlotsContainer} onMouseLeave={this.turnOffSelection}>
              {availableDates.map((date) => {
                return (
                  <SelectableTimeSlot
                    earliestTimeInDay={earliestTimeInDay}
                    latestTimeInDay={latestTimeInDay}
                    date={date}
                    key={date}
                    selecting={selecting}
                    mouseDown={mouseDown}
                    availableSlots={availableSlots}
                    timeAvailable={timeAvailable}
                    toggleTimeAvailable={this.toggleTimeAvailable}
                    updateState={this.updateState}
                  />
                );
              })}
            </div>
          </div>
          <div className={styles.unavailableContainer}>
            <div className={styles.unavailableMessage}>
              Unable to Attend
              </div>
            <input name="unavailable"
              type="checkbox"
              checked={this.state.unavailable}
              onChange={this.handleChange} />
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
