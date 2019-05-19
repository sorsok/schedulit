import React from 'react';
import classnames from 'classnames';
import styles from '../styles/YearMonthHeader.module.css';

export default (props) => {
  const MonthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  return (
    <div className={classnames(styles.monthHeader, styles.row)}>
      <div className={classnames(styles.col, styles.colStart)}>
        <div className={styles.icon} onClick={props.prevMonth}>
          chevron_left
				  </div>
      </div>
      <div className={classnames(styles.col, styles.colCenter)}>
        <span> {MonthNames[props.currentMonth]} {props.currentYear} </span>
      </div>
      <div className={classnames(styles.col, styles.colEnd)} onClick={props.nextMonth}>
        <div className={styles.icon}>chevron_right</div>
      </div>
    </div>
  );
};