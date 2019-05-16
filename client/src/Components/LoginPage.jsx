import React from "react";
import Cookies from "js-cookie";
import appStyles from '../styles/App.css';
import styles from "../styles/Login.css";

import signinNormal from "../assets/signinNormal.png";
import signinFocus from "../assets/signinFocus.png";
import greenLogo from '../assets/greenLogo.png';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      path: Cookies.get('path')
    }
    Cookies.remove('path');
    this.imageSource = this.imageSource.bind(this);
    window.redirect = this.redirect.bind(this);
  }

  onClick() {
    window.open('/auth/google', 'Login Page', 'width=700, height=700');
  }

  redirect() {
    const path = this.state.path ? this.state.path : '/';
    this.props.history.push(path);
  }

  imageSource() {
    if (this.state.hover) {
      return signinFocus;
    }
    return signinNormal;
  }

  render() {
    return (
      <div className={appStyles.masterContainer}>
        <div className={styles.container}>
          <div className={styles.inner}>
            <div className={styles.schedulIt} >
              <img src={greenLogo} style={{ width: '1.5em', height: '1.5em', padding: '0.3em' }}></img>
              <div>Schedulit</div>
            </div>
            <div className={styles.loginCenter}>
              <button
                className={styles.button}
                onClick={this.onClick}
                onMouseDown={() => this.setState({ pressed: true })}
                onMouseUp={() => this.setState({ pressed: false })}
                onMouseEnter={() => this.setState({ hover: true })}
                onMouseLeave={() => this.setState({ hover: false })}
              >
                <img className={styles.googleImage} src={this.imageSource()} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
