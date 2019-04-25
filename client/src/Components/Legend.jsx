import React from "react";
import axios from 'axios';

import styles from "../styles/Legend.css";

class Legend extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.legendItem}>
          <div className={styles.participantColor + ' ' + styles.userSelected}> </div>
          <div className={styles.username}>{this.props.participations.myParticipation.user.given_name}</div>
        </div>
        {this.props.participations.otherParticipations.map(({ user }, index) => (
          <div className={styles.legendItem}>
            <div className={styles.participantColor + ' ' + styles['selected' + index]}> </div>
            <div className={styles.username}>{user.given_name}</div>
          </div>
        ))}

      </div>
    );
  }
}
export default Legend;















