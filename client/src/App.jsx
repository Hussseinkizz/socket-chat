import { HiPaperAirplane } from 'react-icons/hi';
import { ReceivedMessage } from './components/received-message';
import { SentMessage } from './components/sentMessage';
import { io } from 'socket.io-client';
import { useState } from 'react';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const socket = io('ws://localhost:8000');

  // send message to server
  const sendMessage = () => {
    if (userInput) {
      socket.emit('newMessage', String(userInput));
      setMessages((messages) => [
        ...messages,
        {
          id: messages.length + 1,
          type: 'sent',
          text: String(userInput),
          time: Date.now().toLocaleString(),
        },
      ]);
      // reset input bar
      setUserInput('');
    }
  };

  // receive a message from the server
  socket.on('receiveNewMessage', (data) => {
    setMessages((messages) => [
      ...messages,
      {
        id: messages.length + 1,
        type: 'received',
        text: data,
        time: Date.now().toLocaleString(),
      },
    ]);
    console.log(`Server Message: ${data}, ${messages}`);
  });

  return (
    <main className="min-h-screen h-screen w-full flex items-center justify-center overflow-hidden transition-all ease-linear duration-300">
      <div className="w-full flex flex-col gap-4 justify-between items-center h-screen overflow-hidden">
        {/* The Header */}
        <header className="bg-gradient-to-l from-rose-400 via-fuchsia-500 to-indigo-500 w-full px-8 py-2 flex justify-between items-center gap-4 shadow-md sticky top-0">
          <h1 className="font-bold text-lg text-white">Socket Chat</h1>
          <button className="flex px-4 py-2 gap-2 rounded-lg hover:bg-purple-600 bg-white font-semibold">
            Profile
          </button>
        </header>
        {/* The Chats */}
        <main
          id="chat"
          className="overflow-y-auto px-8 flex justify-between items-center gap-4 flex-col w-full">
          {messages.length >= 1 ? (
            messages?.map((message) =>
              message.type === 'sent' ? (
                <SentMessage key={message.id} text={message.text} />
              ) : (
                <ReceivedMessage key={message.id} text={message.text} />
              )
            )
          ) : (
            <p>🤖 Nothing Yet, Say Hello!</p>
          )}
        </main>
        {/* The Chat Bar */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-gradient-to-bl from-rose-100 to-teal-100 w-full px-8 py-2 flex justify-between items-center gap-4 shadow-md sticky bottom-0">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="px-4 py-3 border border-purple-300 hover:border-purple-500 rounded-lg w-4/5 outline-none text-gray-600"
            id="chatInput"
            placeholder="say hello world..."
          />
          <button
            type="submit"
            onClick={sendMessage}
            className="flex px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-500 gap-2 items-center group">
            <span className="flex">send</span>
            <HiPaperAirplane className="ease-linear transition-all duration-300 rotate-90 group-hover:translate-x-2" />
          </button>
        </form>
      </div>
    </main>
  );
};

export default App;
