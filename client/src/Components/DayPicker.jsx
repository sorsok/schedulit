import React from 'react';
import styles from '../styles/calendar.css';
import classnames from 'classnames';
import Day from './Day.jsx';

import YearMonthHeader from './YearMonthHeader';



class DayPicker extends React.Component {
  constructor(props) {
    super(props);
    this.renderDays = this.renderDays.bind(this);
  }
  renderDays() {
    let dayComponents = [];
    let { currentYear, currentMonth } = this.props;
    let daysInCurrentMonth = (new Date(currentYear, currentMonth + 1, 0)).getDate();
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      let date = new Date(currentYear, currentMonth, i);
      dayComponents.push(
        <Day
          key={date}
          date={date}
          addDayToSet={this.props.addDayToSet}
          set={this.props.setOfDay[date]}
        />
      );
    }
    return dayComponents;
  };

  render() {
    return (
      <div className={styles.calendar}>
        <YearMonthHeader
          currentMonth={this.props.currentMonth}
          currentYear={this.props.currentYear}
          nextMonth={this.props.nextMonth}
          prevMonth={this.props.prevMonth}
        />
        {this.renderDays()}
      </div>
    );
  };
}

export default DayPicker;