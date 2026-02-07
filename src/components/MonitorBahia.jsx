import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

const MonitorBahia = () => {
  const [editais, setEditais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // --- SUAS CHAVES DO GOOGLE ---
  const API_KEY = "AIzaSyAMlieEho4VLyTOBBkfkgpIF1SKzIsq2hM"; 
  const CX = "3131081832f6441d2";

  // Backup Manual (Caso a cota do Google acabe ou dê erro)
  const backupEditais = [
    { 
      title: "Seleção SEC/BA 2026 (REDA)", 
      link: "http://educacao.ba.gov.br",
      snippet: "Processo seletivo para contratação de professores e técnicos. Inscrições abertas até 23/02/2026." 
    },
    { 
      title: "Edital Quilombos da Bahia - CAR", 
      link: "http://car.ba.gov.br",
      snippet: "Chamada pública para fomento produtivo em comunidades quilombolas. Prazo: 11/02/2026." 
    },
    { 
      title: "FazCultura 2026 - Fluxo Contínuo", 
      link: "http://cultura.ba.gov.br",
      snippet: "Programa estadual de incentivo ao patrocínio cultural. Aberto o ano todo." 
    }
  ];

  useEffect(() => {
    const buscarNoGoogle = async () => {
      try {
        // Busca: "editais abertos bahia 2026"
        // O parâmetro 'dateRestrict' ajuda a pegar coisas novas, mas o Google Custom Search as vezes é chato.
        // Vamos fazer uma busca ampla.
        const query = "edital inscrições abertas cultura educação bahia 2026";
        const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}&num=3`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          setEditais(data.items);
          setError(false);
        } else {
          // Se não achar nada, usa o backup
          console.log("Google não retornou resultados, usando backup.");
          setEditais(backupEditais);
        }
      } catch (err) {
        console.error("Erro na API do Google:", err);
        setError(true);
        setEditais(backupEditais); // Fallback para o backup em caso de erro
      } finally {
        setLoading(false);
      }
    };

    buscarNoGoogle();
  }, []);

  return (
    <div className="monitor-wrapper" style={{ width: '100%', marginTop: '30px' }}>
      
      {/* Cabeçalho do Monitor */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid rgba(0,0,0,0.1)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaSearch color="#C5A059" size={20} />
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1A3C28' }}>Radar Oficial</h3>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ 
            background: loading ? '#e0e0e0' : (error ? '#fef2f2' : '#dcfce7'), 
            color: loading ? '#888' : (error ? '#991b1b' : '#166534'),
            padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '600',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            {loading ? "Buscando..." : (error ? <><FaExclamationTriangle/> Modo Offline</> : "● Online (Google)")}
          </span>
        </div>
      </div>

      {/* Lista de Resultados */}
      <div className="editais-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#888', background: '#f9f9f9', borderRadius: '12px' }}>
             Consultando Diário Oficial...
          </div>
        ) : (
          editais.map((edital, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                transition: 'transform 0.2s',
              }}
              className="edital-item"
            >
              <div style={{ paddingRight: '20px', flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#1A3C28', fontSize: '1.05rem', fontFamily: 'Inter, sans-serif' }}>
                  {edital.title}
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>
                  {edital.snippet ? edital.snippet.replace(/\n/g, ' ').substring(0, 100) + "..." : "Detalhes disponíveis no site oficial."}
                </p>
              </div>
              
              <a 
                href={edital.link} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  background: 'transparent',
                  border: '1px solid #1A3C28',
                  color: '#1A3C28',
                  padding: '10px 18px',
                  borderRadius: '50px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.target.style.background = '#1A3C28'; e.target.style.color = '#fff'; }}
                onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#1A3C28'; }}
              >
                Acessar <FaExternalLinkAlt size={12} />
              </a>
            </motion.div>
          ))
        )}
      </div>
      
      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: '#999' }}>
        * Resultados obtidos automaticamente via Google Search API.
      </p>
    </div>
  );
};

export default MonitorBahia;