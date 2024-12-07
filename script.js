const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");



let userMessage;
const API_KEY ="AIzaSyCkf_qMihuo31Ddyq4n20cXFMtPneUTVEc";
const inputInitHeight = chatInput.scrollHeight;




const createChatLi = (message , className) => {
    // create a chat <li> element with passed message and className
    const chatLi = document.createElement("Li");
    chatLi.classList.add("chat",className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span> <p></p>` 
    chatLi.innerHTML =chatContent;
    // now it can also input tags for above line
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLI) => {
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`; 
    const messageElement = incomingChatLI.querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contents: [{ 
            role: "user", 
            parts: [{ text: userMessage }] 
          }] 
        }),
      };
    

    //send POST reqest to API , get response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.candidates[0].content.parts[0].text; // Update message text with API response
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "oops! soomething went wrong. pls try agian"; // Update message text with API response
    }).finally(()  =>  chatbox.scrollTo(0, chatbox.scrollHeight));    
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    // when u enter the message then it will remove from textarea and show on chatbot b/c of above line 
    chatInput.value ="";
    chatInput.style.height =`${inputInitHeight}px`;



    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // Display "thinking..." message while waiting for the response
        const incomingChatLI = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLI);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        // Pass incomingChatLI to the generateResponse function
        generateResponse(incomingChatLI);
    }, 600);
};

sendChatBtn.addEventListener("click", handleChat);
// remove chatbot with togler
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
// for remove the chatbot (x) <- for this
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));


chatInput.addEventListener("input" ,() => {
    //adjust the height of the input textarea based on its content
     chatInput.style.height =`${inputInitHeight}px`;
     chatInput.style.height =`${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown" ,() => {
    //if entr key is pressed without shift key and the window
    // with is greater than 800px, handl the chat
   if(e.key === "Enter" && !e.shiftkey &&window.innerWidth >800){
    e.preventDefault();
    handleChat();
   }

});
document.getElementById("messageInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default Enter behavior (e.g., newline)
        sendMessage(); // Call your send message function
    }
});

function sendMessage() {
    const message = document.getElementById("messageInput").value;
    if (message.trim()) {
        // Send the message to the server or process it
        console.log("Message sent:", message);
        document.getElementById("messageInput").value = ""; // Clear input field
    }
}
