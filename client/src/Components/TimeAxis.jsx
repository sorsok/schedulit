import React from 'react';
import styles from '../styles/TimeAxis.css';
import TimeAxisUnit from './TimeAxisUnit';

const UNIT_INCREMENTS = 15;

class TimeAxis extends React.Component {
	constructor(props) {
		super(props);
		this.getTimeAxisUnits = this.getTimeAxisUnits.bind(this);
	}

	getTimeAxisUnits() {
		let numberOfSlots = (this.props.latestTimeInDay - this.props.earliestTimeInDay) / (UNIT_INCREMENTS * 60 * 1000);
		let stub = new Date(0, 0, 0).getTime();
		let timeAxisUnits = [];
		for (let i = 0; i <= numberOfSlots; i++) {
			let currentTimeStamp = new Date(stub + this.props.earliestTimeInDay + (i * UNIT_INCREMENTS * 60 * 1000));
			timeAxisUnits.push(<TimeAxisUnit
				timestamp={currentTimeStamp}
				numberOfDays={this.props.numberOfDays}
			// display={i === 0 || i === numberOfSlots}
			/>);
		}
		return timeAxisUnits;
	}


	render() {
		return (
			<div className={styles.container}>
				<div className={styles.placeHolder}></div>
				{this.getTimeAxisUnits()}
			</div>
		);
	}
}

export default TimeAxis;
