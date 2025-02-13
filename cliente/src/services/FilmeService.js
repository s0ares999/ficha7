import axios from 'axios';

const FILME_API_BASE_URL = "http://localhost:3000/filmes";

class FilmeService {
    // GET - Listar todos os filmes
    getFilmes() {
        return axios.get(FILME_API_BASE_URL);
    }

    // GET - Obter detalhes de um filme específico
    getFilme(filmeId) {
        return axios.get(FILME_API_BASE_URL + "/" + filmeId);
    }

    // POST - Criar novo filme
    createFilme(filme) {
        return axios.post(FILME_API_BASE_URL + "/create", filme);
    }

    // PUT - Atualizar filme existente
    updateFilme(filmeId, filme) {
        return axios.put(FILME_API_BASE_URL + "/update/" + filmeId, filme);
    }

    // POST - Deletar filme
    deleteFilme(filmeId) {
        return axios.post(FILME_API_BASE_URL + "/delete", { id: filmeId });
    }
}

export default new FilmeService(); 