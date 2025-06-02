document.addEventListener('DOMContentLoaded', function() {
    // Verifica se está na página de listagem
    if (window.location.href.includes('listar.html')) {
        // Esconder loading
        document.getElementById('carregandoColaboradores').classList.add('d-none');
        
        // Adicionar eventos
        const checkboxInativo = document.getElementById('mostrarInativos');
        if (checkboxInativo) {
            checkboxInativo.addEventListener('change', function() {
                window.location.reload();
            });
        }
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                console.log('Busca por:', searchInput.value);
            });
        }
        
        // Eventos para botões de ação
        document.querySelectorAll('.toggle-status').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Deseja alterar o status deste colaborador?')) {
                    alert('Status alterado com sucesso!');
                }
            });
        });
    }
    
    // Verifica se está na página de cadastro/edição
    if (window.location.href.includes('cadastrar.html') || window.location.href.includes('editar.html')) {
        const colaboradorForm = document.getElementById('colaboradorForm');
        if (colaboradorForm) {
            colaboradorForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Colaborador salvo com sucesso!');
                window.location.href = 'listar.html';
            });
        }
    }
});