import React from 'react';
import styles from '../styles/ChooseHours.module.css';

const INCREMENT = 0.25;
const HOURS_IN_DAY = 24;

class ChooseHours extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: '',
      endTime: ''
    };
    this.hoursToString = this.hoursToString.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addTimesToSet = this.addTimesToSet.bind(this);
    this.areDatesSelected = this.areDatesSelected.bind(this);
  }

  hoursToString(time) {
    let hour = Math.floor(time) % 12;
    if (hour < 1) hour += 12;
    let minutes = (time - Math.floor(time)) * 60;
    let isBeforeNoon = time < 12;
    minutes = Math.round(minutes);
    return `${String(hour).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )} ${isBeforeNoon ? 'AM' : 'PM'}`;
  }
  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  addTimesToSet() {
    this.props.addTimesToSet({
      startTime: this.state.startTime,
      endTime: this.state.endTime
    });
    this.setState({
      startTime: '',
      endTime: ''
    });
  }

  areDatesSelected() {
    return Object.values(this.props.setOfDate).includes(this.props.setCounter);
  }

  render() {
    let times = [];
    for (let i = 0; i < HOURS_IN_DAY / INCREMENT; i++) {
      times.push(i * INCREMENT);
    }
    if (this.areDatesSelected()) {
      return (
        <div>
          <select
            id="startTime"
            className={styles.startTimeSelect}
            onChange={this.handleChange}
          >
            <option>Start Time</option>
            {times.map(time => (
              <option value={time} key={time}>
                {this.hoursToString(time)}{' '}
              </option>
            ))}
          </select>
          <select
            id="endTime"
            className={styles.endTimeSelect}
            onChange={this.handleChange}
            disabled={this.state.startTime === ''}
          >
            <option>End Time</option>
            {times
              .filter(time => time > this.state.startTime)
              .map(time => (
                <option value={time} key={time}>
                  {this.hoursToString(time)}{' '}
                </option>
              ))}
          </select>
          <button
            className={styles.hoursButton}
            onClick={this.addTimesToSet}
            disabled={this.state.endTime === ''}
          >
            Set Times
          </button>
        </div>
      );
    }
    return (
      <div className={styles.timePickerFont}>
        {this.props.setCounter > 1
          ? ''
          : 'Pick some dates first'}
      </div>
    );
  }
}

export default ChooseHours;

