import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Link } from 'react-router-dom';

import copy from '../assets/copy.png'

import styles from "../styles/EventCard.css";

class EventCard extends React.Component {
  constructor(props) {
    super(props);
  }

  getFormattedDate(availableSlots) {
    const startDate = availableSlots[0].startTime
    const endDate = availableSlots[availableSlots.length - 1].startTime;
    const startString = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit'
    }).format(startDate);
    const endString = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit'
    }).format(endDate);
    if (startString === endString) return startString;
    return startString + ' ~ ' + endString;
  }

  render() {
    const { _id, title, description, availableSlots, participations } = this.props.event;
    const names = participations.map(({ user }) => user.name);
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Link
            className={styles.title}
            to={`/events/${_id}`}
          >
            {title}
          </Link>
          <CopyToClipboard text={`${document.URL}events/${_id}`}>
            <div>
              <img
                src={copy}
                className={styles.copyButton}
                title="Copy to Clipboard"
              />
              <div className={styles.copyMessage}>Copy to Clipboard</div>
            </div>

          </CopyToClipboard>
        </div>
        <div className={styles.duration}>
          {this.getFormattedDate(availableSlots)}
        </div>
        <div>
          {`Attending: ${names.join(', ')} (${names.length}) `}
        </div>
        <div className={styles.description}>{description}</div>
      </div>
    );
  }
}

export default EventCard;
