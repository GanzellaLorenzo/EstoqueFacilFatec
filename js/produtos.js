async function carregarProdutos() {
    try {
        if (!Utils.validarAutenticacao()) return;

        document.getElementById('carregandoProdutos').classList.remove('d-none');
        document.getElementById('nenhumProduto').classList.add('d-none');
        
        const produtos = await Utils.fetchAPI('/produtos');
        
        const tabelaProdutos = document.getElementById('tabelaProdutos');
        const mostrarInativos = document.getElementById('mostrarInativos')?.checked || false;
        
        document.getElementById('carregandoProdutos').classList.add('d-none');
        
        const produtosFiltrados = mostrarInativos 
            ? produtos 
            : produtos.filter(produto => produto.ativo); 
            
        if (produtosFiltrados.length === 0) {
            document.getElementById('nenhumProduto').classList.remove('d-none');
            return;
        }

        tabelaProdutos.innerHTML = '';
        
        produtosFiltrados.forEach(produto => {
            const tr = document.createElement('tr');
            
            if (!produto.ativo) {
                tr.classList.add('table-secondary');
            }
            
            tr.innerHTML = `
                <td>${produto.prodNome}</td>
                <td>${produto.prodDescricao || '-'}</td>
                <td>R$ ${produto.prodPrecoCompra ? parseFloat(produto.prodPrecoCompra).toFixed(2) : '-'}</td>
                <td>R$ ${parseFloat(produto.prodPrecoVenda).toFixed(2)}</td>
                <td>${produto.quantidade}</td>
                <td>
                    ${produto.ativo ? `
                    <button class="btn btn-sm btn-success gerar-movimentacao" data-id="${produto.prodId}" data-nome="${produto.prodNome}" data-estoque="${produto.quantidade}">
                        <i class="bi bi-arrow-left-right"></i>
                    </button>
                    ` : ''}
                    <a href="editar.html?id=${produto.prodId}" class="btn btn-sm btn-primary">
                        <i class="bi bi-pencil"></i>
                    </a>
                    <button class="btn btn-sm ${produto.ativo ? 'btn-danger' : 'btn-success'} toggle-status" data-id="${produto.prodId}" data-status="${produto.ativo}">
                        <i class="bi bi-${produto.ativo ? 'trash' : 'arrow-counterclockwise'}"></i>
                    </button>
                </td>
            `;
            tabelaProdutos.appendChild(tr);
        });
        
        adicionarEventListenersBotoes();
    } catch (error) {
        Utils.handleError(error, 'Erro ao carregar produtos');
        document.getElementById('carregandoProdutos').classList.add('d-none');
    }
}

function adicionarEventListenersBotoes() {
    document.querySelectorAll('.toggle-status').forEach(btn => {
        btn.addEventListener('click', function() {
            const prodId = this.getAttribute('data-id');
            const isAtivo = this.getAttribute('data-status') === 'true';
            const mensagem = isAtivo 
                ? 'Tem certeza que deseja desativar este produto?' 
                : 'Deseja reativar este produto?';
            
            if (confirm(mensagem)) {
                toggleStatusProduto(prodId, !isAtivo);
            }
        });
    });
    
    document.querySelectorAll('.gerar-movimentacao').forEach(btn => {
        btn.addEventListener('click', function() {
            const prodId = this.getAttribute('data-id');
            const prodNome = this.getAttribute('data-nome');
            const estoque = parseInt(this.getAttribute('data-estoque'));
            
            document.getElementById('movProdutoId').value = prodId;
            document.getElementById('movProdutoNome').textContent = prodNome;
            document.getElementById('movEstoqueAtual').textContent = estoque;
            document.getElementById('movQuantidade').value = '';
            document.getElementById('movTipo').value = '';
            document.getElementById('movEstoqueFinal').textContent = '-';
            
            const movimentacaoModal = new bootstrap.Modal(document.getElementById('movimentacaoModal'));
            movimentacaoModal.show();
        });
    });
}

