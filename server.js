const express = require("express");

const app = express();

const http = require("http").createServer(app);
const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname +'/public'))

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
})

const io = require("socket.io")(http);

const users = {};
  
// socket ek particular connection hai toh 
// io.on ek socket.io instance hai joki incoming requests ko listen karega
//socket.on ka matlab hai ki jab bhi ek connection ke saath kuch hoga toh us particular connection par ke saath kya hona chahiye 
io.on('connection', (socket) => {   // when io.on listen the new request then socket.io runs according to the situation
    // console.log('Connected');


    socket.on('new-user-joined', name => {
        console.log("New User", name);
        users[socket.id] = name;    // it gives a unique to the user 
        
        socket.broadcast.emit('user-joined', name);   // Priyanka has joined the chat send message to all except Priyanka
    });
    
    // socket.on ye events hote hai
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
})