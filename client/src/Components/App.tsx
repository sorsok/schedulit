import * as React from 'react';
import *  as Cookies from 'js-cookie';
import axios from 'axios';
import *  as styles from '../styles/App.css'
import LoginPage from './LoginPage';
import MainDisplay from './MainDisplay';

declare global {
  interface Window { logUserIn: Function }
}

interface Props {
}

interface State {
  loggedIn: boolean
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loggedIn: false
    };
    this.isUserInSession();
    Cookies.remove('sendToHome');
    window.logUserIn = this.logUserIn;
  }

  isUserInSession = (): Promise<void> => {
    return axios.get('/api/user').then(({ data }) => this.setState({ loggedIn: data._id }));
  }

  logUserIn = (): void => {
    this.setState({ loggedIn: true })
  }

  openLoginPopup = (): void => {
    window.open('/auth/google', 'Login Page', 'width=700, height=700');
  }

  render() {
    return (
      <div className={styles.masterContainer}>
        {this.state.loggedIn ? <MainDisplay loggedIn={this.state.loggedIn} /> : <LoginPage openLoginPopup={this.openLoginPopup} />}
      </div>
    )
  }
}

export default App;
