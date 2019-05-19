import React from 'react';
import styles from '../styles/Day.module.css';
import classnames from 'classnames';

class Day extends React.Component {
  getClassNames() {
    let classNames = [styles.dayContainer];
    if (this.props.currentMonth === this.props.date.getMonth()) {
      classNames.push(styles.currMonth);
    } else if (this.props.date.getMonth() < this.props.currentMonth) {
      classNames.push(styles.prevMonth);
    } else {
      classNames.push(styles.nextMonth);
    }
    if (this.props.date < new Date()) {
      classNames.push(styles.past);
    }
    return classnames(...classNames);
  }
  render() {
    return (
      <div
        onClick={() => this.props.addDayToSet(this.props.date)}
        className={this.getClassNames()}
      >
        <div className={styles['set' + this.props.set]}>
          <div className={styles.date}>
            {this.props.date.getDate()}
          </div>
        </div>
      </div>
    )
  }
}

export default Day;