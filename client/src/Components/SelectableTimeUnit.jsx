import React from 'react';
import styles from '../styles/SelectableTimeUnit.css';

class SelectableTimeUnit extends React.Component {
  constructor(props) {
    super(props);
    this.getClassName = this.getClassName.bind(this);
  }

  getClassName() {
    let className = ''
    if (!this.props.selectable) {
      className = styles.unselectable;
    } else if (this.props.selected) {
      className = styles.selected
    } else {
      className = styles.unselected;
    }
    return className;
  }

  render() {
    return (
      <div
        onMouseDown={() => this.props.handleMouseDown(this.props.timeStamp, this.props.selected)}
        onMouseUp={this.props.handleMouseUp}
        onMouseEnter={() => this.props.handleMouseEnter(this.props.timeStamp, this.props.selected)}
        className={this.getClassName()} >
      </ div>
    )
  }
}
export default SelectableTimeUnit;
