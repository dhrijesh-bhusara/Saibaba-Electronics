import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, SendHorizonal, Sparkles, X, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchAiAssistantReply } from '../services/aiChatService';
import './AiAssistant.css';

const starterPrompts = [
  '🔥 Trending Smart TVs',
  '📱 Budget 5G Phones',
  '💳 EMI Options',
  '📍 Showroom Address',
];

const formatTime = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);

const AIMessage = ({ text, products = [] }) => {
  const productMatches = [...text.matchAll(/\[\[PRODUCT:([^\]]+)\]\]/g)].map((match) => match[1]);
  const resolvedProducts = products.length
    ? products
    : productMatches.map((slug) => ({
        id: slug,
        slug,
        title: slug.replace(/-/g, ' '),
        price: 0,
        image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      }));

  return (
    <div className="chat-message ai-message">
      <div className="message-bubble">
        <span className="message-role">Sai Baba AI</span>
        <p>{text}</p>
        {resolvedProducts.length > 0 && (
          <div className="product-cards">
            {resolvedProducts.map((product) => (
              <div className="mini-product-card" key={product.id || product.slug}>
                <img src={product.image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'} alt={product.title} />
                <div className="mini-product-copy">
                  <strong>{product.title}</strong>
                  <span>{product.price ? `₹${Number(product.price).toLocaleString('en-IN')}` : 'View details'}</span>
                </div>
                <Link to={`/product/${product.slug}`} className="mini-product-link">
                  View Product <ArrowUpRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const UserMessage = ({ text }) => (
  <div className="chat-message user-message">
    <div className="message-bubble">
      <p>{text}</p>
    </div>
  </div>
);

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Namaste! Main Sai Baba AI hoon. Aap smart TV, mobile, fridge, ya EMI options ke liye help kar sakta hoon. Aapke budget aur brand ke hisaab se best picks suggest karunga.',
      time: formatTime(new Date()),
      products: [],
    },
  ]);
  const bottomRef = useRef(null);
  const messageIdRef = useRef(0);

  const getMessageId = (role) => {
    messageIdRef.current += 1;
    return `${role}-${messageIdRef.current}`;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const askAssistant = async (promptText) => {
    const trimmed = promptText.trim();
    if (!trimmed) return;

    const userMessage = {
      id: getMessageId('user'),
      role: 'user',
      text: trimmed,
      time: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const history = [...messages, userMessage];

    try {
      const reply = await fetchAiAssistantReply(trimmed, history);
      const assistantMessage = {
        id: getMessageId('assistant'),
        role: 'assistant',
        text: reply.text,
        time: formatTime(new Date()),
        products: reply.products || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: getMessageId('assistant-error'),
          role: 'assistant',
          text: 'Mujhe abhi reply fetch karne mein problem hui. Aap budget aur category bata dijiye, main direct recommendation de deta hoon.',
          time: formatTime(new Date()),
          products: [],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    askAssistant(input);
  };

  const quickPromptText = useMemo(() => starterPrompts, []);

  return (
    <>
      <button type="button" className="ai-assistant-launcher" onClick={() => setOpen((prev) => !prev)} aria-label="Open AI assistant">
        <span className="pulse-ring" />
        <Bot size={22} />
      </button>

      {open && (
        <div className="ai-assistant-panel">
          <div className="ai-chat-header">
            <div className="ai-chat-title-wrap">
              <div className="ai-chat-icon">
                <Sparkles size={17} />
              </div>
              <div>
                <h3>Sai Baba AI Assistant</h3>
                <span className="status-pill">Online</span>
              </div>
            </div>
            <button type="button" className="close-chat" onClick={() => setOpen(false)} aria-label="Close assistant">
              <X size={18} />
            </button>
          </div>

          <div className="quick-prompts">
            {quickPromptText.map((prompt) => (
              <button key={prompt} type="button" className="quick-prompt" onClick={() => askAssistant(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <div className="chat-stream">
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'assistant' ? (
                  <AIMessage text={message.text} products={message.products || []} />
                ) : (
                  <UserMessage text={message.text} />
                )}
              </div>
            ))}

            {isTyping && (
              <div className="chat-message ai-message">
                <div className="message-bubble typing-bubble">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about TV, mobile, fridge, EMI..."
              aria-label="Ask chatbot"
            />
            <button type="submit" disabled={!input.trim()} aria-label="Send message">
              <SendHorizonal size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
