import { useNotifications } from "./NotificationContext";

function NotificationItem({ notification, closeDropdown }) {
  const { markAsRead } = useNotifications();

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    closeDropdown();
  };

  return (
    <div
      onClick={handleClick}
      style={{
        padding: "10px",
        marginBottom: "6px",
        borderRadius: "6px",
        borderBottom: "1px solid #f0f0f0",
        background: notification.isRead ? "#fff" : "#eef6ff",
        cursor: "pointer",
      }}
    >
      <strong style={{ fontSize: "13px", color: "#333", display: "block" }}>
        {notification.title || "Notification"}
      </strong>
      <p style={{ margin: "2px 0 4px 0", fontSize: "12px", color: "#555" }}>
        {notification.message}
      </p>
      <span style={{ fontSize: "10px", color: "#999" }}>
        {new Date(notification.createdAt).toLocaleString()}
      </span>
    </div>
  );
}

export default NotificationItem;