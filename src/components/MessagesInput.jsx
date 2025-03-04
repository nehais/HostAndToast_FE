import { useContext, useState } from "react";
import { MessageContext } from "../contexts/message.context";
import { AuthContext } from "../contexts/auth.context";

const MessagesInput = () => {
  const [text, setText] = useState("");
  const { sendMessage, selectedUser } = useContext(MessageContext);
  const { user, socket } = useContext(AuthContext);

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;

    if (!socket || !socket.connected) {
      console.error("Socket is not connected yet.");
      return;
    }

    const message = {
      text,
      senderId: user._id,
      receiverId: selectedUser._id,
    };

    console.log("Emitting message:", message);
    socket.emit("sendMessage", message); // Emit message only if socket is connected
    setText(""); // Clear input
  };

  return (
    <div className="messages-input">
      <form onSubmit={handleSend}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};
export default MessagesInput;
