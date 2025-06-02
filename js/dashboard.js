document.addEventListener('DOMContentLoaded', function() {
    // Mostrar valores estáticos nas estatísticas
    document.getElementById('totalProdutos').textContent = '37';
    document.getElementById('totalEntradas').textContent = '84';
    document.getElementById('totalSaidas').textContent = '26';
    
    const totalUsuariosElement = document.getElementById('totalUsuarios');
    if (totalUsuariosElement) {
        totalUsuariosElement.textContent = '5';
    }
    
    // Esconder elementos específicos para gestor se for colaborador
    const usuarioJSON = localStorage.getItem('usuario');
    const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : {tipo: 'COLABORADOR'};
    if (usuario.tipo !== 'GESTOR') {
        document.querySelectorAll('.gestor-only').forEach(el => {
            el.remove(); // Remove completamente em vez de apenas esconder
        });
    }
});