'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Loader, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function MessagesTerminal() {
  const supabase = createClient();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      toast.error('Failed to load messages');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: !currentRead })
        .eq('id', id);

      if (error) throw error;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, read: !currentRead } : msg
        )
      );
    } catch (error) {
      toast.error('Failed to update message');
      console.error(error);
    }
  };

  const deleteMessage = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
      console.error(error);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 font-mono text-sm overflow-hidden">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No messages yet.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => {
              const isUnread = !msg.read;
              const timestamp = new Date(msg.created_at).toLocaleString();
              const textColor = isUnread ? 'text-green-400' : 'text-green-600';

              return (
                <motion.div
                  key={msg.id}
                  className={`border-l-4 ${
                    isUnread ? 'border-green-400' : 'border-green-600'
                  } pl-4 py-3 ${
                    idx > 0 ? 'border-t border-gray-800 pt-4' : ''
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className={`${textColor} text-xs mb-2`}>
                    <span className="opacity-60">[</span>
                    {timestamp}
                    <span className="opacity-60">]</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <span className={`${textColor} font-bold`}>FROM:</span>
                      <span className={`${textColor} ml-2`}>{msg.name}</span>
                      <span className={`${textColor} opacity-60 text-xs ml-2`}>
                        &lt;{msg.email}&gt;
                      </span>
                    </div>

                    <div>
                      <span className={`${textColor} font-bold`}>SUBJECT:</span>
                      <span className={`${textColor} ml-2`}>{msg.subject}</span>
                    </div>
                  </div>

                  <div className={`${textColor} bg-black/30 p-2 rounded mb-3 whitespace-pre-wrap break-words text-xs`}>
                    {msg.message}
                  </div>

                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={() => toggleRead(msg.id, isUnread)}
                      className={`text-xs px-3 py-1 rounded border transition-colors ${
                        isUnread
                          ? 'border-green-400 text-green-400 hover:bg-green-400/10'
                          : 'border-green-600 text-green-600 hover:bg-green-600/10'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {isUnread ? 'Mark as Read' : 'Mark as Unread'}
                    </motion.button>

                    <motion.button
                      onClick={() => deleteMessage(msg.id)}
                      disabled={deleting === msg.id}
                      className="text-xs px-3 py-1 border border-red-500/50 text-red-500 rounded hover:bg-red-500/10 transition-colors disabled:opacity-50 flex items-center gap-1"
                      whileHover={{ scale: 1.05 }}
                    >
                      {deleting === msg.id ? (
                        <Loader className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
