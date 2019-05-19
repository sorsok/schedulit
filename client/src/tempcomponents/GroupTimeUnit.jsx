import React from 'react';
import styles from '../styles/GroupTimeUnit.module.css';


class GroupTimeUnit extends React.Component {
  renderSelections = () => {
    if (!this.props.selectable) {
      return <div className={styles.unselectable} />
    }
    let selections = [];
    selections.push(<div className={this.props.userSelected ? styles.userSelected : styles.userUnselected} key={-1} />);
    selections = selections.concat(this.props.otherParticipantsSelected
      .map((selection, index) => <div key={index} className={selection ? styles['selected' + index] : styles['unselected' + index]}></div>)
    );
    return selections;
  }

  render() {
    return (
      <div className={styles.slotContainer} >
        {this.renderSelections()}
      </ div>
    )
  }
}
export default GroupTimeUnit;