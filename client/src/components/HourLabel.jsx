import React from 'react';
import styles from '../styles/HourDescription.module.css';

class HourLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slotStatus: this.initializeSlotStatus()
    };
  }

  timestampLiesInSlot(timestamp, timeSlot) {
    return timestamp >= timeSlot.startTime && timestamp <= timeSlot.endTime;
  }

  initializeSlotStatus() {
    let numberOfSlots =
      (this.props.latestMinutesInDay - this.props.earliestMinutesInDay) / 15;
    let slotStatus = {}; //keys are timestamps; val is true/false for selectable, null for unselectable
    let stub = new Date(
      this.props.timeSlot.startTime.getFullYear(),
      this.props.timeSlot.startTime.getMonth(),
      this.props.timeSlot.startTime.getDate()
    ).getTime();
    for (let i = 0; i < numberOfSlots; i++) {
      let currentTimeStamp = new Date(
        stub + (this.props.earliestMinutesInDay + i * 15) * 60 * 1000
      );
      if (currentTimeStamp >= this.props.timeSlot.startTime
        && currentTimeStamp < this.props.timeSlot.endTime) {
        slotStatus[
          currentTimeStamp
        ] = this.props.eventData.participations[0].timeAvailable.some(
          timeSlot => this.timestampLiesInSlot(currentTimeStamp, timeSlot)
        );
      } else {
        slotStatus[currentTimeStamp] = null;
      }
    }
    return slotStatus;
  }

  render() {
    return (
      <div>
        {Object.keys(this.state.slotStatus).map((timeStamp, index) => {
          timeStamp = new Date(timeStamp);
          if (timeStamp.getMinutes() === 0 || index === 0) {
            return (
              <div className={styles.showHour}>
                <div className={styles.internalPadding}>
                  {new Intl.DateTimeFormat('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  }).format(timeStamp)}
                </div>
              </div>
            );
          } else if (Object.keys(this.state.slotStatus).length - 1 === index) {
            return (
              <div>
                <div className={styles.hideHour} />
                <div className={styles.showLast}>
                  <div className={styles.internalPadding}>
                    {new Intl.DateTimeFormat('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(new Date(timeStamp.getTime() + 15 * 60000))}
                  </div>
                </div>
              </div>
            );
          } else {
            return <div className={styles.hideHour} />;
          }
        })}
      </div>
    );
  }
}

export default HourLabel;
