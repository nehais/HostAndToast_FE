import MessagesChatHeader from "./MessagesChatHeader";
import MessagesInput from "./MessagesInput";

const MessagesChatContainer = () => {
  return (
    <div className="messages-chat-container">
      <MessagesChatHeader />
      <p>messages...</p>
      <MessagesInput />
    </div>
  );
};
export default MessagesChatContainer;
