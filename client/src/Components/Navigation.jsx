import React from "react";
import { Link } from "react-router-dom"

import styles from "../styles/Navigation.module.css";
import logo from '../assets/logo.png';

class Navigation extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={styles.navigation}>
				<Link className={styles.schedulit} to={'/'} >
					<img src={logo} style={{ width: '1.5em', height: '1.5em', padding: '0.3em' }}></img>
					<div>Schedulit</div>
				</Link>
				<div className={styles.tabs}>
					<Link to={'/'} className={styles.clickables}>My Events</Link>
					<Link to={'/events/new'} className={styles.clickables}>Create an event!</Link>
				</div>
				<a href={'/logout'} className={styles.clickables}>Log Out</a>
			</div>
		);
	}
}

export default Navigation;
