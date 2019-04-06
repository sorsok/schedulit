import * as React from "react";
import * as styles from "../styles/Navigation.css";


interface Props {
	changeView: Function
}

const Navigation = ({ changeView }: Props) => {
	return (
		<div className={styles.navigation}>
			<div className={styles.schedulit} onClick={() => changeView('userEventsPage')} >
				<img src="logo.png" style={{ width: '1.5em', height: '1.5em', padding: '0.3em' }}></img>
				<div>
					Schedulit
					</div>
			</div>

			<div className={styles.tabs}>

				<div onClick={() => changeView('userEventsPage')} className={styles.clickables}>
					My Events
			</div>



				<div onClick={() => changeView('createEventPage')} className={styles.clickables}>
					Create an event!
			</div>

			</div>
		</div>
	);
};

export default Navigation;
