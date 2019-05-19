import React from 'react';
import styles from '../styles/TimeAxisUnit.module.css';

class TimeAxisUnit extends React.Component {
	displayLabel = () => {
		if (this.props.timestamp.getMinutes() === 0
			// || this.props.display
		) {
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
			</div>
		);
	}
}

export default TimeAxisUnit;
