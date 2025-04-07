/**
 * Utilitário para gerenciar operações com arquivos
 */
const path = require('path');
const fs = require('fs');

class FileUtil {
    /**
     * Diretório base para uploads
     */
    static UPLOAD_DIR = path.join(__dirname, '../../uploads');

    /**
     * Verifica se o diretório de uploads existe, e cria se não existir
     */
    static ensureUploadDirExists() {
        if (!fs.existsSync(this.UPLOAD_DIR)) {
            fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
        }
    }

    /**
     * Deleta um arquivo do diretório de uploads
     * @param {string} filename - Nome do arquivo a ser deletado
     * @returns {boolean} - true se o arquivo foi deletado, false caso contrário
     */
    static deleteFile(filename) {
        if (!filename) return false;
        
        const filePath = path.join(this.UPLOAD_DIR, filename);
        
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                return true;
            } catch (error) {
                console.error('Erro ao deletar arquivo:', error);
                return false;
            }
        }
        return false;
    }

    /**
     * Gera uma URL completa para um arquivo de upload
     * @param {string} filename - Nome do arquivo
     * @param {string} baseUrl - URL base do servidor
     * @returns {string} - URL completa para o arquivo
     */
    static getFileUrl(filename, baseUrl = 'http://localhost:3000') {
        if (!filename) return null;
        return `${baseUrl}/uploads/${filename}`;
    }
}

module.exports = FileUtil; 