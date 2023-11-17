import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useState } from "react";

const API_KEY = "Bearer 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";

function App() {
  //will be ... when chatgpt will be loading

  const [typing, setTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Chat",
      sender: "ChatGPT",
    },
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setTyping(true);

    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return {
        role: role,
        content: messageObject.message,
      };
    });

    const systemMessage = {
      role: "system",
      content: "Explane all concepts like i'm 10 years old ",
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json ",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data.choices[0].message.content);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setTyping(false);
      });
  }

  return (
    <>
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              typingIndicator={
                typing ? <TypingIndicator content="typing" /> : null
              }
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput
              placeholder="type Message here "
              onSend={handleSend}
            ></MessageInput>
          </ChatContainer>
        </MainContainer>
      </div>
    </>
  );
}

export default App;

//Voice verdion

// import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
// import {
//   MainContainer,
//   ChatContainer,
//   MessageList,
//   Message,
//   MessageInput,
//   TypingIndicator,
// } from "@chatscope/chat-ui-kit-react";
// import { useState, useEffect } from "react";

// const API_KEY = "Bearer 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";

// function App() {
//   const [typing, setTyping] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       message: "Hello, I'm Chat",
//       sender: "ChatGPT",
//     },
//   ]);

//   const handleSend = async (message) => {
//     const newMessage = {
//       message: message,
//       sender: "user",
//       direction: "outgoing",
//     };

//     const newMessages = [...messages, newMessage];
//     setMessages(newMessages);
//     setTyping(true);

//     await processMessageToChatGPT(newMessages);
//   };

//   const stopVoice = () => {
//     window.speechSynthesis.cancel();
//     setTyping(false);
//   };

//   useEffect(() => {
//     const lastMessage = messages[messages.length - 1];

//     if (lastMessage.sender === "ChatGPT") {
//       const speechSynthesis = window.speechSynthesis;
//       const utterance = new SpeechSynthesisUtterance(lastMessage.message);

//       utterance.onend = () => {
//         setTyping(false);
//       };

//       speechSynthesis.speak(utterance);
//     }
//   }, [messages]);

//   async function processMessageToChatGPT(chatMessages) {
//     let apiMessages = chatMessages.map((messageObject) => {
//       let role = "";
//       if (messageObject.sender === "ChatGPT") {
//         role = "assistant";
//       } else {
//         role = "user";
//       }
//       return {
//         role: role,
//         content: messageObject.message,
//       };
//     });

//     const systemMessage = {
//       role: "system",
//       content: "Explain all concepts like I'm 10 years old",
//     };

//     const apiRequestBody = {
//       model: "gpt-3.5-turbo",
//       messages: [systemMessage, ...apiMessages],
//     };

//     try {
//       const response = await fetch(
//         "https://api.openai.com/v1/chat/completions",
//         {
//           method: "POST",
//           headers: {
//             Authorization: API_KEY,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(apiRequestBody),
//         }
//       );

//       const data = await response.json();
//       setMessages([
//         ...chatMessages,
//         {
//           message: data.choices[0].message.content,
//           sender: "ChatGPT",
//         },
//       ]);
//     } catch (error) {
//       console.error("Error processing message:", error);
//     }
//   }

//   return (
//     <div style={{ position: "relative", height: "100%", width: "100%" }}>
//       <MainContainer>
//         <ChatContainer>
//           <MessageList
//             typingIndicator={
//               typing ? <TypingIndicator content="typing" /> : null
//             }
//           >
//             {messages.map((message, i) => {
//               return <Message key={i} model={message} />;
//             })}
//           </MessageList>
//           <MessageInput placeholder="Type Message here" onSend={handleSend} />
//           <button onClick={stopVoice}>Stop</button>
//         </ChatContainer>
//       </MainContainer>
//     </div>
//   );
// }

// export default App;
