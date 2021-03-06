import React from "react";
import { graphql, compose } from 'react-apollo';

import Legend from './Legend'
import GroupTimeSlot from "./GroupTimeSlot";
import TimeAxis from "./TimeAxis";

import styles from "../styles/GroupPreview.module.css";
import myParticipation from "../queries/myParticipation";
import otherParticipations from '../queries/otherParticipations';
import appStyles from '../styles/App.module.css';
import loader from '../assets/loader.gif';

class GroupPreview extends React.Component {
  parseTimeSlot(slot) {
    return {
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime)
    }
  }

  renderGroupAvailability = () => {
    if (this.props.myParticipation.loading || this.props.otherParticipations.loading) {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img alt="loader" className={appStyles.loader} src={loader} />
        </div>);
    }
    const { minMaxTime, availableDates, otherParticipations, myParticipation } = this.props;
    const myParticipationParsed = {
      unavailable: myParticipation.myParticipation.unavailable,
      timeAvailable: myParticipation.myParticipation.timeAvailable.map(this.parseTimeSlot),
      user: myParticipation.myParticipation.user
    }
    const availableSlots = myParticipation.myParticipation.event.availableSlots.map(this.parseTimeSlot);
    let otherParticipationsParsed = [];
    if (otherParticipations.otherParticipations) {
      otherParticipationsParsed = otherParticipations.otherParticipations.map(({ unavailable, timeAvailable, user }) => {
        return {
          unavailable,
          timeAvailable: timeAvailable.map(this.parseTimeSlot),
          user
        };
      });
    }
    const participations = {
      myParticipation: myParticipationParsed,
      otherParticipations: otherParticipationsParsed
    };
    return (
      <>
        <div className={styles.timeSlotContainer}>
          <TimeAxis
            minMaxTime={minMaxTime}
            numberOfDays={availableDates.length}
          />
          {availableDates.map((date, index) => {
            return (
              <GroupTimeSlot
                availableSlots={availableSlots}
                minMaxTime={minMaxTime}
                date={date}
                key={date}
                participations={participations}
              />
            );
          })}
        </div>
        <Legend participations={participations} />
      </>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.title}>Everyone's Availability </div>
        {this.renderGroupAvailability()}
      </div>
    );
  }
}
const options = props => ({ variables: { eventId: props.eventId } });
export default compose(
  graphql(otherParticipations, {
    name: "otherParticipations",
    options
  }),
  graphql(myParticipation, {
    name: "myParticipation",
    options
  })
)(GroupPreview);
