import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';


import LoginPage from './LoginPage';
import EventDetailsPage from './EventDetailsPage';
import UserEventsPage from './UserEventsPage';
import CreateEventPage from './CreateEventPage';

const cache = new InMemoryCache({
  dataIdFromObject: o => o._id
});

const uri = window.location.origin + '/graphql';
const client = new ApolloClient({ uri, cache });


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
