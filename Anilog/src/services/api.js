import axios from 'axios';

// Configura a URL base da Jikan API (MyAnimeList)
const api = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
});

// Função para buscar os animes mais populares do momento (Home)
export const getTopAnimes = async () => {
  try {
    const response = await api.get('/top/anime?limit=10');
    return response.data.data; // A API retorna a lista dentro de .data.data
  } catch (error) {
    console.error("Erro ao buscar top animes no Axios:", error);
    throw error; // Repassa o erro para o componente tratar na tela
  }
};

// Função para buscar animes por nome (Barra de Pesquisa)
export const searchAnimes = async (query) => {
  try {
    const response = await api.get(`/anime?q=${query}&limit=10`);
    return response.data.data;
  } catch (error) {
    console.error(`Erro ao pesquisar anime "${query}":`, error);
    throw error;
  }
};