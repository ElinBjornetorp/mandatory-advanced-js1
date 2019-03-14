
import React, { Component } from 'react';
import io from 'socket.io-client';
import Emojify from 'react-emojione'; //Emojify is a component
import ScrollToBottom from "react-scroll-to-bottom";

// ------------------ Component: Chat screen ---------------------------
class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      errorMessage: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    //Connecting to socket
    this.socket = io('http://ec2-13-53-66-202.eu-north-1.compute.amazonaws.com:3000');

    //Showing a message 'connected' in the log when socket is connected
    this.socket.on('connect', function(){
      console.log('connected');
    });

    //Showing a message 'disconnected' in the log when socket is disconnected
    this.socket.on('disconnect', function(){
      console.log('disconnected');
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

  //Disconnecting socket when the user logs out
  componentWillUnmount() {
    this.socket.disconnect();
  }

  sendMessage(username, content) {
    this.socket.emit('message', {
      username: username,
      content: content,
    });
  }

  handleSubmit(username, content) {
    // << 1: Checking that the message is between 1 and 200 characters long >>
    let contentIsOk = content.length <= 200 && content.length > 0;

    // << 2: If ok, send message and update state:messages >>
    if(contentIsOk) {

      console.log('This message is ok.');

      //Removing error message
      this.setState({errorMessage: false});

      //Sending message
      this.sendMessage(username, content);

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
    else {
      console.log('This message is not ok.');
      this.setState({errorMessage: true});
    }

  }

  convertToLinks(string) {

    // debugger;

    //Splitting string
    let words = string.split(" ");

    //Creating regex:s
    let regex1 = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
    let regex2 = /[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

    //Looping through the array with 'map'
    //Returning a link component if the word is a link
    const convertedArray = words.map((word) => { // <-- convertedArray will contain strings and link-components
      if(regex1.test(word)) {
        return <Link url={word}/>; //This will replace the string with a link component
      }
      else if(regex2.test(word)) {
        return <LinkWithHttpAdded url={word}/>; //This will replace the string with a link component
      }

      return word;
    });

    let newArray = convertedArray.map((word) => {
      return [word, " "];
    });

    return newArray;
  }

  render() {
      return (
        <ScrollToBottom>
        <div className="chat-screen">
          <p>EasyChat</p>
          <p className="whoIsLoggedIn-paragraph">{this.props.username} is logged in.</p>
          <button className="log-out-button" onClick={this.props.onClick}>Log out</button>
          <MessageArea messages={this.state.messages} convertToLinks={this.convertToLinks}/>
          <MessageInput onSubmit={this.handleSubmit} username={this.props.username}/>
          {this.state.errorMessage ? <ErrorMessageForChatScreen /> : null}
        </div>
        </ScrollToBottom>
      );
  }
}

// ------------------ Component: Message area ---------------------------
class MessageArea extends Component {
  render() {
    let messages = this.props.messages;
    let messageComponent;

    //Creating an array to hold the Message components
    let messageComponents = [];

    //Filling the array with Message components
    for(let message of messages) {
      messageComponent = <Message username={message.username} content={message.content} key={message.id} convertToLinks={this.props.convertToLinks}/>;
      messageComponents.push(messageComponent);
    }

    return(
      <div className="message-area">
      {messageComponents}
      </div>
    );
  }
}

// ------------------ Component: Message ---------------------------
class Message extends Component {
  render() {
    //Converting links
    let convertedContent = this.props.convertToLinks(this.props.content);

    return(
      <div className="message">
        <p className="message__username">Username: {this.props.username}</p>
        <Emojify className="message__content">Content: {convertedContent}</Emojify>
      </div>
    );
  }
}

// ------------------ Component: Message input ---------------------------
//             << Includes a textarea and a button >>
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
      <form className="message-input" onSubmit={this.onSubmit}>
        <textarea className="message-input__textarea"></textarea>
        <button className="message-input__button" type="submit">Send</button>
      </form>
    );
  }
}

// ------------------ Component: Error message (chat screen) ---------------------------
class ErrorMessageForChatScreen extends Component {
  render() {
    return (
      <p>Maximum length is 200 characters, minimum 1 character. Try again!</p>
    );
  }
}

// ------------------ Component: Link ---------------------------
class Link extends Component {
  render() {
    return <a href={this.props.url}>{this.props.url}</a>;
  }
}

// ------------------ Component: Link with http added  ---------------------------
//                     << Adds http protocol to url >>
class LinkWithHttpAdded extends Component {
  render() {
    return <a href={'http://'+this.props.url}>{this.props.url}</a>;
  }
}

export default {
  ChatScreen: ChatScreen,
  MessageArea: MessageArea,
  Message: Message,
  MessageInput: MessageInput,
}
