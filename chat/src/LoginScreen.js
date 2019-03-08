
import React, { Component } from 'react';

// ----------- Login screen ------------------------------------------

class LoginScreen extends Component {
    render() {
      return (
        <form onSubmit={this.props.onSubmit}>
          <Input/>
          <LoginButton/>
        </form>
      );
    }
  }

class Input extends Component {
    render() {
      return <input />;
    }
  }

class LoginButton extends Component {
    render() {
      return <button type="submit">Login</button>;
    }
  }

export default {
  LoginScreen: LoginScreen,
  Input: Input,
  LoginButton: LoginButton,
};
