import React, { useState } from 'react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Na próxima fase, essa função vai disparar a busca no Axios!
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      
      {/* HEADER / BARRA DE NAVEGAÇÃO */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
            ANILOG<span className="text-slate-50 font-light text-sm ml-1">.tv</span>
          </span>
        </div>

        {/* BARRA DE PESQUISA (RF01) */}
        <div className="w-full sm:w-96 relative">
          <input
            type="text"
            placeholder="Pesquisar anime em tempo real..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
          <span className="absolute right-3 top-2.5 text-slate-500 text-xs">🔍</span>
        </div>

        {/* MENU RÁPIDO */}
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#catalogo" className="hover:text-rose-500 transition-colors text-slate-100">Catálogo</a>
          <a href="#lista" className="hover:text-rose-500 transition-colors">Minha Lista</a>
          <a href="#perfil" className="hover:text-rose-500 transition-colors flex items-center gap-1">
            <span>📊</span> Meu Perfil
          </a>
        </nav>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        
        {/* SESSÃO: SEU STATUS / BOAS-VINDAS */}
        <section className="mb-10 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
            Bem-vindo ao <span className="text-rose-500">Anilog</span>, Dylan! 👋
          </h2>
          <p className="text-slate-400 text-sm max-w-xl">
            Descubra novos títulos, gerencie seus favoritos e acompanhe gráficos detalhados sobre o seu consumo de animes em um só lugar.
          </p>
        </section>

        {/* SEÇÃO: GRADE DE ANIMES (CATÁLOGO ESPAÇO) */}
        <section id="catalogo" className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold tracking-tight border-l-4 border-rose-500 pl-3">
              {searchTerm ? `Resultados para: "${searchTerm}"` : "Animes Mais Populares"}
            </h3>
          </div>

          {/* Grid de simulação dos Cards (Fase 2) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md animate-pulse">
                <div className="bg-slate-800 w-full h-64 md:h-72"></div>
                <div className="p-4 space-y-2">
                  <div className="bg-slate-800 h-4 rounded w-3/4"></div>
                  <div className="bg-slate-800 h-3 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 text-center py-4 text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Anilog. Desenvolvido para a disciplina de CPI2.
      </footer>

    </div>
  );
}

export default App;