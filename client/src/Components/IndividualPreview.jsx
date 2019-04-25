import React from "react";
import { graphql, compose } from 'react-apollo';

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

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.checked });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { unavailable, timeAvailable } = this.state;
    const participation = {
      eventId: this.props.eventId,
      unavailable,
      timeAvailable
    };

    const optimisticResponse = {
      updateMyParticipation: {
        _id: this.props.participationId,
        __typename: "Participation",
        unavailable,
        timeAvailable: timeAvailable.map(slot => {
          const newSlot = {};
          newSlot.__typename = "TimeSlot";
          Object.assign(newSlot, slot);
          return newSlot;
        })
      }
    };
    this.props.mutate({
      variables: { participation },
      optimisticResponse
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
      console.log(this.props.data);
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
    const { minMaxTime, availableDates } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.title}>My Availability</div>
        <form className={styles.form} onSubmit={this.handleSubmit}>
          <div
            className={styles.timeSelection}
            style={unavailable ? { display: "none" } : {}}
          >
            <TimeAxis
              minMaxTime={minMaxTime}
              numberOfDays={availableDates.length}
            />
            <div className={styles.timeSlotsContainer} onMouseLeave={this.turnOffSelection}>
              {availableDates.map((date) => {
                return (
                  <SelectableTimeSlot
                    minMaxTime={minMaxTime}
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
export default compose(
  graphql(updateMyParticipation),
  graphql(myParticipation, {
    options: (props) => ({ variables: { eventId: props.eventId } })
  })
)(IndividualPreview);
