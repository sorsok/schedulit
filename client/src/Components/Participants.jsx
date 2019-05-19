import React, { Component } from 'react';

class Participants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      names: []
    };
  }

  componentDidMount() {
    this.fetchParticipants(this.props.participants);
  }

  render() {
    let { names } = this.state;
    return (
      <div>
        {`Attending: ${names.join(', ')} (${names.length}) `}
      </div>
    );
  }
}

export default Participants;
