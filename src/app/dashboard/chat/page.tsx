'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, FileText, Download, MessageCircle, Loader2, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatService, type ChatMessage } from '@/lib/ChatService';
import { useLocale } from '@/lib/i18n';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useLocale();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Load conversation history on mount
  useEffect(() => {
    ChatService.getHistory(30).then((history) => {
      if (history.length > 0) {
        setMessages(history);
      }
    }).catch(console.error);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSend = async () => {
    if ((!input.trim() && !file) || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: file ? `📎 ${file.name}\n\n${input}` : input,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError(null);
    setIsLoading(true);

    const currentFile = file;
    setFile(null);

    try {
      const response = await ChatService.sendMessage(
        userMessage.content,
        currentFile || undefined
      );

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.data.response,
        created_at: new Date().toISOString(),
        files: response.data.files,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || t('chatPage.errorSend'));
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const valid = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown'];
      if (!valid.includes(f.type) && !f.name.endsWith('.md')) {
        setError('Formato não suportado. Envie PDF, DOCX, TXT ou MD.');
        return;
      }
      if (f.size > 1 * 1024 * 1024) {
        setError('Arquivo excede 1MB.');
        return;
      }
      setFile(f);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) {
      const fakeEvent = { target: { files: [f] } } as any;
      handleFileSelect(fakeEvent);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setFile(null);
    setError(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30">
            <MessageCircle className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{t('chatPage.title')}</h1>
            <p className="text-xs text-slate-500">Telegram · WhatsApp · Dashboard</p>
          </div>
        </div>
        <button
          onClick={handleNewChat}
          className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-all"
        >
          {t('chatPage.newChat')}
        </button>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">{t('chatPage.noMessages')}</h2>
            <p className="text-sm text-slate-400 max-w-md">{t('chatPage.noMessagesDesc')}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-start shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-indigo-400" />
                  </div>
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600/20 border border-indigo-500/20 text-white'
                    : 'bg-slate-800/60 border border-slate-700/50 text-slate-200'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-300 prose-headings:text-white prose-a:text-indigo-400 prose-strong:text-white prose-code:text-indigo-300 prose-table:w-full prose-th:bg-slate-800/50 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-xs prose-th:font-semibold prose-td:border-t prose-td:border-slate-800 prose-td:px-3 prose-td:py-2 prose-td:text-xs">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}

                {/* Downloadable files */}
                {msg.files && msg.files.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-slate-700/50 pt-3">
                    {msg.files.map((f, i) => (
                      <button
                        key={i}
                        onClick={() => ChatService.downloadFile(f)}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-indigo-500/40 transition-all text-left group"
                      >
                        <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-xs text-slate-300 truncate flex-1">{f.filename}</span>
                        <Download className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="flex items-start shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex items-start shrink-0 mt-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="text-sm text-slate-400">{t('chatPage.typing')}</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mx-auto max-w-md px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center">
            ⚠️ {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-800 px-4 py-3 shrink-0">
        {/* File badge */}
        {file && (
          <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg bg-indigo-600/10 border border-indigo-500/20">
            <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs text-indigo-300 truncate flex-1">{file.name}</span>
            <span className="text-[10px] text-slate-500">{(file.size / 1024).toFixed(0)}KB</span>
            <button onClick={() => setFile(null)} className="shrink-0 text-slate-500 hover:text-red-400 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* Attach button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 p-2.5 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-all"
            title={t('chatPage.attachFile')}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx,.txt,.md"
            onChange={handleFileSelect}
          />

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chatPage.placeholder')}
              rows={1}
              className="w-full resize-none rounded-xl bg-slate-800/60 border border-slate-700 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 outline-none transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !file)}
            className={`shrink-0 p-2.5 rounded-xl transition-all ${
              isLoading || (!input.trim() && !file)
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-95'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        <p className="text-[10px] text-slate-600 text-center mt-2">
          Shift+Enter para nova linha · PDF, DOCX, TXT, MD
        </p>
      </div>
    </div>
  );
}
