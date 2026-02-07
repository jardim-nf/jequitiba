import { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaTimes, FaComments, FaCircle } from 'react-icons/fa';

// Inicializa OpenAI
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, 
  dangerouslyAllowBrowser: true
});

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Olá! Sou a IA da Jequitibá Assessoria. Posso ajudar com dúvidas sobre Editais na Bahia, Lei Paulo Gustavo ou Gestão Escolar? 🌳' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Você é o Consultor Virtual da Jequitibá Assessoria. Seja profissional, direto e tente levar o usuário para o WhatsApp para fechar negócio.`
          },
          ...messages,
          userMessage
        ],
      });

      const botMessage = completion.choices[0].message;
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Erro OpenAI:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, minha conexão caiu. Por favor, nos chame no WhatsApp.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '100px', right: '30px', zIndex: 9999 }}>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              width: '350px',
              height: '500px',
              background: '#FDFBF7',
              borderRadius: '20px', // Mais arredondado
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', // Sombra mais elegante
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              marginBottom: '20px',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            {/* Header Premium */}
            <div style={{ 
              background: 'linear-gradient(135deg, var(--primary) 0%, #14291a 100%)', // Degradê verde
              padding: '20px', 
              color: 'white', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ background: 'white', padding: '10px', borderRadius: '50%', color: 'var(--primary)', display: 'flex' }}>
                    <FaRobot size={20} />
                  </div>
                  {/* Bolinha verde de online */}
                  <div style={{ position: 'absolute', bottom: 0, right: 0, border: '2px solid var(--primary)', borderRadius: '50%', background: '#22c55e', width: '12px', height: '12px' }}></div>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', fontFamily: 'Playfair Display' }}>Jequitibá IA</h4>
                  <span style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: '300' }}>Consultor Especialista</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', borderRadius: '50%', display:'flex' }}>
                <FaTimes size={14} />
              </button>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', background: '#f8f9fa' }}>
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: msg.role === 'user' ? 'var(--primary)' : 'white',
                    color: msg.role === 'user' ? 'white' : '#333', // Texto branco no verde fica melhor
                    padding: '14px 18px',
                    borderRadius: '18px',
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
                    borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '18px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                  }}
                >
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: 'flex-start', background: 'white', padding: '15px', borderRadius: '18px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                   <div style={{ display: 'flex', gap: '4px' }}>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ width: '6px', height: '6px', background: '#aaa', borderRadius: '50%' }} />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} style={{ width: '6px', height: '6px', background: '#aaa', borderRadius: '50%' }} />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} style={{ width: '6px', height: '6px', background: '#aaa', borderRadius: '50%' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '15px', background: 'white', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: '#fff', 
                borderRadius: '50px', 
                padding: '6px 6px 6px 20px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Digite aqui..."
                  style={{ 
                    flex: 1, 
                    border: 'none', 
                    background: 'transparent', 
                    outline: 'none', 
                    fontSize: '0.95rem',
                    color: '#333'
                  }}
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  style={{ 
                    background: 'var(--primary)', 
                    color: 'white', 
                    border: 'none', 
                    width: '42px', 
                    height: '42px', 
                    borderRadius: '50%', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    transition: 'all 0.2s',
                    opacity: loading || !input.trim() ? 0.5 : 1,
                    transform: loading || !input.trim() ? 'scale(0.9)' : 'scale(1)'
                  }}
                >
                  <FaPaperPlane size={16} style={{ marginLeft: '-2px' }} /> {/* Ajuste visual */}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- BOTÃO FLUTUANTE (TRIGGER) MELHORADO --- */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '65px',
          height: '65px',
          borderRadius: '50%',
          // Fundo Verde Sólido (Hardcoded para garantir)
          background: '#2F5233', 
          // Ícone Branco (Melhor contraste)
          color: '#ffffff', 
          border: '3px solid #ffffff', // Borda branca para destacar do site
          boxShadow: '0 8px 24px rgba(47, 82, 51, 0.4)', // Sombra colorida
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          bottom: 0,
          right: 0,
          zIndex: 9999
        }}
      >
        {/* Ícone condicional */}
        {isOpen ? (
          <FaTimes size={24} />
        ) : (
          <FaComments size={30} />
        )}
        
        {/* Bolinha de notificação (Pulsando) */}
        {!isOpen && (
          <span style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '18px',
            height: '18px',
            background: '#ef4444', // Vermelho
            borderRadius: '50%',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ 
              width: '100%', height: '100%', borderRadius: '50%', 
              background: 'inherit', animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite', 
              opacity: 0.75, position: 'absolute' 
            }}></span>
            <span style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%' }}></span>
          </span>
        )}
      </motion.button>
      
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;