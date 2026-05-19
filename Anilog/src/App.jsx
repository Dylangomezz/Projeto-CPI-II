import React, { useState, useEffect } from 'react';
import { getTopAnimes, searchAnimes } from './services/api';
import Swal from 'sweetalert2';

// --- CONFIGURAÇÃO DO CHART.JS ---
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [animes, setAnimes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Controle de Abas Virtuais para navegação
  const [activeTab, setActiveTab] = useState('catalogo'); // catalogo | lista | perfil

  // --- ESTADOS PARA PERSISTÊNCIA (BÔNUS) ---
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('anilog_favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('anime_history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Carrega os animes mais populares ao iniciar a página
  useEffect(() => {
    fetchTopAnimes();
  }, []);

  const fetchTopAnimes = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getTopAnimes();
      setAnimes(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Efeito que monitora o campo de busca em tempo real
  useEffect(() => {
    if (searchTerm.trim() === '') {
      fetchTopAnimes();
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        setLoading(true);
        setError(false);
        setActiveTab('catalogo'); // Força voltar para o catálogo ao pesquisar
        const results = await searchAnimes(searchTerm);
        setAnimes(results);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // --- LÓGICA DE MANIPULAÇÃO DE DADOS (JS PURO) ---
  const handleToggleFavorite = (anime) => {
    let updatedFavorites;
    const isFavorite = favorites.some(fav => fav.mal_id === anime.mal_id);

    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.mal_id !== anime.mal_id);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Removido dos favoritos',
        showConfirmButton: false,
        timer: 1500,
        background: '#0f172a',
        color: '#f8fafc'
      });
    } else {
      updatedFavorites = [...favorites, {
        mal_id: anime.mal_id,
        title: anime.title,
        images: anime.images,
        score: anime.score,
        genres: anime.genres
      }];
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Adicionado aos favoritos! ❤️',
        showConfirmButton: false,
        timer: 1500,
        background: '#0f172a',
        color: '#f8fafc'
      });
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('anilog_favorites', JSON.stringify(updatedFavorites));
  };

  const handleLogHistory = (anime) => {
    const primaryGenre = anime.genres?.[0]?.name || 'Outros';
    const newEntry = {
      id: anime.mal_id,
      title: anime.title,
      genre: primaryGenre,
      watchedAt: new Date().toISOString()
    };

    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('anime_history', JSON.stringify(updatedHistory));
  };

  // --- PROCESSAMENTO DOS DADOS DO GRÁFICO (CRITÉRIO 1) ---
  const genreCounts = {};
  history.forEach(item => {
    genreCounts[item.genre] = (genreCounts[item.genre] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(genreCounts),
    datasets: [
      {
        label: 'Visualizações',
        data: Object.values(genreCounts),
        backgroundColor: ['#f43f5e', '#3b82f6', '#eab308', '#10b981', '#a855f7', '#f97316'],
        borderColor: '#1e293b',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#f8fafc', font: { size: 12 } } }
    }
  };

  // --- MODALS (SWEETALERT2) ---
  const handleOpenModal = (anime) => {
    const statusTraduzido = anime.status === 'Currently Airing' ? 'Em exibição' : 'Concluído';

    Swal.fire({
      title: `<span class="text-slate-100 font-extrabold text-xl md:text-2xl">${anime.title}</span>`,
      html: `
        <div class="text-left text-slate-300 text-sm space-y-4 max-h-[60vh] overflow-y-auto px-1">
          <div class="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            <img src="${anime.images?.jpg?.image_url}" alt="${anime.title}" class="w-32 h-44 object-cover rounded-lg shadow-md border border-slate-700" />
            <div class="space-y-1.5 text-xs">
              <p><strong class="text-rose-400">Nota:</strong> ⭐ ${anime.score || 'N/A'}</p>
              <p><strong class="text-rose-400">Episódios:</strong> ${anime.episodes || 'Não informado'}</p>
              <p><strong class="text-rose-400">Status:</strong> ${statusTraduzido}</p>
              <p><strong class="text-rose-400">Ano:</strong> ${anime.year || 'N/A'}</p>
              <p><strong class="text-rose-400">Estúdio:</strong> ${anime.studios?.[0]?.name || 'Desconhecido'}</p>
            </div>
          </div>
          <div class="pt-2">
            <h5 class="text-rose-500 font-bold mb-1 text-xs uppercase tracking-wider">Sinopse</h5>
            <p class="text-slate-400 text-xs leading-relaxed text-justify">
              ${anime.synopsis ? anime.synopsis : 'Nenhuma sinopse disponível para este título.'}
            </p>
          </div>
        </div>
      `,
      background: '#0f172a',
      color: '#f8fafc',
      showCancelButton: !!anime.trailer?.embed_url,
      confirmButtonText: 'Fechar',
      cancelButtonText: '🎬 Assistir Trailer',
      confirmButtonColor: '#334155',
      cancelButtonColor: '#e11d48',
      reverseButtons: true,
      customClass: {
        popup: 'border border-slate-800 rounded-2xl shadow-2xl max-w-lg w-11/12',
        title: 'border-b border-slate-800 pb-3',
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel && anime.trailer?.embed_url) {
        handleLogHistory(anime); // Alimenta o histórico antes de abrir o trailer
        handleOpenTrailer(anime.trailer.embed_url, anime.title);
      }
    });
  };

  const handleOpenTrailer = (embedUrl, title) => {
    Swal.fire({
      title: `<span class="text-slate-100 font-bold text-lg">${title} - Trailer</span>`,
      html: `
        <div class="w-full aspect-video rounded-lg overflow-hidden border border-slate-800 mt-2">
          <iframe src="${embedUrl}" title="${title} Trailer" class="w-full h-full" allowfullscreen></iframe>
        </div>
      `,
      background: '#0f172a',
      confirmButtonText: 'Voltar',
      confirmButtonColor: '#e11d48',
      customClass: { popup: 'border border-slate-800 rounded-2xl max-w-2xl w-11/12' }
    });
  };

  // Reaproveitamento do Card de Anime para evitar código duplicado
  const renderAnimeCard = (anime) => (
    <div key={anime.mal_id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-200 group flex flex-col justify-between">
      <div className="relative overflow-hidden">
        <img src={anime.images?.jpg?.image_url} alt={anime.title} className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity" />
        <span className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md text-amber-400 font-bold text-xs px-2 py-1 rounded">
          ⭐ {anime.score || 'N/A'}
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <h4 className="text-sm font-bold text-slate-100 line-clamp-2 mb-2 group-hover:text-rose-500 transition-colors">
          {anime.title}
        </h4>
        <div className="flex gap-2 mt-2">
          <button onClick={() => handleOpenModal(anime)} className="flex-1 bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white text-xs font-semibold py-2 rounded transition-colors">
            Ver Detalhes
          </button>
          <button onClick={() => handleToggleFavorite(anime)} className="bg-slate-800 hover:bg-slate-700 text-xs px-2.5 py-2 rounded transition-colors border border-slate-700">
            {favorites.some(fav => fav.mal_id === anime.mal_id) ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      
      {/* HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveTab('catalogo'); setSearchTerm(''); }}>
          <span className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
            ANILOG<span className="text-slate-50 font-light text-sm ml-1">.tv</span>
          </span>
        </div>

        {/* BARRA DE PESQUISA */}
        <div className="w-full sm:w-96 relative">
          <input
            type="text"
            placeholder="Pesquisar anime em tempo real..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
          <span className="absolute right-3 top-2.5 text-slate-500 text-xs">🔍</span>
        </div>

        {/* NAVEGAÇÃO ENTRE ABAS */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <button onClick={() => setActiveTab('catalogo')} className={`transition-colors ${activeTab === 'catalogo' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>Catálogo</button>
          <button onClick={() => setActiveTab('lista')} className={`transition-colors ${activeTab === 'lista' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>Minha Lista ({favorites.length})</button>
          <button onClick={() => setActiveTab('perfil')} className={`transition-colors ${activeTab === 'perfil' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'} flex items-center gap-1`}>
            <span>📊</span> Perfil
          </button>
        </nav>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        
        {/* HERO BANNER */}
        <section className="mb-10 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
            Bem-vindo ao <span className="text-rose-500">Anilog</span>, Dylan! 👋
          </h2>
          <p className="text-slate-400 text-sm max-w-xl">
            Descubra novos títulos, gerencie seus favoritos e acompanhe gráficos detalhados sobre o seu consumo de animes.
          </p>
        </section>

        {/* ABA 1: CATÁLOGO */}
        {activeTab === 'catalogo' && (
          <section id="catalogo" className="mb-10">
            <h3 className="text-xl font-bold mb-6 border-l-4 border-rose-500 pl-3">
              {searchTerm ? `Resultados para: "${searchTerm}"` : "Animes Mais Populares"}
            </h3>

            {error && (
              <div className="text-center p-10 bg-rose-950/20 border border-rose-900 rounded-xl">
                <p className="text-rose-400 font-medium">Ops! Houve um erro ao carregar os dados da API.</p>
                <button onClick={fetchTopAnimes} className="mt-4 bg-rose-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-rose-500">Tentar Novamente</button>
              </div>
            )}

            {loading && !error && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(5)].map((_, i) => <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden animate-pulse h-80"></div>)}
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {animes.length === 0 ? <p className="col-span-full text-center text-slate-500 py-10">Nenhum anime encontrado.</p> : animes.map(renderAnimeCard)}
              </div>
            )}
          </section>
        )}

        {/* ABA 2: MINHA LISTA (FAVORITOS PERSISTIDOS) */}
        {activeTab === 'lista' && (
          <section id="lista" className="mb-10">
            <h3 className="text-xl font-bold mb-6 border-l-4 border-rose-500 pl-3">Minha Lista de Favoritos</h3>
            {favorites.length === 0 ? (
              <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl">
                <p className="text-slate-400">Sua lista está vazia.</p>
                <p className="text-xs text-slate-600 mt-1">Clique no coração dos cards para salvar seus animes favoritos aqui!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {favorites.map(renderAnimeCard)}
              </div>
            )}
          </section>
        )}

        {/* ABA 3: PERFIL E GRÁFICOS (CHART.JS) */}
        {activeTab === 'perfil' && (
          <section id="perfil" className="mb-10 max-w-xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold text-center mb-1">Estatísticas do Seu Perfil</h3>
              <p className="text-xs text-slate-500 text-center mb-6">Distribuição por gêneros baseada nos trailers assistidos</p>
              
              {history.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
                  <p className="text-slate-500 text-sm">Nenhum dado disponível.</p>
                  <p className="text-[11px] text-slate-600 mt-1">Assista a trailers de animes no catálogo para gerar o gráfico!</p>
                </div>
              ) : (
                <>
                  <div className="h-64 relative">
                    <Doughnut data={chartData} options={chartOptions} />
                  </div>
                  <div className="mt-6 flex justify-center">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      Total de Interações: {history.length}
                    </span>
                  </div>
                </>
              )}
            </div>
          </section>
        )}

      </main>

      <footer className="bg-slate-900 border-t border-slate-800 text-center py-4 text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Anilog.tv. Desenvolvido por Dylan Gomes Felix.
      </footer>

    </div>
  );
}

export default App;