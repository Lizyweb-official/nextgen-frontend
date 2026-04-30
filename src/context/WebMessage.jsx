import { createContext, useContext, useState, useEffect } from "react";
import { setShowMessage } from "./webMessageHandler";

const WebMessageContext = createContext();

export const WebMessageProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const showWebMessage = (msg) => {
    setMessage(msg);
    setVisible(true);

    setTimeout(() => {
      setVisible(false);
    }, 3000);
  };

  // 🔥 Register global function
  useEffect(() => {
    setShowMessage(showWebMessage);
  }, []);

  return (
    <WebMessageContext.Provider value={{ showWebMessage }}>
      {children}

      {visible && (
        <div style={styles.toast}>
          {message}
        </div>
      )}
    </WebMessageContext.Provider>
  );
};

export const useWebMessage = () => useContext(WebMessageContext);

// 🎨 Styling
const styles = {
  toast: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#ff0000",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "8px",
    zIndex: 9999,
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    fontSize: "14px",
  },
};