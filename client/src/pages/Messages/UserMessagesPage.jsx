import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { messagesAPI } from '../../services/api';
import { FiMessageCircle, FiUser, FiChevronRight } from 'react-icons/fi';
import UserLayout from '../../components/layout/UserLayout';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const formatTime = (date) => {
  const msgDate = new Date(date);
  const today = new Date();
  const diff = today - msgDate;
  if (diff < 86400000 && today.getDate() === msgDate.getDate()) {
    return msgDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  if (diff < 172800000 && today.getDate() - msgDate.getDate() === 1) return 'Yesterday';
  return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const UserMessagesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await messagesAPI.getConversations();
        const convs = data.conversations || data.data || data;
        setConversations(Array.isArray(convs) ? convs : []);
      } catch {
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const getOtherUser = (conv) => {
    return conv.participants?.find((p) => p._id !== user._id) || conv.otherUser || null;
  };

  const getLastMessage = (conv) => {
    return conv.lastMessage?.text || (conv.lastMessage?.images?.length > 0 ? 'Image' : '') || 'No messages yet';
  };

  if (loading) return <UserLayout><Loader text="Loading conversations..." /></UserLayout>;

  return (
    <UserLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-charcoal mb-6">Messages</h1>

        {conversations.length === 0 ? (
          <EmptyState
            icon={FiMessageCircle}
            title="No conversations yet"
            message="When you connect with other users, your messages will appear here."
          />
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => {
              const other = getOtherUser(conv);
              const isUnread = conv.unreadCount > 0;
              return (
                <button
                  key={conv._id}
                  onClick={() => navigate(`/chat?user=${other?._id}`)}
                  className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-border hover:shadow-sm transition-shadow text-left cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    {other?.avatar ? (
                      <img src={other.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {other?.name?.charAt(0) || <FiUser size={20} />}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-sm truncate ${isUnread ? 'font-bold text-charcoal' : 'font-semibold text-charcoal'}`}>
                        {other?.name || 'Unknown User'}
                      </h3>
                      {conv.lastMessage && (
                        <span className="text-xs text-charcoal-light flex-shrink-0">
                          {formatTime(conv.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm truncate mt-0.5 ${isUnread ? 'font-semibold text-charcoal' : 'text-charcoal-light'}`}>
                      {getLastMessage(conv)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isUnread && (
                      <span className="bg-accent text-primary text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                      </span>
                    )}
                    <FiChevronRight size={18} className="text-charcoal-light" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserMessagesPage;
