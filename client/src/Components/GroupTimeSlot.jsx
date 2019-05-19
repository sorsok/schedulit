import React from "react";
import GroupTimeUnit from "./GroupTimeUnit";


import styles from "../styles/GroupTimeSlot.module.css";

const UNIT_INCREMENTS = 15;


class GroupTimeSlot extends React.Component {
  constructor(props) {
    super(props);
    this.hasUserSelected = this.hasUserSelected.bind(this);
    this.haveOtherParticipantsSelected = this.haveOtherParticipantsSelected.bind(this);
    this.isTimeStampSelectable = this.isTimeStampSelectable.bind(this);
  }

  timestampLiesInSlot(timestamp, timeSlot) {
    return (
      timestamp.getTime() >= timeSlot.startTime.getTime() &&
      timestamp.getTime() < timeSlot.endTime.getTime()
    );
  }

  createTimeStamps() {
    const numberOfTimeStamps = (this.props.minMaxTime.latestTimeInDay - this.props.minMaxTime.earliestTimeInDay) / (UNIT_INCREMENTS * 60 * 1000);
    const timeStamps = [];
    for (let i = 0; i < numberOfTimeStamps; i++) {
      let currentTimeStamp = new Date(this.props.date.getTime() + this.props.minMaxTime.earliestTimeInDay + (i * UNIT_INCREMENTS * 60 * 1000));
      timeStamps.push(currentTimeStamp);
    }
    return timeStamps;
  }

  isTimeStampSelectable(timeStamp) {
    return this.props.availableSlots.some(slot => {
      return this.timestampLiesInSlot(timeStamp, slot);
    })
  }

  hasUserSelected(timeStamp) {
    const { unavailable, timeAvailable } = this.props.participations.myParticipation;
    if (unavailable) return false;
    return timeAvailable.some(slot => this.timestampLiesInSlot(timeStamp, slot));
  }

  haveOtherParticipantsSelected(timeStamp) {
    return this.props.participations.otherParticipations.map(({ unavailable, timeAvailable }) => {
      if (unavailable) return false;
      return timeAvailable.some(slot => this.timestampLiesInSlot(timeStamp, slot));
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.date}>
          {new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "2-digit"
          }).format(this.props.date)}
        </div>
        <div>
          {this.createTimeStamps().map(timeStamp => (
            <GroupTimeUnit
              otherParticipantsSelected={this.haveOtherParticipantsSelected(timeStamp)}
              userSelected={this.hasUserSelected(timeStamp)}
              timeStamp={timeStamp}
              selectable={this.isTimeStampSelectable(timeStamp)}
              key={timeStamp}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default GroupTimeSlot;
