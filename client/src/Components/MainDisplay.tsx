import * as React from 'react';
import * as Cookies from 'js-cookie';
import * as Promise from 'bluebird';
import axios from 'axios';

import EventDetailsPage from './EventDetailsPage';
import UserEventsPage from './UserEventsPage';
import CreateEventPage from './CreateEventPage';
import Navigation from './Navigation';


interface Props {
  loggedIn: boolean
}

interface State {
  view: string,
  user: User,
  displayedEvent: Event
}

export interface User {
  id: string,
  googleProfile: object,
  eventsCreated: Event[],
  eventsJoined: Event[]
}

export interface Event {
  id: string,
  creatorId: string,
  description: string,
  availableSlots: TimeSlot<Date>[],
  participations: string[],
  participants: string[]
}

interface TimeSlot<T> {
  startTime: T,
  endTime: T
}

class MainDisplay extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      view: 'userEventsPage',
      displayedEvent: null,
      user: null
    }
  }

  componentDidMount() {
    let eventId = Cookies.get('eventId');
    Cookies.remove('eventId');
    if (eventId) {
      this.fetchEvent(eventId).then(this.viewEventDetails);
    }
    this.fetchAllUserEvents();
  }

  viewEventDetails = (event: Event) => {
    this.setState({ displayedEvent: event, view: 'eventDetailsPage' });

  }

  fetchEvent = (eventId: string) => {
    return axios.get('/api/event/' + eventId).then(({ data }) => {
      data.availableSlots = data.availableSlots.map(this.datifyTimeSlot);
      return data;
    });
  }

  datifyTimeSlot = (timeSlot: TimeSlot<string>): TimeSlot<Date> => {
    return {
      startTime: new Date(timeSlot.startTime),
      endTime: new Date(timeSlot.endTime)
    };
  }

  fetchAllUserEvents = (): void => {
    axios
      .get('/api/user')
      .then(({ data }): Promise<User> => {
        console.log(data);
        data.eventsCreated = Promise.all(data.eventsCreated.map(this.fetchEvent));
        data.eventsJoined = Promise.all(data.eventsJoined.map(this.fetchEvent));
        return Promise.props(data);
      })
      .then((user): void => {
        user = user as User;
        this.setState({ user });
      })
      .catch(error => console.error(error));
  }

  getDisplay = () => {
    if (this.state.view === 'createEventPage') {
      return <CreateEventPage />;
    } else if (this.state.view === 'userEventsPage') {
      return <UserEventsPage user={this.state.user} viewEventDetails={this.viewEventDetails} />;
    } else if (this.state.view === 'eventDetailsPage') {
      return <EventDetailsPage displayedEvent={this.state.displayedEvent} />;
    }
  }

  changeView = (view: string) => {
    this.setState({ view });
    this.componentDidMount();
  }

  render() {
    return (
      <>
        <Navigation changeView={this.changeView} />
        {this.getDisplay()}
      </>
    );
  }
}

export default MainDisplay;