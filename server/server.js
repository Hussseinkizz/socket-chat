import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';

const app = express();
const PORT = 8000;
const server = createServer(app);

// keep messages somewhere say a db
const userMessages = [];

const io = new Server(server, {
  // socket io options
  cors: { origin: '*' },
});

const bundle = '5';
let count = bundle * 1;

io.on('connection', (socket) => {
  // sending message to client
  // first store the message then send it to client
  let newServerMessage = {
    id: userMessages.length + 1,
    type: 'outgoing',
    text: 'Hello from server!',
    time: Date.now().toLocaleString(),
  };

  // for simulation auto send message after every 3secs
  // let count = 1;
  // setInterval(() => {
  //   userMessages.push(newServerMessage);
  //   socket.emit('receiveNewMessage', `${newServerMessage.text} ${count++}`);
  // }, 3000);

  // recieve message from client
  socket.on('newMessage', (data) => {
    userMessages.push({
      id: userMessages.length + 1,
      type: 'incoming',
      text: String(data),
      time: Date.now().toLocaleString(),
    });

    if (count > 0) {
      socket.emit('receiveNewMessage', `Message Sent, ${count - 1} Remaining!`);
      count--;
    } else {
      socket.emit(
        'receiveNewMessage',
        `Message Not Sent, ${bundle} sent and your bundle is over!`
      );
    }

    // logg data or something
    console.log(`Am server, new message from client: ${data}`);
    console.log(
      `${userMessages.length} messages sent: ${JSON.stringify(userMessages)}`
    );
  });
});

app.get('/', (req, res) => {
  if (req.path !== '/') {
    res.json({ status: '404 Not Found!' });
  }
  res.json({ status: 'connected!' });
});

server.listen(PORT, () => {
  console.log(`🚀 Server Running on port: http://localhost:${PORT}`);
});
