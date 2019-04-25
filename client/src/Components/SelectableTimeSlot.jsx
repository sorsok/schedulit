import React from 'react';
import SelectableTimeUnit from './SelectableTimeUnit';
import styles from '../styles/SelectableTimeSlot.css'

const UNIT_INCREMENTS = 15;



class SelectableTimeSlot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: null,
      mouseDown: false,
    }
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.createTimeStamps = this.createTimeStamps.bind(this);
    this.isTimeStampSelected = this.isTimeStampSelected.bind(this);
    this.isTimeStampSelectable = this.isTimeStampSelectable.bind(this);
    this.timestampLiesInSlot = this.timestampLiesInSlot.bind(this);
  }

  handleMouseDown(timestamp, selected) {
    if (selected !== null) {
      this.props.updateTimeSlotStatus(timestamp, selected ? false : true);
      this.setState({
        mouseDown: true,
        startTimestamp: timestamp
      });
    }
  }

  handleMouseEnter(timestamp, selected) {
    if (this.state.mouseDown) {
      this.props.updateTimeSlotStatus(timestamp, selected ? false : true);
    }
  }

  handleMouseUp(e) {
    this.setState({ mouseDown: false });
  }

  createTimeStamps() {
    const numberOfTimeStamps = (this.props.latestTimeInDay - this.props.earliestTimeInDay) / (UNIT_INCREMENTS * 60 * 1000);
    const timeStamps = [];
    for (let i = 0; i < numberOfTimeStamps; i++) {
      let currentTimeStamp = new Date(this.props.date.getTime() + this.props.earliestTimeInDay + (i * UNIT_INCREMENTS * 60 * 1000));
      timeStamps.push(currentTimeStamp);
    }
    return timeStamps;
  }

  isTimeStampSelectable(timeStamp) {
    return this.props.availableSlots.some(slot => {
      return this.timestampLiesInSlot(timeStamp, slot);
    })
  }

  isTimeStampSelected(timeStamp) {
    return this.props.timeAvailable.some(slot => {
      return this.timestampLiesInSlot(timeStamp, slot);
    })
  }

  timestampLiesInSlot(timestamp, timeSlot) {
    timestamp = new Date(timestamp);
    return (
      timestamp.getTime() >= timeSlot.startTime.getTime() &&
      timestamp.getTime() < timeSlot.endTime.getTime()
    );
  }

  render() {
    return (
      <div className={styles.container} >
        <div className={styles.date}>
          {new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: '2-digit'
          }).format(this.props.date)}
        </div>
        {this.createTimeStamps().map((timeStamp, index) => <SelectableTimeUnit
          selected={this.isTimeStampSelected(timeStamp)}
          selectable={this.isTimeStampSelectable(timeStamp)}
          handleMouseDown={this.handleMouseDown}
          handleMouseEnter={this.handleMouseEnter}
          handleMouseUp={this.handleMouseUp}
          timeStamp={timeStamp}
          key={index}
        />)}
      </div >
    );
  }
}

export default SelectableTimeSlot;
