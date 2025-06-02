async function login(email, senha) {
    try {
        document.getElementById('loginError').classList.add('d-none');
        
        console.log('Tentando login com email:', email);
        
        let response = await fetch(`${Utils.API_URL}/gestores/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, senha: senha })
        });

        if (response.ok) {
            const gestor = await response.json();
            console.log('Login como gestor bem-sucedido:', gestor);
            
            localStorage.setItem('usuario', JSON.stringify({
                id: gestor.userId,
                nome: gestor.nomeGestor,
                email: gestor.emailGestor,
                empresa: gestor.empresaGestor,
                tipo: 'GESTOR'
            }));
            
            localStorage.setItem('token', gestor.token || 'Bearer-token');
            localStorage.setItem('tipoToken', 'Bearer');
            
            window.location.href = 'dashboard.html';
            return;
        }

        response = await fetch(`${Utils.API_URL}/colaboradores/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, senha: senha })
        });

        if (response.ok) {
            const colaborador = await response.json();
            console.log('Login como colaborador bem-sucedido:', colaborador);
            
            localStorage.setItem('usuario', JSON.stringify({
                id: colaborador.userId,
                nome: colaborador.nomeColaborador,
                email: colaborador.emailColaborador,
                gestorId: colaborador.gestor.userId,
                tipo: 'COLABORADOR'
            }));
            
            localStorage.setItem('token', colaborador.token || 'Bearer-token');
            localStorage.setItem('tipoToken', 'Bearer');
            
            window.location.href = 'painelColaborador/dashboardColaborador.html';
            return;
        }

        console.error('Falha no login: credenciais inválidas');
        document.getElementById('loginError').classList.remove('d-none');
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        document.getElementById('loginError').classList.remove('d-none');
    }
}

function verificarAutenticacao() {
    return Utils.validarAutenticacao();
}


document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            
            // Login extremamente simplificado - se contém "gestor" no email, é gestor
            const isGestor = email.includes('gestor');
            
            // Armazenar dados mínimos no localStorage
            localStorage.setItem('usuario', JSON.stringify({
                nome: isGestor ? 'Usuário Gestor' : 'Usuário Colaborador',
                empresa: 'Empresa Exemplo',
                tipo: isGestor ? 'GESTOR' : 'COLABORADOR'
            }));
            
            // Redirecionar para a página apropriada
            window.location.href = isGestor ? 'dashboard.html' : 'painelColaborador/dashboardColaborador.html';
        });
    }
    
    // Botão de logout no sidebar
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Deseja realmente sair?')) {
                localStorage.removeItem('usuario');
                window.location.href = Components.getBasePath() + 'index.html';
            }
        });
    }
});


