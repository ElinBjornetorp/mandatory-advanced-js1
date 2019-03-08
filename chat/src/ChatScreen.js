
import React, { Component } from 'react';
import io from 'socket.io-client';

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {messages: []};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    //Connecting to socket
    this.socket = io('http://ec2-13-53-66-202.eu-north-1.compute.amazonaws.com:3000');

    //Showing a message 'connected' in the log when socket is connected
    this.socket.on('connect', function(){
      console.log('connected');
    });

    //All messages received from socket will be put in state:messages
    //Using big arrow to bind 'this'. 'This' will be the same as outside the function.
    this.socket.on('messages', (messages) => {
      this.setState({messages: messages});
    });

    //Updating state:messages when a new message arrives
    this.socket.on('new_message', (message) => {
      //Showing a message in the console
      console.log('A new message arrived');
      console.log(message);

      //Updating state:messages
      let messages = this.state.messages.slice();
      messages.push(message);
      this.setState({messages:messages});
    });
  }

  //This function is for turning socket off when the user logs out
  componentWillUnmount() {

  }

  sendMessage(username, content) {
    this.socket.emit('message', {
      username: username,
      content: content,
    });
  }

  handleSubmit(username, content) {

    // << 1: Sending message >>
    this.sendMessage(username, content);

    // << 2: Updating state:messages >>

    //Finding out the nr of the latest message
    let messagesLength = this.state.messages.length;
    let latestMessageId = this.state.messages[messagesLength - 1].id;
    let latestMessageNr = parseFloat(latestMessageId.split('-')[1]);

    //Creating an object out of the new message
    let newMessage = {
      username: username,
      content: content,
      id: 'message-' + (latestMessageNr + 1),
    };

    //Adding the new object to state:messages
    let messages = this.state.messages.slice();
    messages.push(newMessage);
    this.setState({messages:messages});
  }

  render() {
    return (
      <div className="chat-screen">
        <header>EasyChat</header>
        <p className="whoIsLoggedIn-paragraph">{this.props.username} is logged in.</p>
        <MessageArea messages={this.state.messages}/>
        <MessageInput onSubmit={this.handleSubmit} username={this.props.username}/>
      </div>
    );
  }
}

class MessageArea extends Component {
  render() {
    let messages = this.props.messages;
    let messageComponent;

    //Creating an array to hold the Message components
    let messageComponents = [];

    //Filling the array with Message components
    for(let message of messages) {
      messageComponent = <Message username={message.username} content={message.content} key={message.id}/>;
      messageComponents.push(messageComponent);
    }

    return(
      <div className="message-area">
      {messageComponents}
      </div>
    );
  }
}

class Message extends Component {
  render() {
    return(
      <div className="message">
        <p className="message__username">Username: {this.props.username}</p>
        <p className="message__content">Content: {this.props.content}</p>
      </div>
    );
  }
}

class MessageInput extends Component {
  onSubmit = (e) => {
      //Preventing form being sent
      e.preventDefault();

      //Finding the textarea, from where I want to collect the input
      let form = e.target;
      let textarea = form.querySelector('textarea');

      //Making variables for username and content
      let username = this.props.username;
      let content = textarea.value;

      this.props.onSubmit(username, content);
    }

  render() {
    return(
      <form
      className="message-input"
      onSubmit={this.onSubmit}>
        <textarea className="message-input__textarea"></textarea>
        <button className="message-input__button" type="submit">Send</button>
      </form>
    );
  }
}

export default {
  ChatScreen: ChatScreen,
  MessageArea: MessageArea,
  Message: Message,
  MessageInput: MessageInput,
}
