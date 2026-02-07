import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Verifica se já aceitou antes
    const consent = localStorage.getItem('jequitiba_cookie_consent');
    if (!consent) {
      // Espera 2 segundos para aparecer (para não assustar de cara)
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('jequitiba_cookie_consent', 'true');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            right: '20px', // No mobile fica esticado, no desktop limitamos a largura
            maxWidth: '500px',
            background: '#1A3C28', // Verde escuro da marca
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            zIndex: 9990, // Abaixo do Chatbot
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
            <strong>🍪 Respeitamos sua privacidade.</strong>
            <br />
            Utilizamos cookies para melhorar a experiência de navegação e analisar o tráfego do site. Ao continuar, você concorda com nossa política.
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => setShow(false)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Recusar
            </button>
            <button 
              onClick={handleAccept}
              style={{
                background: 'var(--accent)', // Dourado
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 'bold',
                padding: '8px 24px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Aceitar e Continuar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;