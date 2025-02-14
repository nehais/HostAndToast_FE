import { useContext, useState } from "react";
import { MessageContext } from "../contexts/message.context";
import { AuthContext } from "../contexts/auth.context";

const MessagesInput = () => {
  const [text, setText] = useState("");
  const { sendMessage, selectedUser } = useContext(MessageContext);
  const { user } = useContext(AuthContext);

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;
    try {
      sendMessage({ text, senderId: user._id, receiverId: selectedUser._id });
      setText("");
    } catch (error) {
      console.log("Error sending message", error);
    }
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
