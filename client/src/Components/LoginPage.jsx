import React from "react";

import styles from "../styles/Login.css";

import signinNormal from "../assets/signinNormal.png";
import signinFocus from "../assets/signinNormal.png";
import signinPressed from "../assets/signinNormal.png";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      pressed: false
    }
    this.renderSigninImage = this.renderSigninImage.bind(this);
  }

  onClick() {
    window.open('/auth/google', 'Login Page', 'width=700, height=700');
  }

  renderSigninImage() {
    if (this.state.pressed) {
      return <img src={signinPressed} />
    }
    if (this.state.hover) {
      return <img src={signinFocus} />
    }
    return <img src={signinNormal} />
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.schedulIt} >
            <img src="greenLogo.png" style={{ width: '1.5em', height: '1.5em', padding: '0.3em' }}></img>
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
              {this.renderSigninImage()}
            </button>
          </div>
        </div>
      </div>

    );
  }
}

export default LoginPage;
