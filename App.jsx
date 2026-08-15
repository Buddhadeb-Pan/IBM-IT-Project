import { useEffect, useState } from "react";
import "./App.css";

const defaultMessage = {
  id: Date.now(),
  sender: "ai",
  text: "Hello! 👋 I'm your AI assistant. How can I help you today?",
};

const generateResponse = (question) => {
  const text = question.toLowerCase();

  if (text.includes("hello") || text.includes("hi")) {
    return "Hello! 👋 Nice to meet you. How can I help you today?";
  }

  if (text.includes("react")) {
    return "React is a JavaScript library for building modern and interactive user interfaces using reusable components.";
  }

  if (text.includes("javascript")) {
    return "JavaScript is a programming language used to create interactive and dynamic web applications.";
  }

  if (text.includes("python")) {
    return "Python is a powerful programming language used for web development, automation, data science, AI and machine learning.";
  }

  if (text.includes("html")) {
    return "HTML provides the structure of a web page. CSS handles styling and JavaScript adds behaviour and interactivity.";
  }

  if (text.includes("css")) {
    return "CSS is used to style web pages, including colors, layouts, spacing, animations and responsive designs.";
  }

  if (text.includes("who are you")) {
    return "I'm your AI Chatbot assistant. This version is currently running as a frontend demo.";
  }

  if (text.includes("thank")) {
    return "You're welcome! 😊";
  }

  return `I understand your question about "${question}". This is currently a frontend AI chatbot demo. A real AI API can be connected later to generate intelligent responses.`;
};

