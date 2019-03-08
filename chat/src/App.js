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
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();

    //Changing isLoggedIn to true
    this.setState({isLoggedIn: true});

    //Collecting username
    let input = event.target.querySelector('input');
    this.setState({username: input.value});
  }

  render() {
    let page = <LoginScreen.LoginScreen onSubmit={this.onSubmit}/>;

    if (this.state.isLoggedIn) {
      page = <ChatScreen.ChatScreen username={this.state.username}/>;
    }

    return (
      <div className="App">
        {page}
      </div>
    );
  }
}

export default App;
