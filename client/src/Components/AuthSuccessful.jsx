import React, { Component } from "react";

class AuthSuccessful extends Component {
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
