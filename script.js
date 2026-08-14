function sendMessage() {
    const userInput = document.getElementById("userInput");
    const chatBox = document.getElementById("chat-box");
    const message = userInput.value.trim();






    if (message === "") return;

    const userDiv = document.createElement("div");
    userDiv.classList.add("message", "user");
    userDiv.textContent = "You: " + message;
    chatBox.appendChild(userDiv);

    const botDiv = document.createElement("div");
    botDiv.classList.add("message", "bot");
    botDiv.textContent = "Bot: " + getBotResponse(message);
    chatBox.appendChild(botDiv);

    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotResponse(message) {
    message = message.toLowerCase();

    if (message.includes("hi") || message.includes("how are you")) {
        return "Hello! How can I help you?";
    } else if (message.includes("bye")) {
        return "Goodbye!";
    } else {
        return "Sorry, I didn't understand that.";
    }
}