async function toggleStatusProduto(id, novoStatus) {
    try {
        const produto = await Utils.fetchAPI(`/produtos/${id}`);
        
        produto.ativo = novoStatus;
        
        await Utils.fetchAPI(`/produtos/${id}`, 'PUT', produto);
        
        Utils.notifications.success(`Produto ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`);
        carregarProdutos();
        
    } catch (error) {
        Utils.handleError(error, 'Erro ao atualizar status do produto');
    }
}

async function excluirProduto(id) {
    try {
        const token = localStorage.getItem('token');
        const tipoToken = localStorage.getItem('tipoToken');
        
        const response = await fetch(`${API_URL}/produtos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `${tipoToken} ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir produto');
        }

        alert('Produto excluído com sucesso!');
        carregarProdutos();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir produto. Tente novamente.');
    }
}

async function salvarProduto(produto, isEditing = false) {
    try {
        if (!produto.prodNome || !produto.prodPrecoVenda) {
            throw new Error('Preencha todos os campos obrigatórios');
        }
        
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        
        produto.usuario = {
            userId: usuario.id
        };
        
        const endpoint = isEditing 
            ? `/produtos/${produto.prodId}` 
            : `/produtos`;
            
        const method = isEditing ? 'PUT' : 'POST';
        
        return await Utils.fetchAPI(endpoint, method, produto);
    } catch (error) {
        Utils.handleError(error, 'Erro ao salvar produto');
        throw error;
    }
}

async function carregarProduto(id) {
    try {
        const token = localStorage.getItem('token');
        const tipoToken = localStorage.getItem('tipoToken');
        
        const response = await fetch(`${API_URL}/produtos/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `${tipoToken} ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar dados do produto');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar dados do produto. Tente novamente.');
        window.location.href = 'listar.html';
    }
}

function atualizarEstoqueFinal() {
    const estoqueAtual = parseInt(document.getElementById('movEstoqueAtual').textContent);
    const quantidade = parseInt(document.getElementById('movQuantidade').value) || 0;
    const tipo = document.getElementById('movTipo').value;
    
    let estoqueFinal = estoqueAtual;
    
    if (tipo === 'ENTRADA') {
        estoqueFinal += quantidade;
        document.getElementById('quantidadeMax').textContent = '';
        document.getElementById('movQuantidade').removeAttribute('max');
    } else if (tipo === 'SAIDA') {
        estoqueFinal -= quantidade;
        document.getElementById('quantidadeMax').textContent = `Máximo: ${estoqueAtual}`;
        document.getElementById('movQuantidade').setAttribute('max', estoqueAtual);
    }
    
    document.getElementById('movEstoqueFinal').textContent = 
        (estoqueFinal >= 0) ? estoqueFinal : 'Estoque insuficiente';
    
    if (estoqueFinal < 0) {
        document.getElementById('movEstoqueFinal').classList.add('text-danger');
        document.getElementById('btnConfirmarMovimentacao').disabled = true;
    } else {
        document.getElementById('movEstoqueFinal').classList.remove('text-danger');
        document.getElementById('btnConfirmarMovimentacao').disabled = false;
    }
}

