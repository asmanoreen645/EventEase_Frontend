import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./ChatPage.css";
import API from "./api/axiosConfig";

// 🔧 Backend base URL - socket connection isi se banegi
const SOCKET_URL = "https://eventease-backend-693s.onrender.com";

const dummyConversations = [
  {
    id: 1,
    vendorId: "vendor1",
    name: "Moon Photography",
    type: "photo",
    icon: "photo_camera",
    preview: "Yes we are available!",
    time: "2m",
    unread: 2,
    online: true,
    location: "Lahore",
    price: "PKR 10,000",
    verified: true,
  },
  {
    id: 2,
    vendorId: "vendor2",
    name: "Hanif Rajput Decor",
    type: "dec",
    icon: "yard",
    preview: "Send us your event date",
    time: "1h",
    unread: 0,
    online: false,
    location: "Karachi",
    price: "PKR 10,000",
    verified: true,
  },
  {
    id: 3,
    vendorId: "vendor3",
    name: "Zaiqa Catering",
    type: "cat",
    icon: "restaurant",
    preview: "Menu details attached",
    time: "3h",
    unread: 0,
    online: true,
    location: "Lahore",
    price: "PKR 5,000",
    verified: false,
  },
];

export default function ChatPage() {
  const { vendorId } = useParams();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const initialConvo =
    dummyConversations.find((c) => c.vendorId === vendorId) ||
    dummyConversations[0];

  const [activeConvo, setActiveConvo] = useState(initialConvo);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const room = `${userId}_${activeConvo.vendorId}`;

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        // Backend route: GET /api/chat/:room (chatController.getChatHistory)
        const response = await API.get(`/api/chat/room/${room}`);
        if (response.data.success) {
          setMessages(response.data.messages);
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error("Chat history error:", err);
        }
        setMessages([
          {
            _id: "welcome",
            sender: "vendor",
            message: `Assalam o Alaikum! Welcome to ${activeConvo.name}. How can we help you?`,
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [room]);

  // ==========================================
  // 2️⃣ SOCKET.IO CONNECTION (real-time messaging)
  // ==========================================
  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.emit("join_room", room);

    socket.on("receive_message", (data) => {
      // apna hi bheja hua message dobara add na ho, isliye sender check
      setMessages((prev) => {
        const alreadyExists = prev.some(
          (m) => m._id === data._id
        );
        if (alreadyExists) return prev;
        return [...prev, data];
      });
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [room]);

  // naya message aane par auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ==========================================
  // 3️⃣ SEND MESSAGE (Socket emit + DB backup save)
  // ==========================================
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newMsg = {
      _id: Date.now().toString(),
      room,
      sender: userId,
      message: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");

    // real-time deliver karne ke liye socket emit
    socketRef.current?.emit("send_message", newMsg);

    // DB mein permanently save karne ke liye REST backup call
    try {
      await API.post("/api/chat/save", {
        room,
        sender: userId,
        message: newMsg.message,
      });
    } catch (err) {
      console.error("Message save error:", err);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const filtered = dummyConversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cp-page">
      <div className="cp-layout">
        {/* SIDEBAR */}
        <aside className="cp-sidebar">
          <div className="cp-sidebar-header">
            <p>Messages</p>
            <span>{dummyConversations.length} conversations</span>
          </div>
          <div className="cp-search">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="cp-convo-list">
            {filtered.map((c) => (
              <div
                key={c.id}
                className={`cp-convo-item ${
                  c.id === activeConvo.id ? "active" : ""
                }`}
                onClick={() => {
                  setActiveConvo(c);
                  setMessages([]);
                  navigate(`/chat/${c.vendorId}`);
                }}
              >
                <div className={`cp-avatar cp-avatar-${c.type}`}>
                  <span className="material-symbols-outlined">{c.icon}</span>
                  {c.online && <div className="cp-online-dot"></div>}
                </div>
                <div className="cp-convo-info">
                  <div className="cp-convo-name">{c.name}</div>
                  <div className="cp-convo-preview">{c.preview}</div>
                </div>
                <div className="cp-convo-meta">
                  <span className="cp-convo-time">{c.time}</span>
                  {c.unread > 0 && (
                    <div className="cp-unread-badge">{c.unread}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN CHAT */}
        <main className="cp-chat-main">
          {/* CHAT HEADER */}
          <div className="cp-chat-header">
            <div className={`cp-avatar cp-avatar-${activeConvo.type}`}>
              <span className="material-symbols-outlined">
                {activeConvo.icon}
              </span>
              {activeConvo.online && <div className="cp-online-dot"></div>}
            </div>
            <div className="cp-chat-header-info">
              <p>
                {activeConvo.name}
                {activeConvo.verified && (
                  <span className="cp-verified-badge">Verified Pro</span>
                )}
              </p>
              <span className={activeConvo.online ? "cp-online" : "cp-offline"}>
                {activeConvo.online ? "Online" : "Offline"}
              </span>
            </div>
            <div className="cp-chat-header-actions">
              <span className="material-symbols-outlined">call</span>
              <span className="material-symbols-outlined">more_vert</span>
            </div>
          </div>

          {/* VENDOR STRIP */}
          <div className="cp-vendor-strip">
            <span className="material-symbols-outlined">location_on</span>
            <span>
              {activeConvo.name} · {activeConvo.location} ·{" "}
              {activeConvo.price} starting
            </span>
            <button
              className="cp-strip-book"
              onClick={() => navigate(`/vendors/${activeConvo.vendorId}`)}
            >
              Book Now
            </button>
          </div>

          {/* MESSAGES */}
          <div className="cp-messages">
            <div className="cp-date-divider">
              <span>Today</span>
            </div>

            {loading && (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#9ca3af",
                }}
              >
                Loading messages...
              </div>
            )}

            {messages.map((msg) => {
              const isMe = msg.sender === userId || msg.sender?._id === userId;
              return (
                <div key={msg._id} className={`cp-msg-row ${isMe ? "mine" : ""}`}>
                  <div
                    className={`cp-msg-av ${
                      isMe ? "me" : `cp-avatar-${activeConvo.type}`
                    }`}
                  >
                    <span className="material-symbols-outlined">
                      {isMe ? "person" : activeConvo.icon}
                    </span>
                  </div>
                  <div className={`cp-msg-col ${isMe ? "mine" : ""}`}>
                    <div className={`cp-bubble ${isMe ? "mine" : "vendor"}`}>
                      {msg.message}
                    </div>
                    <div className="cp-msg-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="cp-input-area">
            <div className="cp-attach">
              <span className="material-symbols-outlined">attach_file</span>
            </div>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="cp-send-btn" onClick={sendMessage}>
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