function App() {
  /* =====================================
     AUTH
  ===================================== */

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("chatbotUser");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [authMode, setAuthMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* =====================================
     CHAT DATA
  ===================================== */

  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem("chatbotChats");

    if (savedChats) {
      return JSON.parse(savedChats);
    }

    return [
      {
        id: 1,
        title: "New conversation",
        messages: [defaultMessage],
      },
    ];
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    const savedActiveChat = localStorage.getItem(
      "activeChatId"
    );

    return savedActiveChat
      ? Number(savedActiveChat)
      : 1;
  });

  const [input, setInput] = useState("");

  const [isTyping, setIsTyping] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* =====================================
     UI STATES
  ===================================== */

  const [profileOpen, setProfileOpen] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme =
      localStorage.getItem("chatbotTheme");

    return savedTheme !== "light";
  });

  /* =====================================
     SAVE CHAT DATA
  ===================================== */

  useEffect(() => {
    localStorage.setItem(
      "chatbotChats",
      JSON.stringify(chats)
    );
  }, [chats]);

  useEffect(() => {
    localStorage.setItem(
      "activeChatId",
      activeChatId.toString()
    );
  }, [activeChatId]);

  useEffect(() => {
    localStorage.setItem(
      "chatbotTheme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  /* =====================================
     CURRENT CHAT
  ===================================== */

  const activeChat =
    chats.find(
      (chat) => chat.id === activeChatId
    ) || chats[0];

  const messages =
    activeChat?.messages || [];


  /* =====================================
     AUTHENTICATION
  ===================================== */

  const handleAuth = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    if (authMode === "register" && !name) {
      alert("Please enter your name.");
      return;
    }

    if (password.length < 6) {
      alert(
        "Password must contain at least 6 characters."
      );
      return;
    }

    const newUser = {
      name:
        authMode === "register"
          ? name.trim()
          : email.split("@")[0],
      email: email.toLowerCase().trim(),
    };

    localStorage.setItem(
      "chatbotUser",
      JSON.stringify(newUser)
    );

    setUser(newUser);

    setName("");
    setEmail("");
    setPassword("");
  };

  const handleDemoLogin = () => {
    const demoUser = {
      name: "Demo User",
      email: "demo@example.com",
    };

    localStorage.setItem(
      "chatbotUser",
      JSON.stringify(demoUser)
    );

    setUser(demoUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("chatbotUser");

    setUser(null);

    setProfileOpen(false);
  };


  /* =====================================
     CREATE NEW CHAT
  ===================================== */

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New conversation",
      messages: [
        {
          id: Date.now() + 1,
          sender: "ai",
          text:
            "New conversation started. How can I help you?",
        },
      ],
    };

    setChats((previousChats) => [
      newChat,
      ...previousChats,
    ]);

    setActiveChatId(newChat.id);

    setInput("");

    setProfileOpen(false);

    if (window.innerWidth <= 800) {
      setSidebarOpen(false);
    }
  };


  /* =====================================
     SELECT CHAT
  ===================================== */

  const selectChat = (chatId) => {
    setActiveChatId(chatId);

    setProfileOpen(false);

    if (window.innerWidth <= 800) {
      setSidebarOpen(false);
    }
  };


  /* =====================================
     DELETE CHAT
  ===================================== */

  const deleteChat = (chatId, event) => {
    event.stopPropagation();

    if (chats.length === 1) {
      alert(
        "You need to keep at least one conversation."
      );

      return;
    }

    const remainingChats = chats.filter(
      (chat) => chat.id !== chatId
    );

    setChats(remainingChats);

    if (chatId === activeChatId) {
      setActiveChatId(remainingChats[0].id);
    }
  };


  /* =====================================
     CLEAR ALL CHATS
  ===================================== */

  const clearAllChats = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all conversations?"
    );

    if (!confirmed) {
      return;
    }

    const newChat = {
      id: Date.now(),
      title: "New conversation",
      messages: [defaultMessage],
    };

    setChats([newChat]);

    setActiveChatId(newChat.id);

    setSettingsOpen(false);
  };


  /* =====================================
     SEND MESSAGE
  ===================================== */

  const sendMessage = () => {
    const question = input.trim();

    if (!question || isTyping) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: question,
    };

    setChats((previousChats) =>
      previousChats.map((chat) => {
        if (chat.id !== activeChatId) {
          return chat;
        }

        const shouldRename =
          chat.title === "New conversation";

        return {
          ...chat,

          title: shouldRename
            ? question.length > 28
              ? `${question.slice(0, 28)}...`
              : question
            : chat.title,

          messages: [
            ...chat.messages,
            userMessage,
          ],
        };
      })
    );

    setInput("");

    setIsTyping(true);

    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: generateResponse(question),
      };

      setChats((previousChats) =>
        previousChats.map((chat) => {
          if (chat.id !== activeChatId) {
            return chat;
          }

          return {
            ...chat,

            messages: [
              ...chat.messages,
              aiMessage,
            ],
          };
        })
      );

      setIsTyping(false);
    }, 1000);
  };


  /* =====================================
     ENTER KEY
  ===================================== */

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      sendMessage();
    }
  };


  /* =====================================
     COPY MESSAGE
  ===================================== */

  const copyMessage = async (text) => {
    try {
      await navigator.clipboard.writeText(text);

      alert("Message copied!");
    } catch {
      alert("Unable to copy message.");
    }
  };


  /* =====================================
     REGENERATE LAST AI MESSAGE
  ===================================== */

  const regenerateResponse = () => {
    if (isTyping) {
      return;
    }

    const currentMessages =
      activeChat.messages;

    const lastUserMessage =
      [...currentMessages]
        .reverse()
        .find(
          (message) =>
            message.sender === "user"
        );

    if (!lastUserMessage) {
      return;
    }

    setIsTyping(true);

    setTimeout(() => {
      const newAIMessage = {
        id: Date.now(),
        sender: "ai",
        text: generateResponse(
          lastUserMessage.text
        ),
      };

      setChats((previousChats) =>
        previousChats.map((chat) => {
          if (chat.id !== activeChatId) {
            return chat;
          }

          const messagesWithoutLastAI =
            [...chat.messages];

          if (
            messagesWithoutLastAI[
              messagesWithoutLastAI.length - 1
            ]?.sender === "ai"
          ) {
            messagesWithoutLastAI.pop();
          }

          return {
            ...chat,

            messages: [
              ...messagesWithoutLastAI,
              newAIMessage,
            ],
          };
        })
      );

      setIsTyping(false);
    }, 1000);
  };


  /* =====================================
     AUTH SCREEN
  ===================================== */

  if (!user) {
    return (
      <div className="auth-page">

        <div className="auth-background-glow"></div>

        <div className="auth-container">

          <div className="auth-brand">

            <div className="brand-logo">
              ✦
            </div>

            <h1>
              AI Chatbot
            </h1>

            <p>
              Your intelligent AI assistant
            </p>

          </div>


          <div className="auth-card">

            <div className="auth-tabs">

              <button
                className={
                  authMode === "login"
                    ? "auth-tab active"
                    : "auth-tab"
                }
                onClick={() =>
                  setAuthMode("login")
                }
              >
                Login
              </button>

              <button
                className={
                  authMode === "register"
                    ? "auth-tab active"
                    : "auth-tab"
                }
                onClick={() =>
                  setAuthMode("register")
                }
              >
                Register
              </button>

            </div>


            <div className="auth-heading">

              <h2>
                {authMode === "login"
                  ? "Welcome back"
                  : "Create your account"}
              </h2>

              <p>
                {authMode === "login"
                  ? "Sign in to continue to your AI assistant."
                  : "Create an account to start chatting."}
              </p>

            </div>


            <form onSubmit={handleAuth}>

              {authMode === "register" && (
                <div className="input-group">

                  <label>
                    Full name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                  />

                </div>
              )}


              <div className="input-group">

                <label>
                  Email address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>


              <div className="input-group">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

              </div>


              {authMode === "login" && (
                <div className="forgot-password">

                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Password recovery will be connected later."
                      )
                    }
                  >
                    Forgot password?
                  </button>

                </div>
              )}


              <button
                type="submit"
                className="auth-submit"
              >
                {authMode === "login"
                  ? "Sign in"
                  : "Create account"}
              </button>

            </form>


            <div className="auth-divider">
              <span>
                OR
              </span>
            </div>


            <button
              className="demo-login"
              onClick={handleDemoLogin}
            >
              Continue as Demo User
            </button>


            <p className="auth-switch">

              {authMode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                type="button"
                onClick={() =>
                  setAuthMode(
                    authMode === "login"
                      ? "register"
                      : "login"
                  )
                }
              >
                {authMode === "login"
                  ? " Create account"
                  : " Sign in"}
              </button>

            </p>

          </div>


          <p className="auth-footer">
            AI Chatbot • Frontend Demo
          </p>

        </div>

      </div>
    );
  }


  /* =====================================
     MAIN CHAT UI
  ===================================== */

  return (
    <div
      className={
        darkMode
          ? "chat-app"
          : "chat-app light-theme"
      }
    >

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside
        className={
          sidebarOpen
            ? "sidebar"
            : "sidebar sidebar-closed"
        }
      >

        <div className="sidebar-top">

          <div className="sidebar-brand">

            <div className="mini-logo">
              ✦
            </div>

            {sidebarOpen && (
              <span>
                AI Chatbot
              </span>
            )}

          </div>


          {sidebarOpen && (
            <button
              className="new-chat-btn"
              onClick={createNewChat}
            >
              <span>
                ＋
              </span>

              New chat
            </button>
          )}

        </div>


        {sidebarOpen && (
          <>

            <div className="chat-history">

              <p className="history-title">
                Recent chats
              </p>


              {chats.map((chat) => (

                <button
                  key={chat.id}
                  className={
                    activeChatId === chat.id
                      ? "history-item active"
                      : "history-item"
                  }
                  onClick={() =>
                    selectChat(chat.id)
                  }
                >

                  <span className="history-icon">
                    ◇
                  </span>

                  <span className="history-text">
                    {chat.title}
                  </span>

                  <span
                    className="delete-chat"
                    onClick={(event) =>
                      deleteChat(
                        chat.id,
                        event
                      )
                    }
                    title="Delete chat"
                  >
                    ×
                  </span>

                </button>

              ))}

            </div>


            <div className="sidebar-bottom">

              <button
                className="sidebar-menu"
                onClick={() =>
                  setSettingsOpen(true)
                }
              >
                <span>
                  ⚙
                </span>

                Settings
              </button>


              <button
                className="sidebar-menu logout-btn"
                onClick={handleLogout}
              >
                <span>
                  ↪
                </span>

                Log out
              </button>


              <div className="user-profile">

                <div className="user-avatar">
                  {user.name
                    ?.charAt(0)
                    .toUpperCase()}
                </div>


                <div className="user-info">

                  <strong>
                    {user.name}
                  </strong>

                  <span>
                    {user.email}
                  </span>

                </div>

              </div>

            </div>

          </>
        )}

      </aside>


      {/* =====================================
          MAIN
      ===================================== */}

      <main className="chat-main">


        {/* HEADER */}

        <header className="chat-header">

          <div className="header-left">

            <button
              className="sidebar-toggle"
              onClick={() =>
                setSidebarOpen(
                  !sidebarOpen
                )
              }
            >
              ☰
            </button>


            <div className="mobile-title">
              AI Chatbot
            </div>

          </div>


          <div className="header-center">

            <span>
              AI Assistant
            </span>

            <span className="online-dot"></span>

          </div>


          <div className="header-right">

            <button
              className="header-button"
              onClick={createNewChat}
              title="New chat"
            >
              ＋
            </button>


            <button
              className="header-avatar"
              onClick={() =>
                setProfileOpen(
                  !profileOpen
                )
              }
            >
              {user.name
                ?.charAt(0)
                .toUpperCase()}
            </button>


            {profileOpen && (

              <div className="profile-menu">

                <div className="profile-menu-header">

                  <div className="profile-large-avatar">
                    {user.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>

                    <strong>
                      {user.name}
                    </strong>

                    <span>
                      {user.email}
                    </span>

                  </div>

                </div>


                <div className="profile-divider"></div>


                <button
                  onClick={() => {
                    setSettingsOpen(true);
                    setProfileOpen(false);
                  }}
                >
                  ⚙ Settings
                </button>


                <button
                  onClick={() =>
                    setDarkMode(
                      !darkMode
                    )
                  }
                >
                  {darkMode
                    ? "☀ Light mode"
                    : "☾ Dark mode"}
                </button>


                <button
                  className="profile-logout"
                  onClick={handleLogout}
                >
                  ↪ Log out
                </button>

              </div>

            )}

          </div>

        </header>


        {/* MESSAGES */}

        <div className="messages-area">

          <div className="messages-container">


            {messages.length === 1 && (
              <div className="welcome-section">

                <div className="welcome-logo">
                  ✦
                </div>

                <h1>
                  How can I help you today?
                </h1>

                <p>
                  Ask me anything. I'm here
                  to help you learn, create
                  and explore.
                </p>


                <div className="suggestion-grid">

                  <button
                    onClick={() =>
                      setInput(
                        "Explain React JS"
                      )
                    }
                  >
                    <span>
                      ⚡
                    </span>

                    <strong>
                      Explain React JS
                    </strong>

                    <small>
                      Learn something new
                    </small>

                  </button>


                  <button
                    onClick={() =>
                      setInput(
                        "Give me a Python project idea"
                      )
                    }
                  >
                    <span>
                      ◈
                    </span>

                    <strong>
                      Python ideas
                    </strong>

                    <small>
                      Build something useful
                    </small>

                  </button>


                  <button
                    onClick={() =>
                      setInput(
                        "Help me with coding"
                      )
                    }
                  >
                    <span>
                      ⌘
                    </span>

                    <strong>
                      Coding help
                    </strong>

                    <small>
                      Solve a programming problem
                    </small>

                  </button>


                  <button
                    onClick={() =>
                      setInput(
                        "Give me a final year project idea"
                      )
                    }
                  >
                    <span>
                      ✧
                    </span>

                    <strong>
                      Project ideas
                    </strong>

                    <small>
                      Create something amazing
                    </small>

                  </button>

                </div>

              </div>
            )}


            {messages.map((message) => (

              <div
                key={message.id}
                className={
                  message.sender === "user"
                    ? "message-row user-message"
                    : "message-row ai-message"
                }
              >

                <div
                  className={
                    message.sender === "user"
                      ? "message-avatar user-message-avatar"
                      : "message-avatar ai-message-avatar"
                  }
                >
                  {message.sender === "user"
                    ? user.name
                        ?.charAt(0)
                        .toUpperCase()
                    : "✦"}
                </div>


                <div className="message-content">

                  <div className="message-name">
                    {message.sender === "user"
                      ? user.name
                      : "AI Assistant"}
                  </div>


                  <div className="message-text">
                    {message.text}
                  </div>


                  {message.sender === "ai" && (
                    <div className="message-actions">

                      <button
                        onClick={() =>
                          copyMessage(
                            message.text
                          )
                        }
                        title="Copy"
                      >
                        ⧉
                      </button>


                      {message.id ===
                        messages[
                          messages.length - 1
                        ]?.id && (
                        <button
                          onClick={
                            regenerateResponse
                          }
                          title="Regenerate"
                        >
                          ↻
                        </button>
                      )}

                    </div>
                  )}

                </div>

              </div>

            ))}


            {isTyping && (

              <div className="message-row ai-message">

                <div className="message-avatar ai-message-avatar">
                  ✦
                </div>

                <div className="message-content">

                  <div className="message-name">
                    AI Assistant
                  </div>

                  <div className="typing-indicator">

                    <span></span>
                    <span></span>
                    <span></span>

                  </div>

                </div>

              </div>

            )}

          </div>

        </div>


        {/* INPUT */}

        <div className="input-section">

          <div className="input-wrapper">

            <button
              className="attach-button"
              title="Attach"
              onClick={() =>
                alert(
                  "File upload will be connected later."
                )
              }
            >
              ＋
            </button>


            <textarea
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Message AI Chatbot..."
              rows="1"
            />


            <button
              className={
                input.trim()
                  ? "send-button active"
                  : "send-button"
              }
              onClick={sendMessage}
              disabled={!input.trim()}
            >
              ↑
            </button>

          </div>


          <p className="input-disclaimer">
            AI Chatbot can make mistakes.
            Check important information.
          </p>

        </div>

      </main>


      {/* =====================================
          SETTINGS MODAL
      ===================================== */}

      {settingsOpen && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSettingsOpen(false)
          }
        >

          <div
            className="settings-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="settings-header">

              <div>
                <h2>
                  Settings
                </h2>

                <p>
                  Manage your chatbot preferences
                </p>
              </div>

              <button
                className="settings-close"
                onClick={() =>
                  setSettingsOpen(false)
                }
              >
                ×
              </button>

            </div>


            <div className="settings-body">

              <div className="setting-item">

                <div>

                  <strong>
                    Appearance
                  </strong>

                  <span>
                    Choose your preferred theme
                  </span>

                </div>


                <button
                  className="theme-toggle"
                  onClick={() =>
                    setDarkMode(
                      !darkMode
                    )
                  }
                >
                  {darkMode
                    ? "☾ Dark"
                    : "☀ Light"}
                </button>

              </div>


              <div className="setting-item">

                <div>

                  <strong>
                    Account
                  </strong>

                  <span>
                    {user.email}
                  </span>

                </div>

              </div>


              <div className="setting-item">

                <div>

                  <strong>
                    Conversations
                  </strong>

                  <span>
                    Delete all saved conversations
                  </span>

                </div>


                <button
                  className="danger-button"
                  onClick={clearAllChats}
                >
                  Clear all
                </button>

              </div>

            </div>


            <div className="settings-footer">

              <button
                onClick={() =>
                  setSettingsOpen(false)
                }
              >
                Done
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;