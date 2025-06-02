// Utilitários globais extremamente simplificados
const Utils = {
    // Valida se o usuário está logado
    validarAutenticacao: function() {
        const usuario = localStorage.getItem('usuario');
        if (!usuario) {
            window.location.href = this.getBasePath() + 'index.html';
            return false;
        }
        return true;
    },
    
    // Determina o caminho base para os links
    getBasePath: function() {
        const path = window.location.pathname;
        if (path.includes('/produtos/') || path.includes('/colaboradores/') || path.includes('/movimentacoes/') || path.includes('/auditoria/')) {
            return '../';
        }
        if (path.includes('/painelColaborador/')) {
            return '../';
        }
        return '';
    },
    
    // Função de confirmação simplificada
    confirm: function(message) {
        return window.confirm(message);
    }
};