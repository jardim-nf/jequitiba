import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBullhorn, FaExternalLinkAlt, FaSpinner, FaTheaterMasks, FaGraduationCap, FaSyncAlt, FaFilter } from 'react-icons/fa';

const MonitorBahia = () => {
  const [editais, setEditais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchNoticias = () => {
    setLoading(true);
    setError(false);

    // 1. Busca ampla no site oficial (trazemos mais resultados para filtrar depois)
    const query = 'site:ba.gov.br (edital OR "inscrições abertas" OR seleção OR convocatória) when:30d';
    const GOOGLE_RSS = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
    const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(GOOGLE_RSS)}&api_key=0`; // api_key=0 tenta evitar cache

    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok' && data.items.length > 0) {
          
          // --- FILTRO PENTE FINO (JAVASCRIPT) ---
          
          // Palavras OBRIGATÓRIAS (Tem que ter pelo menos uma dessas)
          const whitelist = [
            'cultura', 'arte', 'educa', 'escol', 'professor', 'pedagog', 
            'paulo gustavo', 'aldir blanc', 'audiovisual', 'leitura', 
            'patrimônio', 'museu', 'teatro', 'dança', 'música', 'ensino'
          ];

          // Palavras PROIBIDAS (Se tiver, deleta na hora)
          const blacklist = [
            'polícia', 'militar', ' pm ', 'bombeiro', 'segurança pública', 
            'detran', 'cpa', 'armas', 'viatura', 'presídio', 'penal',
            'embasa', 'coelba', 'asfalto', 'pavimentação', 'drenagem', 
            'obra', 'engenharia', 'saúde', 'hospital', 'médico', 'enfermagem'
          ];

          const editaisFiltrados = data.items.filter(item => {
            const texto = (item.title + ' ' + item.description).toLowerCase();

            // 1. Checa se tem algo proibido
            const temProibido = blacklist.some(badWord => texto.includes(badWord));
            if (temProibido) return false;

            // 2. Checa se tem algo obrigatório (Educação ou Cultura)
            const temPermitido = whitelist.some(goodWord => texto.includes(goodWord));
            return temPermitido;
          }).map(item => {
            // Categoriza visualmente
            const texto = (item.title + ' ' + item.description).toLowerCase();
            let categoria = 'GERAL';
            if (texto.includes('cultura') || texto.includes('arte') || texto.includes('paulo gustavo') || texto.includes('aldir blanc')) {
              categoria = 'CULTURA';
            } else {
              categoria = 'EDUCAÇÃO';
            }

            return {
              ...item,
              title: item.title.split(' - ')[0], 
              categoria: categoria,
              link: item.link,
              pubDate: item.pubDate
            };
          });

          // Se depois de filtrar sobrar algo, atualiza o estado
          if (editaisFiltrados.length > 0) {
            setEditais(editaisFiltrados.slice(0, 6)); 
          } else {
            // Se o filtro removeu tudo (ex: só tinha edital de polícia hoje), lança erro para mostrar msg vazia
            throw new Error('Sem editais relevantes após filtro.');
          }

        } else {
          throw new Error('Nenhum dado retornado.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Filtro rigoroso aplicado ou erro de API:", err);
        setError(true); // Vai mostrar a tela de "Nenhum edital encontrado" ao invés de lixo
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemAnim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <section className="section-padding" style={{ background: '#f8f9fa', padding: '80px 0' }}>
      <div className="container">
        <motion.div 
          style={{ textAlign: 'center', marginBottom: '60px' }}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="overline" style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>MONITORAMENTO INTELIGENTE</span>
          <h2 className="section-title" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginTop: '10px' }}>
            Editais: Cultura & Educação
          </h2>
          <p style={{ color: '#666', maxWidth: '600px', margin: '20px auto' }}>
            Filtrados automaticamente. Você só vê o que importa para sua instituição.
          </p>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--primary)' }}>
            <FaSpinner className="icon-spin" style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '15px' }}>Aplicando filtro de relevância...</p>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error || editais.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px', background: 'white', borderRadius: '8px', border: '1px dashed #ccc' }}>
            <FaFilter style={{ fontSize: '3rem', color: '#ccc', marginBottom: '20px' }} />
            <h3 style={{fontSize: '1.2rem', marginBottom: '10px'}}>Tudo limpo por hoje.</h3>
            <p>Nenhum edital de <strong>Cultura</strong> ou <strong>Educação</strong> encontrado nas últimas publicações oficiais.</p>
            <p style={{fontSize: '0.8rem', marginTop: '10px', color: '#999'}}>(Editais de outras áreas foram ocultados automaticamente)</p>
            <button 
              onClick={fetchNoticias} 
              className="btn-outline" 
              style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
            >
              <FaSyncAlt style={{ marginRight: '8px' }} /> Verificar Novamente
            </button>
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}
          >
            {editais.map((item, index) => (
              <motion.div 
                key={index} 
                variants={itemAnim}
                style={{ 
                  background: 'white', 
                  padding: '30px', 
                  borderRadius: '8px', 
                  borderTop: item.categoria === 'CULTURA' ? '4px solid #9C27B0' : '4px solid #2F5233', 
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ 
                      fontSize: '0.7rem', fontWeight: 'bold', 
                      background: item.categoria === 'CULTURA' ? '#F3E5F5' : '#E8F5E9', 
                      color: item.categoria === 'CULTURA' ? '#7B1FA2' : '#2F5233', 
                      padding: '4px 8px', borderRadius: '4px',
                      display: 'flex', alignItems: 'center', gap: '5px'
                    }}>
                      {item.categoria === 'CULTURA' ? <FaTheaterMasks /> : <FaGraduationCap />}
                      {item.categoria}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#999' }}>
                      {new Date(item.pubDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333', marginBottom: '15px', lineHeight: '1.4', fontFamily: 'Lato' }}>
                    {item.title}
                  </h3>
                </div>

                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ 
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    color: item.categoria === 'CULTURA' ? '#7B1FA2' : 'var(--primary)',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: '0.3s'
                  }}
                >
                  Ler Edital <FaExternalLinkAlt style={{ marginLeft: '8px', fontSize: '0.7rem' }} />
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MonitorBahia;