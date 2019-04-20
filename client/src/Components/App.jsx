import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';


import LoginPage from './LoginPage';
import EventDetailsPage from './EventDetailsPage';
import UserEventsPage from './UserEventsPage';
import CreateEventPage from './CreateEventPage';

const client = new ApolloClient({ uri: "http://localhost:3000/graphql" });


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={UserEventsPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/events/new" exact component={CreateEventPage} />
            <Route path="/events/:id" component={EventDetailsPage} />
          </Switch>
        </BrowserRouter>
      </ApolloProvider >
    );
  }
}

export default App;
