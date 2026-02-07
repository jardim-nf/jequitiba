import React from 'react';
import './Clients.css'; // Vamos criar esse CSS específico logo abaixo

const Clients = () => {
  // Simulação de Logos de Clientes (Usei gerador de imagem para não quebrar)
  // Quando tiver os logos reais, basta trocar o 'src' pelo caminho da imagem
  const clients = [
    { name: "Prefeitura de Salvador", img: "https://placehold.co/150x60/1A3C28/ffffff?text=Pref.+Salvador" },
    { name: "Governo da Bahia", img: "https://placehold.co/150x60/1A3C28/ffffff?text=Gov.+Bahia" },
    { name: "Instituto Cultural", img: "https://placehold.co/150x60/1A3C28/ffffff?text=Inst.+Cultural" },
    { name: "Colégio Viver", img: "https://placehold.co/150x60/1A3C28/ffffff?text=Colégio+Viver" },
    { name: "ONG Viva", img: "https://placehold.co/150x60/1A3C28/ffffff?text=ONG+Viva" },
    { name: "Fundação Gregório", img: "https://placehold.co/150x60/1A3C28/ffffff?text=Fundação+GM" },
  ];

  return (
    <div className="clients-section">
      <div className="container">
        <p className="clients-title">QUEM CONFIA NA JEQUITIBÁ</p>
        
        <div className="logos-slider">
          <div className="logos-slide">
            {/* Primeira cópia da lista */}
            {clients.map((client, index) => (
              <div key={index} className="client-logo">
                <img src={client.img} alt={client.name} />
              </div>
            ))}
            {/* Segunda cópia da lista (para o efeito infinito) */}
            {clients.map((client, index) => (
              <div key={`dup-${index}`} className="client-logo">
                <img src={client.img} alt={client.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;