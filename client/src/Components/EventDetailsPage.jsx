import React from 'react';
import { graphql } from 'react-apollo';

import GroupPreview from './GroupPreview';
import IndividualPreview from './IndividualPreview';
import Navigation from './Navigation';

import createParticipation from '../queries/createParticipation';
import appStyles from '../styles/App.css';
import loader from '../assets/loader.gif';


class EventDetailsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.props.mutate({ variables: { eventId: props.match.params.id } })
      .then(({ data }) => {
        const newState = {
          eventId: data.createParticipation.event._id,
          title: data.createParticipation.event.title,
          description: data.createParticipation.event.description,
          participationId: data.createParticipation._id

        }
        this.setState(newState);
      });
    this.renderEventDetails = this.renderEventDetails.bind(this);
  }

  renderEventDetails() {
    const { eventId, participationId, title, description } = this.state;
    if (!title) {
      return <div />;
    }
    if (title) {
      return (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 >{title}</h1>
            {description}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <IndividualPreview eventId={eventId} participationId={participationId} />
            {/* <GroupPreview eventId={eventId} /> */}
          </div>
        </>
      );
    } else {
      return <div>Oops, it seems as though this event doesn't exist!</div>
    }
  }

  render() {
    return (
      <div className={appStyles.masterContainer}>
        <Navigation />
        {this.renderEventDetails()}
      </div>
    );
  }
}

export default graphql(createParticipation)(EventDetailsPage);
