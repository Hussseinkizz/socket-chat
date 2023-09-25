import { io } from 'socket.io-client';

const socket = io('ws://localhost:8000');

// receive a message from the server
socket.on('sentNewMessage', (data) => {
  console.log(`Server Message: ${data}`);
});

// send message to server
socket.emit('onNewMessage', 'hello server am your client!');
