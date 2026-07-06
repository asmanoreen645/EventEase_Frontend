import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./ChatPage.css";
import API from "./api/axiosConfig";

// 🔧 Backend base URL - socket connection isi se banegi
const SOCKET_URL = "https://eventease-backend-693s.onrender.com";

// ==========================================
// 🎭 DUMMY FALLBACK DATA
// Jab tak real /api/vendors route backend pe live nahi hota,
// ye data show hoga taake UI test/demo ho sake.
// ==========================================
const dummyConversations = [
  {
    id: 1,
    vendorId: "vendor1",
    name: "Moon Photography",
    type: "photo",
    icon: "photo_camera",
    location: "Lahore",
    price: "PKR 10,000",
    verified: true,
    online: true,
  },
  {
    id: 2,
    vendorId: "vendor2",
    name: "Hanif Rajput Decor",
    type: "dec",
    icon: "yard",
    location: "Karachi",
    price: "PKR 10,000",
    verified: true,
    online: false,
  },
  {
    id: 3,
    vendorId: "vendor3",
    name: "Zaiqa Catering",
    type: "cat",
    icon: "restaurant",
    location: "Lahore",
    price: "PKR 5,000",
    verified: false,
    online: true,
  },
];

export default function ChatPage() {
  const { vendorId } = useParams();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [usingDummy, setUsingDummy] = useState(false); // 🔧 real vs dummy track karne ke liye
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ==========================================
  // 0️⃣ LOGIN CHECK — bina login koi is page tak na pohanche
  // ==========================================
  useEffect(() => {
    if (!userId || !token) {
      navigate("/login");
    }
  }, [userId, token, navigate]);

  // ==========================================
  // 1️⃣ FETCH VENDORS — real API try karo, fail ho tw dummy pe fallback
  // ==========================================
  useEffect(() => {
    const fetchVendors = async () => {
      setLoadingVendors(true);
      try {
        // Backend route: GET /api/vendors (getAllVendors)
       const res = await API.get("/api/vendors/search");
        const vendorList = res.data.vendors || res.data.data || res.data;

        if (!Array.isArray(vendorList) || vendorList.length === 0) {
          throw new Error("Empty or invalid vendor list");
        }

        // Real vendor data ko sidebar ke structure mein map karen
        // ⚠️ Field names apne VendorProfile schema ke mutabiq check/adjust karen
        const formatted = vendorList.map((v) => ({
  id: v._id,
  vendorId: v._id,
  name: v.businessName || "Unnamed Vendor",
  type: (v.category || "").toLowerCase().includes("photo")
    ? "photo"
    : (v.category || "").toLowerCase().includes("cater")
    ? "cat"
    : (v.category || "").toLowerCase().includes("decor")
    ? "dec"
    : "other",
  icon: (v.category || "").toLowerCase().includes("photo")
    ? "photo_camera"
    : (v.category || "").toLowerCase().includes("cater")
    ? "restaurant"
    : (v.category || "").toLowerCase().includes("decor")
    ? "yard"
    : "storefront",
  location: v.location?.city || "N/A",
  price: "Contact for price",
  verified: v.isVerified === true,
  online: false,
}));

        setConversations(formatted);
        setUsingDummy(false);

        const target =
          formatted.find((c) => c.vendorId === vendorId) || formatted[0];

        if (target) {
          setActiveConvo(target);
          if (!vendorId || vendorId === "undefined") {
            navigate(`/chat/${target.vendorId}`, { replace: true });
          }
        }
      } catch (err) {
        // 🔧 Real backend abhi ready/live nahi — dummy data pe fallback
        console.warn(
          "Real vendors load nahi hue, dummy data use ho raha hai:",
          err.message
        );

        setConversations(dummyConversations);
        setUsingDummy(true);

        const target =
          dummyConversations.find((c) => c.vendorId === vendorId) ||
          dummyConversations[0];

        setActiveConvo(target);
        if (!vendorId || vendorId === "undefined") {
          navigate(`/chat/${target.vendorId}`, { replace: true });
        }
      } finally {
        setLoadingVendors(false);
      }
    };

    fetchVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // sirf ek dafa mount pe chalega

  // Jab URL ka vendorId change ho (dusre vendor pe click), activeConvo update karen
  useEffect(() => {
    if (!vendorId || conversations.length === 0) return;
    const match = conversations.find((c) => c.vendorId === vendorId);
    if (match) setActiveConvo(match);
  }, [vendorId, conversations]);

  const room = activeConvo ? `${userId}_${activeConvo.vendorId}` : null;

  // ==========================================
  // 2️⃣ FETCH CHAT HISTORY
  // ==========================================
  useEffect(() => {
    if (!room) return;
    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        // Backend route: GET /api/chat/room/:room
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
            message: `Assalam o Alaikum! Welcome to ${activeConvo?.name}. How can we help you?`,
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  // ==========================================
  // 3️⃣ SOCKET.IO CONNECTION (real-time messaging)
  // ==========================================
  useEffect(() => {
    if (!room || !userId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.emit("join_room", room);

    socket.on("receive_message", (data) => {
      // apna hi bheja hua message dobara add na ho, isliye check
      setMessages((prev) => {
        const alreadyExists = prev.some((m) => m._id === data._id);
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
  }, [room, userId]);

  // naya message aane par auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ==========================================
  // 4️⃣ SEND MESSAGE (Socket emit + DB backup save)
  // ==========================================
  const sendMessage = async () => {
    if (!inputText.trim() || !room) return;

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

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Vendors load hone tak loading state
  if (loadingVendors) {
    return (
      <div className="cp-page" style={{ textAlign: "center", padding: "60px" }}>
        Loading conversations...
      </div>
    );
  }

  if (!activeConvo) {
    return (
      <div className="cp-page" style={{ textAlign: "center", padding: "60px" }}>
        Koi vendor conversation available nahi hai.
      </div>
    );
  }

  return (
    <div className="cp-page">
      <div className="cp-layout">
        {/* SIDEBAR */}
        <aside className="cp-sidebar">
          <div className="cp-sidebar-header">
            <p>Messages</p>
            <span>
              {conversations.length} conversations
              {usingDummy && " (Demo data)"}
            </span>
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
                  <div className="cp-convo-preview">{c.location}</div>
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
              {activeConvo.price}
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

            {loadingMessages && (
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