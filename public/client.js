const socket = io();

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
var audio = new Audio('ting_iphone.mp3');

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if(position == 'left'){
    audio.play();
  }
  
};

form.addEventListener('submit', (e) => {
    e.preventDefault();   // page will not reload
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);     // message will show to all 
    messageInput.value = '';   // after sending message the text box will empty
})

// const userName = prompt("Enter your name to join");
// socket.emit("new-user-joined", userName);

let userName;
do{
    userName = prompt("Enter your name: ");
    
}while(!userName){
    socket.emit("new-user-joined", userName);
}


socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "right");
});

socket.on("receive", (data) => {
  append(`${data.name}: ${data.message} `, "left");
});

socket.on('left', name => {
    append(`${name}: left the chat`, "left");
})
