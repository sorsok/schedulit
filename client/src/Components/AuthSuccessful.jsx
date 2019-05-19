import React, { Component } from "react";

class AuthSuccessful extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    window.opener.redirect();
    window.close();
    return (
      <div>
      </div>
    );
  }
}

export default AuthSuccessful;
