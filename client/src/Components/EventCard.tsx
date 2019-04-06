import * as React from "react";
import * as CopyToClipboard from "react-copy-to-clipboard";

import Participants from "./Participants";
import { Event } from './MainDisplay';

import * as styles from "../styles/EventCard.css";

interface Props {
  event: Event,
  viewEventDetails: Function
}

class EventCard extends React.Component {
  constructor(props: Props) {
    super(props);
  }

  getLink = (eventId: string): string => {
    let link = `${document.URL}join/${eventId}`;
    return link;
  }
  getFormattedDate = (): string => {
    const startDate = this.props.event.availableSlots[0].startTime
    const endDate = this.props.event.availableSlots[this.props.event.availableSlots.length - 1].startTime;
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
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div
            className={styles.title}
            onClick={() => this.props.viewEventDetails(this.props.event.id)}
          >
            {this.props.event.title}
          </div>
          <CopyToClipboard text={this.getLink(this.props.event.id)}>
            <div>
              <img
                src="copy.png"
                className={styles.copyButton}
                title="Copy to Clipboard"
              />
              <div className={styles.copyMessage}>Copy to Clipboard</div>
            </div>

          </CopyToClipboard>
        </div>
        <div className={styles.duration}>{
          this.getFormattedDate()
        }</div>
        <Participants participants={this.props.event.participants} />
        <div className={styles.description}>{this.props.event.description}</div>
      </div>
    );
  }
}

export default EventCard;
