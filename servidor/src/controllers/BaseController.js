/**
 * Controlador base que fornece métodos utilitários para os controladores específicos
 * Centraliza o tratamento de erros e padroniza as respostas da API
 */
class BaseController {
    /**
     * Trata erros e envia resposta padronizada
     * @param {Error} error - O erro ocorrido
     * @param {Object} res - Objeto de resposta do Express
     * @param {string} message - Mensagem amigável para o usuário
     * @param {number} statusCode - Código HTTP (padrão: 500)
     */
    handleError(error, res, message, statusCode = 500) {
        console.error(`[Erro] ${message}:`, error);
        
        return res.status(statusCode).json({
            message: message || 'Erro interno do servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }

    /**
     * Envia resposta de sucesso padronizada
     * @param {Object} res - Objeto de resposta do Express
     * @param {any} data - Dados a serem enviados na resposta
     * @param {number} statusCode - Código HTTP (padrão: 200)
     */
    sendSuccess(res, data, statusCode = 200) {
        return res.status(statusCode).json(data);
    }

    /**
     * Envia resposta de criação bem-sucedida
     * @param {Object} res - Objeto de resposta do Express
     * @param {any} data - Dados do recurso criado
     */
    sendCreated(res, data) {
        return this.sendSuccess(res, data, 201);
    }

    /**
     * Envia resposta para requisição sem conteúdo
     * @param {Object} res - Objeto de resposta do Express
     */
    sendNoContent(res) {
        return res.status(204).send();
    }

    /**
     * Envia resposta para recurso não encontrado
     * @param {Object} res - Objeto de resposta do Express
     * @param {string} message - Mensagem descrevendo o que não foi encontrado
     */
    sendNotFound(res, message) {
        return res.status(404).json({ message });
    }

    /**
     * Envia resposta de erro de validação
     * @param {Object} res - Objeto de resposta do Express
     * @param {string} message - Mensagem de erro
     */
    sendBadRequest(res, message) {
        return res.status(400).json({ message });
    }
}

module.exports = BaseController; 