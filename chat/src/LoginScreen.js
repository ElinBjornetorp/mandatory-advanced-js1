
import React, { Component } from 'react';

class LoginScreen extends Component {
    render() {
      if(this.props.errorMessage) {
        return (
          <form onSubmit={this.props.onSubmit}>
            <Input/>
            <LoginButton/>
            <p>The username must be no longer than 12 characters. It can contain letters, digits, space and -.</p>
            <p>Oops! Did you really read the instructions?</p>
            <p>Try again!</p>
          </form>
        );
      }
      else {
        return (
          <form onSubmit={this.props.onSubmit}>
            <Input/>
            <LoginButton/>
            <p>The username must be no longer than 12 characters. It can contain letters, digits, space and -.</p>
          </form>
        );
      }
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
