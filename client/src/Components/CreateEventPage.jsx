import React, { Component } from "react";
import axios from "axios";

import DayPicker from "./DayPicker";
import ChooseHours from "./ChooseHours";
import styles from "../styles/CreateEventPage.css";

class CreateEventPage extends Component {
  constructor(props) {
    super(props);
    let currentDate = new Date();
    this.state = {
      setCounter: 1,
      currentMonth: currentDate.getMonth(),
      currentYear: currentDate.getFullYear(),
      setTimes: {},
      readyForSubmit: false
    };
    this.state.setOfDate = this.createSetOfDay();
    this.addTimesToSet = this.addTimesToSet.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.prevMonth = this.prevMonth.bind(this);
    this.addTimesToSet = this.addTimesToSet.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addDayToSet = this.addDayToSet.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  addTimesToSet(times) {
    let newSetTimes = this.state.setTimes;
    newSetTimes[this.state.setCounter] = times;
    this.setState({
      setTimes: newSetTimes,
      setCounter: this.state.setCounter + 1
    });
  }

  nextMonth() {
    if (this.state.currentMonth === 11) {
      this.setState({
        currentYear: this.state.currentYear + 1
      });
    }

    this.setState({
      currentMonth: (this.state.currentMonth + 1) % 12
    });
  }

  prevMonth() {
    if (this.state.currentMonth === 0) {
      this.setState({
        currentYear: this.state.currentYear - 1
      });
    }
    this.setState({
      currentMonth: (this.state.currentMonth + 11) % 12
    });
  }

  createSetOfDay() {
    let setOfDate = {};
    let { currentYear, currentMonth } = this.state;

    let daysInLastMonth = (new Date(currentYear, currentMonth, 0)).getDate();
    let daysInCurrentMonth = (new Date(currentYear, currentMonth + 1, 0)).getDate();
    let dayOfFirstOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    let dayOfLastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDay()

    let startDate = daysInLastMonth - dayOfFirstOfMonth + 1;
    let endDate = daysInLastMonth + daysInCurrentMonth + 6 - dayOfLastDayOfMonth;
    for (let i = startDate; i <= endDate; i++) {
      let date = new Date(currentYear, currentMonth - 1, i);
      setOfDate[date] = 0;
    }
    return setOfDate;
  }

  addDayToSet(date) {
    if (date.getTime() + 24 * 60 * 60 * 1000 > new Date()) {
      let newSetOfDay = this.state.setOfDate;
      if (this.state.setOfDate[date] === 0 || this.state.setOfDate[date] === undefined) {
        newSetOfDay[date] = this.state.setCounter;
      } else {
        newSetOfDay[date] = 0;
      }
      this.setState({ setOfDate: newSetOfDay });
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  instructionMessage() {
    if (!this.state.title) return "Step 1: Enter a Title";
    if (this.state.title && !this.state.description)
      return "Step 2: Enter a Description for your Event";
    if (
      this.state.title &&
      this.state.description &&
      !(Object.keys(this.state.setTimes) > 0)
    ) {
      return "Step 3: Pick Dates & Times for Your Event";
    }
    if (
      this.state.title &&
      this.state.description &&
      Object.keys(this.state.setTimes) > 0
    ) {
      return "Step 4: Submit Event if Ready or Choose Additional Dates";
    }
  }

  isReadyForSubmit() {
    if (
      this.state.title &&
      this.state.description &&
      Object.keys(this.state.setTimes).length > 0
    ) {
      return (
        <input type="submit" value="Submit" className={styles.submitButton} />
      );
    }
  }

  showCalendar() {
    if (this.state.title && this.state.description) {
      return (
        <DayPicker
          currentYear={this.state.currentYear}
          currentMonth={this.state.currentMonth}
          addDayToSet={this.addDayToSet}
          prevMonth={this.prevMonth}
          nextMonth={this.nextMonth}
          setOfDate={this.state.setOfDate}
        />
      );
    }
  }

  showHours() {
    if (this.state.title && this.state.description) {
      return (
        <ChooseHours
          setCounter={this.state.setCounter}
          setOfDate={this.state.setOfDate}
          finalizeSet={this.finalizeSet}
          addTimesToSet={this.addTimesToSet}
        />
      );
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    let newEvent = {};
    newEvent.title = this.state.title;
    newEvent.description = this.state.description;
    newEvent.participants = [];
    newEvent.allowedPreferences = ["activity", "food"];
    newEvent.availableSlots = [];
    for (let day in this.state.setOfDate) {
      let set = this.state.setOfDate[day];
      if (set) {
        let startAndEndHours = this.state.setTimes[set];
        let timeSlot = {
          startTime: new Date(
            startAndEndHours.startTime * 60 * 60 * 1000 +
            new Date(day).getTime()
          ),
          endTime: new Date(
            startAndEndHours.endTime * 60 * 60 * 1000 + new Date(day).getTime()
          )
        };
        newEvent.availableSlots.push(timeSlot);
      }
    }
    console.log(JSON.stringify(newEvent));
    axios.post("/api/event", newEvent).then(({ data }) => {
      this.setState({ eventId: data.id });
    });
  }
  render() {
    if (this.state.eventId) {
      return (
        <div style={{ display: 'flex', padding: '5em 23em', justifyContent: 'center' }}>
          <div style={{
            padding: '1em 1em 2em 1em',
            fontSize: '150%',
            color: '#27ae54',
            fontWeight: '600',
            borderRadius: '2em',
          }}>

            <div style={{ padding: '1em' }}>
              {`Share the following link: `}
            </div>
            <a style={{ padding: '1em' }} href={"/join/" + this.state.eventId}>
              {`${document.URL}join/${this.state.eventId} `}
            </a>


          </div>
        </div>
      );
    }

    return (
      <div className={styles.createPage}>
        <div className={styles.eventInvitation}>
          {this.instructionMessage()}
        </div>
        <div className={styles.createContainer}>
          <div className={styles.detailsContainer}>
            <div className={styles.inputFormContainer}>
              <form onSubmit={this.handleSubmit}>
                <label className={styles.eventForm}>
                  <input
                    name="title"
                    type="text"
                    placeholder="Event Title"
                    onChange={this.handleChange}
                    className={styles.input}
                  />
                  <input
                    name="description"
                    type="text"
                    placeholder="Event Description"
                    onChange={this.handleChange}
                    className={styles.input}
                  />
                </label>
                <div className={styles.hoursContainer}>{this.showHours()}</div>
                {this.isReadyForSubmit()}
              </form>
            </div>
            {this.showCalendar()}
          </div>
        </div>
      </div>
    );
  }
}

export default CreateEventPage;