async function registrarMovimentacao() {
    try {
        const produtoId = document.getElementById('movProdutoId').value;
        const tipo = document.getElementById('movTipo').value;
        const quantidade = parseInt(document.getElementById('movQuantidade').value);
        
        if (!tipo || !quantidade || quantidade <= 0) {
            Utils.notifications.warning('Por favor, preencha todos os campos corretamente.');
            return;
        }
        
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        
        const movimentacao = {
            acao: tipo,
            produto: {
                prodId: parseInt(produtoId)
            },
            quantidade: quantidade,
            usuario: {
                userId: parseInt(usuario.id)
            }
        };
        
        console.log('Enviando movimentação:', movimentacao);
        
        await Utils.fetchAPI('/acoes', 'POST', movimentacao);
        
        const movimentacaoModal = bootstrap.Modal.getInstance(document.getElementById('movimentacaoModal'));
        movimentacaoModal.hide();
        
        Utils.notifications.success('Movimentação registrada com sucesso!');
        
        carregarProdutos();
        
    } catch (error) {
        Utils.handleError(error, 'Erro ao registrar movimentação');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Verifica se está na página de listagem de produtos
    if (window.location.href.includes('listar.html') || window.location.href.includes('produtosColaborador.html')) {
        // Esconder elementos de loading
        const loadingElement = document.getElementById('carregandoProdutos');
        if (loadingElement) {
            loadingElement.classList.add('d-none');
        }
        
        // Adicionar eventos aos botões
        const checkboxInativo = document.getElementById('mostrarInativos');
        if (checkboxInativo) {
            checkboxInativo.addEventListener('change', function() {
                window.location.reload();
            });
        }
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const rows = document.querySelectorAll('#tabelaProdutos tr');
                
                rows.forEach(row => {
                    const nome = row.querySelector('td:first-child').textContent.toLowerCase();
                    const descricao = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                    
                    if (nome.includes(searchTerm) || descricao.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        }
        
        // Eventos para botões de ação
        document.querySelectorAll('.toggle-status').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Deseja alterar o status deste produto?')) {
                    alert('Status alterado com sucesso!');
                }
            });
        });
        
        document.querySelectorAll('.gerar-movimentacao').forEach(btn => {
            btn.addEventListener('click', function() {
                const prodId = this.getAttribute('data-id');
                const prodNome = this.getAttribute('data-nome');
                const estoque = parseInt(this.getAttribute('data-estoque'));
                
                document.getElementById('movProdutoId').value = prodId;
                document.getElementById('movProdutoNome').textContent = prodNome;
                document.getElementById('movEstoqueAtual').textContent = estoque;
                document.getElementById('movQuantidade').value = '';
                document.getElementById('movTipo').value = '';
                document.getElementById('movEstoqueFinal').textContent = '-';
                
                const movimentacaoModal = new bootstrap.Modal(document.getElementById('movimentacaoModal'));
                movimentacaoModal.show();
            });
        });
        
        // Evento para confirmar movimentação
        const btnConfirmarMovimentacao = document.getElementById('btnConfirmarMovimentacao');
        if (btnConfirmarMovimentacao) {
            btnConfirmarMovimentacao.addEventListener('click', function() {
                alert('Movimentação realizada com sucesso!');
                const movimentacaoModal = bootstrap.Modal.getInstance(document.getElementById('movimentacaoModal'));
                if (movimentacaoModal) movimentacaoModal.hide();
            });
        }
    }
    
    // Verifica se está na página de cadastro/edição de produto
    if (window.location.href.includes('cadastrar.html')) {
        const produtoForm = document.getElementById('produtoForm');
        if (produtoForm) {
            produtoForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Produto salvo com sucesso!');
                window.location.href = 'listar.html';
            });
        }
    }
    
    // Adicionar eventos para atualização de estoque final
    const movTipo = document.getElementById('movTipo');
    const movQuantidade = document.getElementById('movQuantidade');
    if (movTipo && movQuantidade) {
        const atualizarEstoqueFinal = function() {
            const estoqueAtual = parseInt(document.getElementById('movEstoqueAtual').textContent || 0);
            const quantidade = parseInt(movQuantidade.value || 0);
            const tipo = movTipo.value;
            
            let estoqueFinal = estoqueAtual;
            if (tipo === 'ENTRADA') {
                estoqueFinal += quantidade;
            } else if (tipo === 'SAIDA') {
                estoqueFinal -= quantidade;
            }
            
            document.getElementById('movEstoqueFinal').textContent = estoqueFinal;
        };
        
        movTipo.addEventListener('change', atualizarEstoqueFinal);
        movQuantidade.addEventListener('input', atualizarEstoqueFinal);
    }
});