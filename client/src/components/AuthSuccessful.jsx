import React, { Component } from "react";

class AuthSuccessful extends Component {
  render() {
    console.log('attempting to redirect parent');
    window.opener.redirect();
    console.log('close self');
    window.close();
    return (
      <div>
      </div>
    );
  }
}

export default AuthSuccessful;
