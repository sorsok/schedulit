import React from 'react';
import styles from '../styles/DayPicker.module.css';
import Day from './Day.jsx';

import YearMonthHeader from './YearMonthHeader';

class DayPicker extends React.Component {
  constructor(props) {
    super(props);
    this.renderMonth = this.renderMonth.bind(this);
  }

  renderMonth() {
    let weekComponents = [];
    let { currentYear, currentMonth } = this.props;
    let daysInLastMonth = (new Date(currentYear, currentMonth, 0)).getDate();
    let daysInCurrentMonth = (new Date(currentYear, currentMonth + 1, 0)).getDate();
    let dayOfFirstOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    let dayOfLastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDay()

    let startDate = daysInLastMonth - dayOfFirstOfMonth + 1;
    let endDate = daysInLastMonth + daysInCurrentMonth + 6 - dayOfLastDayOfMonth;
    let currentWeek = [];
    for (let i = startDate; i <= endDate; i++) {
      let date = new Date(currentYear, currentMonth - 1, i);
      currentWeek.push(
        <Day
          key={i}
          date={date}
          addDayToSet={this.props.addDayToSet}
          set={this.props.setOfDate[date]}
          currentMonth={this.props.currentMonth}
        />
      );
      if (date.getDay() === 6) {
        weekComponents.push(
          <div className={styles.week} key={weekComponents.length}>
            {currentWeek}
          </div>
        )
        currentWeek = [];
      }
    }
    return weekComponents;
  }

  render() {
    const DAYSOFWEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    return (
      <div className={styles.calendarContainer}>
        <div className={styles.calendar}>
          <YearMonthHeader
            currentMonth={this.props.currentMonth}
            currentYear={this.props.currentYear}
            nextMonth={this.props.nextMonth}
            prevMonth={this.props.prevMonth}
          />
          <div className={styles.weeksContainer} >
            <div className={styles.week}>
              {DAYSOFWEEK.map((day, index) => (
                <div className={styles.dayContainer} key={index}>
                  {day}
                </div>
              ))}
            </div>
            {this.renderMonth()}
          </div>
        </div>
      </div>
    );
  }
}

export default DayPicker;
