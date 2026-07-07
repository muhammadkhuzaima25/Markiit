import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { messagesAPI, usersAPI } from '../../services/api';
import { FiSend, FiArrowLeft, FiPaperclip, FiUser, FiCheck, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const formatDate = (date) => {
  const msgDate = new Date(date);
  const today = new Date();
  const diff = today - msgDate;
  if (diff < 86400000 && today.getDate() === msgDate.getDate()) return 'Today';
  if (diff < 172800000 && today.getDate() - msgDate.getDate() === 1) return 'Yesterday';
  return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: msgDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const ChatPage = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get('user');

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [roomId, setRoomId] = useState('');

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId) { navigate('/messages'); return; }

    const rId = [user._id, userId].sort().join('_');
    setRoomId(rId);

    const fetchData = async () => {
      try {
        setLoading(true);
        const [msgRes, userRes] = await Promise.all([
          messagesAPI.getMessages(rId),
          usersAPI.getProfile(userId),
        ]);
        setMessages(Array.isArray(msgRes.data) ? msgRes.data : []);
        const u = userRes.data?.user || userRes.data?.data || userRes.data;
        setOtherUser({ _id: u._id || userId, name: u.name || 'User', avatar: u.avatar || null });
      } catch {
        setOtherUser({ _id: userId, name: 'User', avatar: null });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (!socket || !roomId) return;

    const handleNewMessage = (msg) => {
      if (msg.roomId === roomId || msg.sender?._id === userId || msg.sender === userId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, roomId, userId]);

  const handleFileSelect = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!text.trim() && files.length === 0) return;
    setSending(true);
    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('receiver', userId);
      files.forEach((file) => formData.append('images', file));
      const { data } = await messagesAPI.send(formData);
      setMessages((prev) => [...prev, data]);
      setText('');
      setFiles([]);
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) return <Loader text="Loading conversation..." />;

  if (!otherUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-charcoal-light">Conversation not found</p>
      </div>
    );
  }

  const groupedMessages = messages.reduce((groups, msg) => {
    const key = new Date(msg.createdAt).toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(msg);
    return groups;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 160px)' }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-white shrink-0">
          <button onClick={() => navigate('/messages')} className="p-1.5 rounded-lg hover:bg-neutral text-charcoal bg-transparent border-none cursor-pointer">
            <FiArrowLeft size={20} />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
            {otherUser.avatar ? (
              <img src={otherUser.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <FiUser size={18} className="text-primary" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-charcoal text-sm">{otherUser.name || 'User'}</h3>
            <p className="text-xs text-charcoal-light">Online</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1 bg-neutral/30">
          {Object.keys(groupedMessages).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                <FiUser size={28} className="text-primary/40" />
              </div>
              <p className="text-sm font-medium text-charcoal">No messages yet</p>
              <p className="text-xs text-charcoal-light mt-1">Send a message to start the conversation</p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([dateKey, msgs]) => (
              <div key={dateKey}>
                <div className="flex justify-center my-4">
                  <span className="text-[11px] text-charcoal-light bg-white px-3 py-1 rounded-full border border-border font-medium">
                    {formatDate(dateKey)}
                  </span>
                </div>
                {msgs.map((msg) => {
                  const isMine = msg.sender?._id === user._id || msg.sender === user._id;
                  return (
                    <div key={msg._id} className={`flex mb-3 ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${isMine ? 'order-1' : 'order-1'}`}>
                        <div className={`px-4 py-2.5 text-sm leading-relaxed ${
                          isMine
                            ? 'bg-accent text-primary rounded-t-2xl rounded-bl-2xl rounded-br-sm'
                            : 'bg-white border border-border text-charcoal rounded-t-2xl rounded-br-2xl rounded-bl-sm'
                        }`}>
                          {msg.text && <p className="whitespace-pre-wrap break-words">{msg.text}</p>}
                          {msg.images && msg.images.length > 0 && (
                            <div className={`flex flex-wrap gap-2 ${msg.text ? 'mt-2' : ''}`}>
                              {msg.images.map((img, i) => (
                                <img key={i} src={typeof img === 'string' ? img : img.url || img.path} alt="" className="max-w-[200px] max-h-[200px] rounded-lg object-cover" />
                              ))}
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center gap-1 mt-0.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-[10px] text-charcoal-light">{formatTime(msg.createdAt)}</span>
                          {isMine && (
                            <FiCheck size={10} className="text-charcoal-light" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* File previews */}
        {files.length > 0 && (
          <div className="bg-white border-t border-border px-5 py-2 flex gap-2 overflow-x-auto shrink-0">
            {files.map((file, i) => (
              <div key={i} className="relative shrink-0">
                <img src={URL.createObjectURL(file)} alt="" className="w-14 h-14 rounded-lg object-cover border border-border" />
                <button onClick={() => removeFile(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center border-none cursor-pointer hover:bg-red-600">x</button>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-3 border-t border-border bg-white shrink-0">
          <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-lg hover:bg-neutral text-charcoal-light bg-transparent border-none cursor-pointer shrink-0">
            <FiPaperclip size={20} />
          </button>
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type a message..." className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-accent bg-neutral/50" />
          <button onClick={handleSend} disabled={sending || (!text.trim() && files.length === 0)} className="p-2.5 rounded-lg bg-accent text-primary hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer transition-colors shrink-0">
            <FiSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
