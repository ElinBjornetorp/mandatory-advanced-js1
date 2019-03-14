import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginScreen from './LoginScreen.js';
import ChatScreen from './ChatScreen.js';

//Socket
import io from 'socket.io-client';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      username: undefined,
      errorMessage: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  validateUsername(username) {
    let regex = /^[\w\- ]{1,12}$/;

    //Returning true if the username is ok, otherwise returning false
    return regex.test(username);
  }

  onSubmit(event) {
    //Preventing form being sent
    event.preventDefault();

    //Collecting username
    let input = event.target.querySelector('input');

    //If the username is ok, update state:username and continue to the chat page. Otherwise, show an error message.
    let usernameIsOk = this.validateUsername(input.value);
    if(usernameIsOk) {
      this.setState({username: input.value});
      this.setState({isLoggedIn: true});
      this.setState({errorMessage: false});
    }
    else {
      this.setState({errorMessage: true});
    }
  }

  onClick(event) {
    this.setState({isLoggedIn: false});
  }

  render() {
    let page = <LoginScreen.LoginScreen onSubmit={this.onSubmit} errorMessage={this.state.errorMessage}/>;

    if (this.state.isLoggedIn) {
      page = <ChatScreen.ChatScreen username={this.state.username} onClick={this.onClick}/>;
    }

    return (
      <div className="App">
        {page}
      </div>
    );
  }
}

export default App;
