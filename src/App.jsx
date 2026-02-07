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
import MonitorBahia from './components/MonitorBahia';
import CountUp from './components/CountUp'; // Certifique-se de ter criado este arquivo
import Clients from './components/Clients';
import './App.css';

// --- CONFIGURAÇÕES DE ANIMAÇÃO ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
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

  // Função de rolagem suave
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false); // Fecha o menu mobile ao clicar
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

    // Substitua pelos seus IDs reais do EmailJS
    const SERVICE_ID = "service_xxxxxxx"; 
    const TEMPLATE_ID = "template_xxxxxxx"; 
    const PUBLIC_KEY = "pRDn8kbtXodJTNz33"; 

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

  // Inputs do Formulário
  const ModernInput = ({ type, name, placeholder, rows, required }) => (
    <div className="input-group">
      {rows ? (
        <textarea name={name} className="modern-input" placeholder={placeholder} rows={rows} required={required}></textarea>
      ) : (
        <input type={type} name={name} className="modern-input" placeholder={placeholder} required={required} />
      )}
    </div>
  );

  // Card de Serviço (SEM MOTION PARA EVITAR PISCAR)
  const ServiceCard = ({ icon: Icon, title, description, features }) => (
    <div className="service-card">
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
    </div>
  );

  return (
    <div className="app">
      {/* Progress Bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* --- HEADER --- */}
      <header className="header">
        <div className="container header-content">
          
          <div className="logo" onClick={() => scrollTo('home')}>
            <span className="logo-main">JEQUITIBÁ</span>
            <span className="logo-sub">Assessoria</span>
          </div>

          {/* Menu Desktop (Lógica de classe para mobile) */}
          <nav className={`nav-desktop ${menuOpen ? 'active' : ''}`}>
            <button onClick={() => scrollTo('home')}>Início</button>
            <button onClick={() => scrollTo('servicos')}>Atuação</button>
            <button onClick={() => scrollTo('monitor')}>Editais</button>
            <button onClick={() => scrollTo('sobre')}>A Jequitibá</button>
            <button onClick={() => scrollTo('contato')} className="btn-mobile-contact btn btn-gradient" style={{color: 'white'}}>
              Fale Conosco
            </button>
          </nav>

          <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section id="home" className="hero">
        <div className="container hero-content">
          <motion.div 
            className="hero-text"
            initial="hidden" 
            animate="visible" 
            variants={fadeInUp}
          >
            <span className="overline">Assessoria Educacional & Cultural</span>
            <h1>
              Transformamos <span className="gradient-text">burocracia</span> em projetos aprovados.
            </h1>
            <p className="hero-subtitle">
              Da regularização escolar à captação de recursos na Lei Aldir Blanc (PNAB).
            </p>
            <div className="hero-buttons">
              <button className="btn btn-gradient" onClick={() => scrollTo('monitor')}>
                Ver Editais
              </button>
              <button className="btn btn-outline" onClick={() => scrollTo('contato')}>
                Diagnóstico Gratuito
              </button>
            </div>
          </motion.div>

          <motion.div 
            className="hero-image-wrapper"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80" 
              alt="Gestão e Educação" 
              className="hero-img" 
            />
            <div className="floating-badge">
              <span className="badge-number">+<CountUp end={150} /></span>
              <span className="badge-text">Projetos<br/>Aprovados</span>
            </div>
          </motion.div>
        </div>
      </section>
<Clients />
      {/* --- STATS BAR (COM CONTADOR) --- */}
      <section className="stats-bar">
        <div className="container stats-grid">
          <div className="stat-item">
            <span className="stat-number">+<CountUp end={150} /></span>
            <span className="stat-label">Projetos Aprovados</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">R$ <CountUp end={12} /> Mi+</span>
            <span className="stat-label">Captados para Clientes</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">BA</span>
            <span className="stat-label">Atuação Estadual</span>
          </div>
          <div className="stat-item">
            <span className="stat-number"><CountUp end={100} />%</span>
            <span className="stat-label">Foco em Resultados</span>
          </div>
        </div>
      </section>

      {/* --- SERVIÇOS --- */}
      <section id="servicos" className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="overline">Nossa Expertise</span>
            <h2 className="section-title">Soluções Integradas</h2>
          </div>

          <div className="services-grid">
            <ServiceCard
              icon={FaGraduationCap}
              title="Gestão Pedagógica"
              description="Reestruturação de PPP, alinhamento à BNCC e formação continuada."
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
              description="Escrita e prestação de contas para Lei Aldir Blanc, FazCultura e Secult."
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
              description="Processos de autorização e reconhecimento de cursos junto ao CEE-BA."
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

      {/* --- MONITOR BAHIA --- */}
      <section id="monitor" className="monitor-section section-padding">
        <div className="container">
          <div className="section-header">
            <span className="overline">Oportunidades</span>
            <h2 className="section-title">Editais Abertos na Bahia</h2>
            <p className="section-subtitle">
              Monitoramento automático dos portais oficiais.
            </p>
          </div>

          <MonitorBahia />

          <div className="monitor-cta" style={{ marginTop: '40px' }}>
            <p>Precisa de ajuda para escrever seu projeto?</p>
            <button className="btn btn-gradient" onClick={() => scrollTo('contato')}>
              Falar com um Especialista
            </button>
          </div>
        </div>
      </section>

      {/* --- SOBRE NÓS --- */}
      <section id="sobre" className="about-section section-padding">
        <div className="container about-content">
          <div className="about-text">
            <span className="overline">Quem Somos</span>
            <h2 className="section-title">Raízes fortes, resultados duradouros.</h2>
            <p className="about-description">
              A Jequitibá nasceu da união de especialistas em gestão pública, pedagogia e produção cultural. 
              Entendemos a realidade da Bahia.
            </p>
            
            <div className="about-features">
              <div className="feature">
                <FaCheck className="feature-icon" /> <span>Equipe multidisciplinar especializada</span>
              </div>
              <div className="feature">
                <FaCheck className="feature-icon" /> <span>Conhecimento profundo da legislação</span>
              </div>
              <div className="feature">
                <FaCheck className="feature-icon" /> <span>Acompanhamento personalizado</span>
              </div>
              <div className="feature">
                <FaCheck className="feature-icon" /> <span>Transparência em todas as etapas</span>
              </div>
            </div>
            
            <button className="btn btn-gradient" onClick={() => scrollTo('contato')}>
              Falar com a Diretoria
            </button>
          </div>
          
          <div className="about-image">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" 
              alt="Equipe Jequitibá" 
              className="about-img" 
            />
          </div>
        </div>
      </section>

      {/* --- TESTEMUNHOS --- */}
      <section className="testimonials-section section-padding">
        <div className="container">
          <div className="section-header">
            <span className="overline">Depoimentos</span>
            <h2 className="section-title">O que dizem sobre nós</h2>
          </div>

          <div className="testimonials-container">
            <div className="testimonials-wrapper">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className={`testimonial-card ${index === activeTestimonial ? 'active' : ''}`}
                >
                  <FaQuoteLeft className="quote-icon" />
                  <p className="testimonial-content">{testimonial.content}</p>
                  <div className="testimonial-author">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="testimonials-controls">
              <button onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)} className="control-btn"><FaChevronLeft /></button>
              <div className="testimonials-dots">
                {testimonials.map((_, index) => (
                  <button key={index} className={`dot ${index === activeTestimonial ? 'active' : ''}`} onClick={() => setActiveTestimonial(index)} />
                ))}
              </div>
              <button onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)} className="control-btn"><FaChevronRight /></button>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTATO --- */}
      <section id="contato" className="contact-section section-padding">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Vamos conversar?</h2>
          </div>

          <div className="contact-grid">
            <div className="contact-info">
              <h3>Atendimento Especializado</h3>
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper"><FaPhoneAlt /></div>
                  <div><span>WhatsApp</span><p>(71) 99999-9999</p></div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper"><FaEnvelope /></div>
                  <div><span>E-mail</span><p>contato@jequitibaassessoria.com.br</p></div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper"><FaMapMarkerAlt /></div>
                  <div><span>Atuação</span><p>Salvador & Bahia</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo-main" style={{color: 'white'}}>JEQUITIBÁ</div>
              <p style={{marginTop: '10px'}}>Consultoria estratégica focada em resultados reais.</p>
            </div>
            <div className="footer-section">
              <h4>Links</h4>
              <ul className="footer-links">
                <li><button onClick={() => scrollTo('home')}>Início</button></li>
                <li><button onClick={() => scrollTo('monitor')}>Editais</button></li>
                <li><button onClick={() => scrollTo('contato')}>Contato</button></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Jequitibá Assessoria.</p>
          </div>
        </div>
      </footer>
      
      {/* CHATBOT (Direita) */}
      <ChatWidget />

      {/* WHATSAPP (Esquerda) */}
      <a 
        href="https://wa.me/5571999999999" 
        target="_blank" 
        rel="noreferrer"
        className="whatsapp-button"
      >
        <FaWhatsapp />
      </a>
    </div>
  );
}

export default App;