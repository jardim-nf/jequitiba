import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

// Ícones
import { 
  FaWhatsapp, FaGraduationCap, FaBalanceScale, FaChartLine, 
  FaBars, FaTimes, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt,
  FaCheck, FaArrowRight, FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

// Componentes
import ChatWidget from './components/ChatWidget';
import MonitorBahia from './components/MonitorBahia'; // <--- O NOVO COMPONENTE AQUI

import './App.css';

// --- CONFIGURAÇÕES DE ANIMAÇÃO ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.15 } }
};

// --- COMPONENTE PRINCIPAL ---
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Estados do Formulário
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Testimonials data
  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Diretor de Escola em Salvador",
      content: "A Jequitibá transformou nossa gestão pedagógica. Conseguimos regularizar toda a documentação em tempo recorde.",
      rating: 5
    },
    {
      name: "Ana Paula Santos",
      role: "Produtora Cultural",
      content: "Captamos recursos através da Lei Aldir Blanc com a assessoria deles. Profissionais excepcionais!",
      rating: 5
    },
    {
      name: "Roberto Almeida",
      role: "Coordenador Pedagógico",
      content: "O suporte na elaboração do PPP foi fundamental para nosso alinhamento com a BNCC. Recomendo!",
      rating: 4
    }
  ];

  // Parceiros/Clientes
  const partners = [
    "SECULT-BA", "CEE-BA", "FAZCULTURA", "LEI PAULO GUSTAVO", "REDE MUNICIPAL"
  ];

  // Função de rolagem suave
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  // Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Função de Envio de Email (EmailJS)
  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    const SERVICE_ID = "service_xxxxxxx"; // Coloque seu ID real aqui
    const TEMPLATE_ID = "template_xxxxxxx"; // Coloque seu Template ID aqui
    const PUBLIC_KEY = "pRDn8kbtXodJTNz33"; // Sua chave pública

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then((result) => {
          setSuccess(true);
          setLoading(false);
          e.target.reset();
          setTimeout(() => setSuccess(false), 5000);
      }, (error) => {
          console.log(error.text);
          setLoading(false);
          alert("Ocorreu um erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.");
      });
  };

  // Componente interno para Inputs do Formulário
  const ModernInput = ({ type, name, placeholder, rows, required }) => (
    <div className="input-group">
      {rows ? (
        <textarea name={name} className="modern-input" placeholder={placeholder} rows={rows} required={required}></textarea>
      ) : (
        <input type={type} name={name} className="modern-input" placeholder={placeholder} required={required} />
      )}
      <span className="input-highlight"></span>
    </div>
  );

  // Componente de Card de Serviço
  const ServiceCard = ({ icon: Icon, title, description, features }) => (
    <motion.div 
      className="service-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      viewport={{ once: true }}
    >
      <div className="service-card-icon">
        <Icon size={32} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <ul className="service-features">
        {features.map((feature, idx) => (
          <li key={idx}>
            <FaCheck size={12} /> {feature}
          </li>
        ))}
      </ul>
      <button className="service-card-btn" onClick={() => scrollTo('contato')}>
        Saiba mais <FaArrowRight />
      </button>
    </motion.div>
  );

  return (
    <div className="app">
      {/* Progress Bar */}
      <div 
        className="scroll-progress" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* --- HEADER (Navegação Fixa) --- */}
      <header className="header">
        <div className="container header-content">
          
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="logo"
            onClick={() => scrollTo('home')}
          >
            <div className="logo-main">JEQUITIBÁ</div>
            <div className="logo-sub">Assessoria</div>
          </motion.div>

          {/* Menu Desktop */}
          <nav className="nav-desktop">
            <button onClick={() => scrollTo('home')} className="nav-link">Início</button>
            <button onClick={() => scrollTo('servicos')} className="nav-link">Atuação</button>
            <button onClick={() => scrollTo('monitor')} className="nav-link highlight">Editais</button>
            <button onClick={() => scrollTo('sobre')} className="nav-link">A Jequitibá</button>
            <button onClick={() => scrollTo('contato')} className="btn btn-gradient">
              Fale Conosco
            </button>
          </nav>

          {/* Ícone Menu Mobile */}
          <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {menuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button onClick={() => scrollTo('home')}>Início</button>
            <button onClick={() => scrollTo('servicos')}>Atuação</button>
            <button onClick={() => scrollTo('monitor')} className="highlight">Editais</button>
            <button onClick={() => scrollTo('sobre')}>A Jequitibá</button>
            <button onClick={() => scrollTo('contato')} className="btn-mobile-contact">
              Contato
            </button>
          </motion.div>
        )}
      </header>

      {/* --- HERO SECTION --- */}
      <section id="home" className="hero">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <motion.div 
            className="hero-text"
            initial="hidden" 
            animate="visible" 
            variants={fadeInUp}
          >
            <span className="overline">Assessoria Educacional & Cultural na Bahia</span>
            <h1>
              Transformamos <span className="gradient-text">burocracia</span> em projetos aprovados.
            </h1>
            <p className="hero-subtitle">
              Da regularização escolar à captação de recursos na Lei Aldir Blanc (PNAB). Conectamos sua instituição às oportunidades do Estado.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-gradient btn-hero" onClick={() => scrollTo('monitor')}>
                Ver Editais Abertos
              </button>
              <button className="btn btn-outline btn-hero" onClick={() => scrollTo('contato')}>
                <FaWhatsapp style={{ marginRight: '8px' }} /> Diagnóstico Gratuito
              </button>
            </div>
          </motion.div>

          {/* Imagem Hero */}
          <motion.div 
            className="hero-image-wrapper"
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="floating-shape shape-1" />
            <div className="floating-shape shape-2" />
            <img 
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80" 
              alt="Gestão e Educação" 
              className="hero-img" 
              loading="lazy"
            />
            <div className="floating-badge">
              <div className="badge-content">
                <span className="badge-number">+150</span>
                <span className="badge-text">Projetos Aprovados</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <section className="stats-bar">
        <div className="container stats-grid">
          {[
            { number: "+150", label: "Projetos Aprovados" },
            { number: "R$ 12 Mi+", label: "Captados para Clientes" },
            { number: "BA", label: "Atuação em todo o Estado" },
            { number: "100%", label: "Foco em Resultados" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <span className="stat-number">{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- SERVIÇOS --- */}
      <section id="servicos" className="section-padding">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeInUp}
          >
            <span className="overline">Nossa Expertise</span>
            <h2 className="section-title">Soluções Integradas</h2>
            <p className="section-subtitle">
              Oferecemos um conjunto completo de serviços para instituições educacionais e culturais
            </p>
          </motion.div>

          <div className="services-grid">
            <ServiceCard
              icon={FaGraduationCap}
              title="Gestão Pedagógica"
              description="Reestruturação de PPP, alinhamento à BNCC e formação continuada para escolas que buscam excelência."
              features={[
                "Reestruturação de PPP",
                "Alinhamento à BNCC",
                "Formação Continuada",
                "Avaliação Institucional"
              ]}
            />
            
            <ServiceCard
              icon={FaChartLine}
              title="Projetos Culturais"
              description="Escrita e prestação de contas para Lei Aldir Blanc (PNAB), FazCultura e editais da Secult/BA."
              features={[
                "PNAB (Aldir Blanc)",
                "FazCultura Bahia",
                "Editais SECULT",
                "Prestação de Contas"
              ]}
            />
            
            <ServiceCard
              icon={FaBalanceScale}
              title="Regularização"
              description="Processos de autorização e reconhecimento de cursos junto ao Conselho Estadual de Educação (CEE-BA)."
              features={[
                "Autorização de Cursos",
                "Reconhecimento",
                "Renovação de Credenciamento",
                "Regularização Completa"
              ]}
            />
          </div>
        </div>
      </section>

      {/* --- MONITOR BAHIA (AGORA REAL COM GOOGLE) --- */}
      <section id="monitor" className="monitor-section section-padding">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeInUp}
          >
            <span className="overline">Oportunidades</span>
            <h2 className="section-title">Editais Abertos na Bahia</h2>
            <p className="section-subtitle">
              Nossa tecnologia monitora os diários oficiais para você não perder prazos importantes.
            </p>
          </motion.div>

          {/* COMPONENTE CONECTADO AO GOOGLE SEARCH */}
          <MonitorBahia />

          <div className="monitor-cta" style={{ marginTop: '40px' }}>
            <p>Precisa de ajuda para escrever seu projeto nesses editais?</p>
            <button className="btn btn-gradient" onClick={() => scrollTo('contato')}>
              Falar com um Especialista
            </button>
          </div>
        </div>
      </section>

      {/* --- PARCEIROS --- */}
      <section className="partners-section section-padding">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeInUp}
          >
            <span className="overline">Reconhecimento</span>
            <h2 className="section-title">Atuamos junto às principais instituições</h2>
          </motion.div>
          
          <div className="partners-grid">
            {partners.map((partner, index) => (
              <motion.div 
                key={index}
                className="partner-logo"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SOBRE NÓS --- */}
      <section id="sobre" className="about-section section-padding">
        <div className="container">
          <div className="about-content">
            <motion.div 
              className="about-text"
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.span className="overline" variants={fadeInUp}>Quem Somos</motion.span>
              <motion.h2 className="section-title" variants={fadeInUp}>
                Raízes fortes, <span className="gradient-text">resultados duradouros.</span>
              </motion.h2>
              <motion.p className="about-description" variants={fadeInUp}>
                A Jequitibá nasceu da união de especialistas em gestão pública, pedagogia e produção cultural. 
                Entendemos a realidade da Bahia e sabemos que por trás de cada edital existe uma oportunidade 
                de transformar uma comunidade escolar ou artística.
              </motion.p>
              
              <motion.div className="about-features" variants={fadeInUp}>
                <div className="feature">
                  <FaCheck className="feature-icon" />
                  <span>Equipe multidisciplinar especializada</span>
                </div>
                <div className="feature">
                  <FaCheck className="feature-icon" />
                  <span>Conhecimento profundo da legislação baiana</span>
                </div>
                <div className="feature">
                  <FaCheck className="feature-icon" />
                  <span>Acompanhamento personalizado do projeto</span>
                </div>
                <div className="feature">
                  <FaCheck className="feature-icon" />
                  <span>Transparência em todas as etapas</span>
                </div>
              </motion.div>
              
              <motion.button 
                className="btn btn-gradient"
                variants={fadeInUp}
                onClick={() => scrollTo('contato')}
              >
                Falar com a Diretoria
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="about-image"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="image-frame">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80" 
                  alt="Equipe Jequitibá" 
                  className="about-img"
                />
                <div className="image-overlay" />
                <div className="experience-badge">
                  <span className="experience-years">5+</span>
                  <span className="experience-text">Anos de Experiência</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- TESTEMUNHOS --- */}
      <section className="testimonials-section section-padding">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeInUp}
          >
            <span className="overline">Depoimentos</span>
            <h2 className="section-title">O que nossos clientes dizem</h2>
          </motion.div>

          <div className="testimonials-container">
            <div className="testimonials-wrapper">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className={`testimonial-card ${index === activeTestimonial ? 'active' : ''}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ 
                    opacity: index === activeTestimonial ? 1 : 0.5,
                    x: index === activeTestimonial ? 0 : 50,
                    scale: index === activeTestimonial ? 1 : 0.95
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <FaQuoteLeft className="quote-icon" />
                  <p className="testimonial-content">{testimonial.content}</p>
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i}
                        className={i < testimonial.rating ? 'star-filled' : 'star-empty'}
                      />
                    ))}
                  </div>
                  <div className="testimonial-author">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="testimonials-controls">
              <button 
                onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="control-btn"
              >
                <FaChevronLeft />
              </button>
              <div className="testimonials-dots">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === activeTestimonial ? 'active' : ''}`}
                    onClick={() => setActiveTestimonial(index)}
                  />
                ))}
              </div>
              <button 
                onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="control-btn"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTATO --- */}
      <section id="contato" className="contact-section section-padding">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeInUp}
          >
            <span className="overline">Vamos conversar?</span>
            <h2 className="section-title">Tire seu projeto do papel</h2>
            <p className="section-subtitle">
              Não deixe para a última hora. Editais têm prazos rigorosos. Entre em contato hoje mesmo.
            </p>
          </motion.div>

          <div className="contact-grid">
            {/* Informações de Contato */}
            <motion.div 
              className="contact-info"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3>Atendimento Especializado</h3>
              
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <span className="contact-label">WhatsApp</span>
                    <p className="contact-value">(71) 99999-9999</p>
                  </div>
                </div>
                
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper">
                    <FaEnvelope />
                  </div>
                  <div>
                    <span className="contact-label">E-mail</span>
                    <p className="contact-value">contato@jequitibaassessoria.com.br</p>
                  </div>
                </div>
                
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <span className="contact-label">Atuação</span>
                    <p className="contact-value">Salvador & Todo Estado da Bahia</p>
                  </div>
                </div>
              </div>

              <div className="contact-hours">
                <h4>Horário de Atendimento</h4>
                <p>Segunda a Sexta: 8h às 18h</p>
                <p>Sábado: 8h às 12h (plantão)</p>
              </div>
            </motion.div>

            {/* Formulário */}
            <motion.form 
              ref={formRef}
              onSubmit={sendEmail}
              className="contact-form"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h4>Solicitar Proposta</h4>
              
              <ModernInput type="text" name="from_name" placeholder="Nome do Responsável" required={true} />
              <ModernInput type="text" name="company" placeholder="Instituição / Empresa" required={true} />
              <ModernInput type="tel" name="phone" placeholder="Telefone com DDD" required={true} />
              <ModernInput type="email" name="email" placeholder="E-mail" required={true} />
              
              <div className="input-group">
                <select name="interest" className="modern-input">
                  <option value="">Selecione seu interesse</option>
                  <option value="Educação">Educação</option>
                  <option value="Cultura">Projetos Culturais</option>
                  <option value="Regularização">Regularização</option>
                  <option value="Outros">Outros</option>
                </select>
                <span className="input-highlight"></span>
              </div>
              
              <ModernInput name="message" placeholder="Conte-nos sobre seu projeto" rows={4} required={true} />
              
              <button 
                type="submit" 
                className="btn btn-gradient btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Enviando...
                  </>
                ) : (
                  'Enviar Solicitação'
                )}
              </button>

              {success && (
                <motion.div 
                  className="success-message"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <FaCheck className="success-icon" />
                  <div>
                    <h4>Mensagem Enviada!</h4>
                    <p>Em breve entraremos em contato.</p>
                  </div>
                </motion.div>
              )}
            </motion.form>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <span className="logo-main">JEQUITIBÁ</span>
                <span className="logo-sub">Assessoria</span>
              </div>
              <p className="footer-description">
                Consultoria estratégica focada em resultados reais para o setor educacional e cultural baiano.
              </p>
              <div className="social-links">
                <a href="#" className="social-link">LinkedIn</a>
                <a href="#" className="social-link">Instagram</a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>Navegação</h4>
              <ul className="footer-links">
                <li><button onClick={() => scrollTo('home')}>Início</button></li>
                <li><button onClick={() => scrollTo('servicos')}>Atuação</button></li>
                <li><button onClick={() => scrollTo('monitor')}>Editais</button></li>
                <li><button onClick={() => scrollTo('sobre')}>A Jequitibá</button></li>
                <li><button onClick={() => scrollTo('contato')}>Contato</button></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Serviços</h4>
              <ul className="footer-links">
                <li>Gestão Pedagógica</li>
                <li>Projetos Culturais</li>
                <li>Regularização</li>
                <li>Captação de Recursos</li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Legal</h4>
              <ul className="footer-links">
                <li><a href="#">Política de Privacidade</a></li>
                <li><a href="#">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="copyright">
              © {new Date().getFullYear()} Jequitibá Assessoria. Feito com excelência.
            </p>
            <p className="cnpj">
              CNPJ: XX.XXX.XXX/0001-XX
            </p>
          </div>
        </div>
      </footer>
      
      {/* Integração do Assistente IA */}
      <ChatWidget />

      {/* Botão Flutuante WhatsApp */}
      <motion.a 
        href="https://wa.me/5571999999999" 
        target="_blank"
        rel="noreferrer"
        className="whatsapp-button"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaWhatsapp />
        <span className="whatsapp-tooltip">Fale conosco no WhatsApp</span>
      </motion.a>
    </div>
  );
}

export default App;