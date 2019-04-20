import React from 'react';

import styles from '../styles/MainDisplay.css'

class MainDisplay extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.masterContainer}>
        {this.props.children}
      </div>
    );
  }
}

export default MainDisplay;