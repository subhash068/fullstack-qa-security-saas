'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { MessageSquare, Send, Plus, Bot, User as UserIcon } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/chat/sessions');
      setSessions(res.data);
      if (res.data.length > 0 && !selectedSession) {
        setSelectedSession(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (sessionId: string) => {
    try {
      const res = await api.get(`/chat/sessions/${sessionId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      fetchMessages(selectedSession.id);
    }
  }, [selectedSession]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const res = await api.post(`/chat/sessions?title=${encodeURIComponent(newTitle)}`);
      setSessions([res.data, ...sessions]);
      setSelectedSession(res.data);
      setNewTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedSession) return;

    const text = inputMessage;
    setInputMessage('');

    // Append user message optimistically
    const mockUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      content: text,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, mockUserMsg]);

    try {
      const res = await api.post(`/chat/sessions/${selectedSession.id}/messages`, {
        content: text
      });
      setMessages(prev => [...prev.filter(m => !m.id.startsWith('temp-')), res.data]);
      fetchSessions();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <p className="text-slate-500 font-medium">Loading conversation history...</p>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-slate-50 dark:bg-slate-950 flex h-[calc(100vh-4rem)]">
      {/* Sidebar for chat sessions */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col p-4 space-y-4">
        <form onSubmit={handleCreateSession} className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New chat topic..."
            className="flex-grow rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-850 px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </form>

        <div className="flex-grow overflow-y-auto space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Previous Chats</span>
          {sessions.length === 0 ? (
            <p className="text-xs text-slate-500">No chats started yet.</p>
          ) : (
            sessions.map((sess) => (
              <button
                key={sess.id}
                onClick={() => setSelectedSession(sess)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                  selectedSession?.id === sess.id
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{sess.title}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main chat window */}
      <div className="flex-grow flex flex-col bg-slate-50 dark:bg-slate-950">
        {selectedSession ? (
          <>
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4">
              <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="h-5 w-5 text-indigo-500" />
                {selectedSession.title}
              </h2>
            </div>

            {/* Message Area */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-855 text-slate-700 dark:text-slate-200'
                  }`}>
                    {msg.sender === 'user' ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`p-4 rounded-xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about OWASP SQLi defenses, XSS mitigation, or secure configurations..."
                className="flex-grow rounded-lg border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
            <MessageSquare className="h-12 w-12 text-slate-300 mb-2" />
            <p className="text-slate-500 text-sm">Please select a topic or create a new conversation thread on the sidebar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
