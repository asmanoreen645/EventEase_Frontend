import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./ChatPage.css";
import API from "./api/axiosConfig";

// 📦 React Icons 
import {
  MdCameraAlt,
  MdRestaurant,
  MdDeck,
  MdStorefront,
  MdSearch,
  MdCall,
  MdMoreVert,
  MdLocationOn,
  MdAttachFile,
  MdSend,
  MdPerson,
} from "react-icons/md";

// 🔧 Correct Backend base URL
const SOCKET_URL = "https://eventease-backend-1-ptzp.onrender.com";

// Helper Function: Category ke according icon render karne ke liye
const getCategoryIcon = (type) => {
  switch (type) {
    case "photo":
      return <MdCameraAlt size={22} />;
    case "cat":
      return <MdRestaurant size={22} />;
    case "dec":
      return <MdDeck size={22} />;
    default:
      return <MdStorefront size={22} />;
  }
};

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
  const [historyError, setHistoryError] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ==========================================
  // 0️⃣ LOGIN CHECK
  // ==========================================
  useEffect(() => {
    if (!userId || !token) {
      navigate("/login");
    }
  }, [userId, token, navigate]);

  // ==========================================
  // 1️⃣ FETCH REAL VENDORS ONLY
  // ==========================================
  useEffect(() => {
    const fetchVendors = async () => {
      setLoadingVendors(true);
      try {
        const res = await API.get("/vendors/search");
        const vendorList = res.data.vendors || res.data.data || res.data;

        if (!Array.isArray(vendorList) || vendorList.length === 0) {
          setConversations([]);
          setLoadingVendors(false);
          return;
        }

        const formatted = vendorList.map((v) => {
          const vName = v.businessName || "Unnamed Vendor";
          const autoAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            vName
          )}&background=random&color=fff`;

          return {
            id: v._id,
            vendorId: v._id,
            name: vName,
            avatar: v.profileImage || v.coverImage || autoAvatar,
            type: (v.category || "").toLowerCase().includes("photo")
              ? "photo"
              : (v.category || "").toLowerCase().includes("cater")
              ? "cat"
              : (v.category || "").toLowerCase().includes("decor")
              ? "dec"
              : "other",
            location: v.location?.city || "N/A",
            price: "Contact for price",
            verified: v.isVerified === true,
            online: false,
          };
        });

        setConversations(formatted);

        // Target select karna URL ke mutabiq
        const target =
          formatted.find((c) => c.vendorId === vendorId) || formatted[0];

        if (target) {
          setActiveConvo(target);
          if (!vendorId || vendorId === "undefined") {
            navigate(`/chat/${target.vendorId}`, { replace: true });
          }
        }
      } catch (err) {
        console.error("Real vendors load hone mein masla aaya:", err.message);
        setConversations([]);
      } finally {
        setLoadingVendors(false);
      }
    };

    fetchVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!vendorId || conversations.length === 0) return;
    const match = conversations.find((c) => c.vendorId === vendorId);
    if (match) setActiveConvo(match);
  }, [vendorId, conversations]);

  // ✅ FIX 1: IDs ko sort kar ke room banate hain, taake customer ya vendor
  // kisi bhi taraf se chat khole, room-name hamesha same bane — aur ye
  // backend ke startConversation wale room-format se bhi consistent rahe.
  const room = activeConvo
    ? `room_${[userId, activeConvo.vendorId].sort().join("_")}`
    : null;

  // ==========================================
  // 2️⃣ FETCH CHAT HISTORY
  // ==========================================
  useEffect(() => {
    if (!room) return;
    const fetchMessages = async () => {
      setLoadingMessages(true);
      setHistoryError(false);
      try {
        const response = await API.get(`/chat/room/${room}`);
        if (response.data.success) {
          setMessages(response.data.messages);
        }
      } catch (err) {
        // ✅ FIX 2: Sirf "koi history nahi mili" (404) par welcome message
        // dikhayein. Baaki errors (network fail, 401, 500) par user ko
        // asal mein pata chalna chahiye ke kuch ghalat hua hai, warna
        // wo samajhega chat kaam kar rahi hai jab ke backend down hai.
        if (err.response?.status === 404) {
          setMessages([
            {
              _id: "welcome",
              sender: "vendor",
              message: `Assalam o Alaikum! Welcome to ${activeConvo?.name}. How can we help you?`,
              timestamp: new Date().toISOString(),
            },
          ]);
        } else {
          console.error("Chat history error:", err);
          setMessages([]);
          setHistoryError(true);
        }
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  // ==========================================
  // 3️⃣ SOCKET.IO CONNECTION
  // ==========================================
  useEffect(() => {
    if (!room || !userId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.emit("join_room", room);

    socket.on("receive_message", (data) => {
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ==========================================
  // 4️⃣ SEND MESSAGE
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

    socketRef.current?.emit("send_message", newMsg);

    try {
      await API.post("/chat/save", {
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

  if (loadingVendors) {
    return (
      <div className="cp-page" style={{ textAlign: "center", padding: "60px" }}>
        Loading real vendors...
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="cp-page" style={{ textAlign: "center", padding: "60px" }}>
        Koi active vendor available nahi hai chat ke liye.
      </div>
    );
  }

  if (!activeConvo) {
    return (
      <div className="cp-page" style={{ textAlign: "center", padding: "60px" }}>
        Koi vendor conversation selected nahi hai.
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
            <span>{conversations.length} real vendors</span>
          </div>

          <div
            className="cp-search"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <MdSearch size={20} color="#6b7280" />
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
                <div
                  className="cp-avatar"
                  style={{
                    position: "relative",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={c.avatar}
                    alt={c.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
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
          <div className="cp-chat-header">
            <div
              className="cp-avatar"
              style={{
                position: "relative",
                width: 42,
                height: 42,
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <img
                src={activeConvo.avatar}
                alt={activeConvo.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {activeConvo.online && <div className="cp-online-dot"></div>}
            </div>

            <div className="cp-chat-header-info">
              <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {activeConvo.name}
                {activeConvo.verified && (
                  <span className="cp-verified-badge">Verified Pro</span>
                )}
              </p>
              <span className={activeConvo.online ? "cp-online" : "cp-offline"}>
                {activeConvo.online ? "Online" : "Offline"}
              </span>
            </div>

            <div
              className="cp-chat-header-actions"
              style={{ display: "flex", gap: "12px", cursor: "pointer" }}
            >
              <MdCall size={22} color="#4b5563" />
              <MdMoreVert size={22} color="#4b5563" />
            </div>
          </div>

          <div
            className="cp-vendor-strip"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <MdLocationOn size={18} color="#6b7280" />
            <span>
              {activeConvo.name} · {activeConvo.location} · {activeConvo.price}
            </span>
            <button
              className="cp-strip-book"
              onClick={() => navigate(`/vendors/${activeConvo.vendorId}`)}
            >
              Book Now
            </button>
          </div>

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

            {historyError && !loadingMessages && (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#dc2626",
                }}
              >
                Messages load nahi ho sake. Please refresh karein.
              </div>
            )}

            {messages.map((msg) => {
              const isMe = msg.sender === userId || msg.sender?._id === userId;
              return (
                <div
                  key={msg._id}
                  className={`cp-msg-row ${isMe ? "mine" : ""}`}
                >
                  <div className={`cp-msg-av ${isMe ? "me" : ""}`}>
                    {isMe ? (
                      <MdPerson size={20} color="#fff" />
                    ) : (
                      getCategoryIcon(activeConvo.type)
                    )}
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

          <div className="cp-input-area">
            <div
              className="cp-attach"
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <MdAttachFile size={22} color="#6b7280" />
            </div>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              className="cp-send-btn"
              onClick={sendMessage}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MdSend size={18} color="#fff" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}