import React from 'react';
import styles from '../styles/TimeAxisUnit.css';

const SLOT_WIDTH = 6;

class TimeAxisUnit extends React.Component {
	constructor(props) {
		super(props);
		this.displayLabel = this.displayLabel.bind(this);
	}

	displayLabel() {
		if (this.props.timestamp.getMinutes() === 0 || this.props.display) {
			return (new Intl.DateTimeFormat('en-US', {
				hour: '2-digit',
				minute: '2-digit'
			}).format(this.props.timestamp));
		}
		return '';
	}

	render() {
		return (
			<div className={styles.container}>
				<div className={styles.labelContainer}>
					<div className={styles.label}>{this.displayLabel()}</div>
				</div>
				<div className={styles.lineContainer}>
					<div className={styles.line} style={{ width: `${this.props.numberOfDays * SLOT_WIDTH}em` }}></div>
				</div>
			</div>
		);
	}
}

export default TimeAxisUnit;
