import Swal from 'sweetalert2';

/**
 * Utilitário para exibir mensagens e diálogos usando SweetAlert2
 * Centraliza as configurações para manter consistência em toda a aplicação
 */
const SwalUtil = {
    /**
     * Exibe uma mensagem de sucesso
     * @param {string} title - Título da mensagem
     * @param {string} message - Texto da mensagem
     * @param {Function} callback - Função a ser executada após fechar (opcional)
     */
    success: (title, message, callback) => {
        return Swal.fire({
            title: title || 'Sucesso!',
            text: message,
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#198754' // Bootstrap success color
        }).then(result => {
            if (result.isConfirmed && callback) {
                callback();
            }
            return result;
        });
    },

    /**
     * Exibe uma mensagem de erro
     * @param {string} title - Título da mensagem
     * @param {string} message - Texto da mensagem
     * @param {Function} callback - Função a ser executada após fechar (opcional)
     */
    error: (title, message, callback) => {
        return Swal.fire({
            title: title || 'Erro!',
            text: message,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#dc3545' // Bootstrap danger color
        }).then(result => {
            if (result.isConfirmed && callback) {
                callback();
            }
            return result;
        });
    },

    /**
     * Exibe uma mensagem de aviso
     * @param {string} title - Título da mensagem
     * @param {string} message - Texto da mensagem
     * @param {Function} callback - Função a ser executada após fechar (opcional)
     */
    warning: (title, message, callback) => {
        return Swal.fire({
            title: title || 'Atenção!',
            text: message,
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ffc107' // Bootstrap warning color
        }).then(result => {
            if (result.isConfirmed && callback) {
                callback();
            }
            return result;
        });
    },

    /**
     * Exibe uma mensagem de informação
     * @param {string} title - Título da mensagem
     * @param {string} message - Texto da mensagem
     * @param {Function} callback - Função a ser executada após fechar (opcional)
     */
    info: (title, message, callback) => {
        return Swal.fire({
            title: title || 'Informação',
            text: message,
            icon: 'info',
            confirmButtonText: 'OK',
            confirmButtonColor: '#0dcaf0' // Bootstrap info color
        }).then(result => {
            if (result.isConfirmed && callback) {
                callback();
            }
            return result;
        });
    },

    /**
     * Exibe uma mensagem de confirmação
     * @param {string} title - Título da mensagem
     * @param {string} message - Texto da mensagem
     * @param {string} confirmButtonText - Texto do botão de confirmação
     * @param {Function} onConfirm - Função a ser executada se confirmado
     * @param {Function} onCancel - Função a ser executada se cancelado (opcional)
     */
    confirm: (title, message, confirmButtonText, onConfirm, onCancel) => {
        return Swal.fire({
            title: title || 'Confirmar',
            html: message,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: confirmButtonText || 'Sim',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#198754', // Bootstrap success color
            cancelButtonColor: '#6c757d', // Bootstrap secondary color
            reverseButtons: true
        }).then(result => {
            if (result.isConfirmed && onConfirm) {
                onConfirm();
            } else if (result.dismiss === Swal.DismissReason.cancel && onCancel) {
                onCancel();
            }
            return result;
        });
    },

    /**
     * Exibe um diálogo de confirmação para excluir
     * @param {string} title - Título da mensagem
     * @param {string} message - Texto da mensagem
     * @param {Function} onConfirm - Função a ser executada se confirmado
     * @param {Function} onCancel - Função a ser executada se cancelado (opcional)
     */
    confirmDelete: (title, message, onConfirm, onCancel) => {
        return Swal.fire({
            title: title || 'Confirmar Exclusão',
            html: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc3545', // Bootstrap danger color
            cancelButtonColor: '#6c757d', // Bootstrap secondary color
            reverseButtons: true
        }).then(result => {
            if (result.isConfirmed && onConfirm) {
                onConfirm();
            } else if (result.dismiss === Swal.DismissReason.cancel && onCancel) {
                onCancel();
            }
            return result;
        });
    },

    /**
     * Exibe uma notificação de carregamento
     * @param {string} title - Título da mensagem
     * @param {string} message - Texto da mensagem
     * @returns {Object} - Instância do Swal para ser fechada posteriormente
     */
    loading: (title, message) => {
        return Swal.fire({
            title: title || 'Processando...',
            text: message || 'Aguarde enquanto processamos sua solicitação',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    },

    /**
     * Fecha um modal de carregamento aberto
     */
    closeLoading: () => {
        Swal.close();
    }
};

export default SwalUtil; 