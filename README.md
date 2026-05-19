# Anilog ⚡
> **Ecossistema de streaming e estatística de anime.**

[cite_start]O **Anilog** é uma aplicação web moderna desenvolvida como projeto final para a disciplina de **Construção de Páginas para Internet II**. [cite_start]A plataforma funciona como um agregador inteligente de animes, consumindo dados em tempo real da API pública do MyAnimeList para fornecer informações detalhadas, exibição de trailers e uma ferramenta personalizada de análise estatística de consumo[cite: 7, 10].

---

## 🛠️ Tecnologias e Bibliotecas Utilizadas

O projeto foi construído utilizando as ferramentas mais modernas do ecossistema JavaScript:

- [cite_start]**Framework Core:** [React](https://react.dev/) (estruturado de forma modular e rápida através do Vite)[cite: 6].
- [cite_start]**Framework CSS:** [Tailwind CSS](https://tailwindcss.com/) (responsividade nativa e visual em *Dark Mode*)[cite: 20].
- [cite_start]**Requisições HTTP:** [Axios](https://axios-http.com/) (centralização das chamadas de API e tratamento de erros)[cite: 31].
- [cite_start]**Pop-ups e Modals:** [SweetAlert2](https://sweetalert2.github.io/) (interações elegantes e renderização de mídia em *iframes*)[cite: 34].
- [cite_start]**Gráficos Dinâmicos:** [Chart.js](https://www.chartjs.org/) + `react-chartjs-2` (geração de métricas por gênero de anime)[cite: 35].

---

## 🚀 Funcionalidades Principais (Requisitos Atendidos)

- [cite_start]**[RF01] Catálogo Dinâmico e Busca:** Renderização contínua dos títulos mais populares do momento e barra de busca integrada com filtro por texto em tempo real consumindo a *Jikan API*[cite: 31].
- [cite_start]**[RF02] Lista de Favoritos ("Minha Lista"):** Lógica em JavaScript puro para salvar, remover e persistir animes favoritos localmente no navegador (`localStorage`)[cite: 32].
- [cite_start]**[RF03] Histórico de Visualização:** Sistema automatizado de *tracking* que armazena os metadados (como o gênero principal do anime) toda vez que um usuário interage assistindo a um trailer[cite: 33].
- [cite_start]**[RF04] Modals de Vídeo Dinâmicos:** Pop-ups interativos gerados via SweetAlert2 que mostram detalhes técnicos, sinopse, e incorporam o player do YouTube para trailers oficiais[cite: 34].
- [cite_start]**[RF05] Dashboard Estatístico:** Um painel gráfico interativo que faz o mapeamento e contagem manual de dados para desenhar um gráfico no formato de Rosca (*Doughnut*) mostrando as preferências de gênero do usuário[cite: 10, 35].

---

## 📂 Organização da Estrutura de Pastas

```text
Anilog/
├── src/
│   ├── services/      # Integração e serviços de API externa (Axios)
│   │   └── api.js
│   ├── App.jsx        # Componente principal unificado (estados, lógica e renderização)
│   ├── index.css      # Diretivas globais do Tailwind CSS
│   └── main.jsx       # Inicialização do React + Vite
├── index.html         # Ponto de entrada do DOM
├── tailwind.config.js # Configurações de utilitários de estilo
├── package.json       # Gerenciamento de scripts e dependências
└── README.md          # Documentação do projeto