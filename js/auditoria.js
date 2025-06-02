document.addEventListener('DOMContentLoaded', function() {
    // Esconder loading
    document.getElementById('carregandoAuditoria').classList.add('d-none');
    
    // Adicionar eventos aos botões
    const btnExportar = document.getElementById('btnExportar');
    if (btnExportar) {
        btnExportar.addEventListener('click', function() {
            alert('Exportação em desenvolvimento');
        });
    }
    
    const btnFiltrarPeriodo = document.getElementById('btnFiltrarPeriodo');
    if (btnFiltrarPeriodo) {
        btnFiltrarPeriodo.addEventListener('click', function() {
            alert('Filtro por período em desenvolvimento');
        });
    }
    
    // Adicionar evento aos botões de detalhes
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', function() {
            const detalhesModal = new bootstrap.Modal(document.getElementById('detalhesModal'));
            detalhesModal.show();
        });
    });
});

function carregarRegistrosAuditoriaEstaticos() {
    const tabelaAuditoria = document.getElementById('tabelaAuditoria');
    if (!tabelaAuditoria) return;
    
    const registrosEstaticos = [
        {
            dataHora: '05/06/2025 10:15',
            usuario: 'João Silva',
            acao: 'ENTRADA',
            detalhes: 'Entrada de 10 unidades de Notebook Dell'
        },
        {
            dataHora: '04/06/2025 15:30',
            usuario: 'Maria Souza',
            acao: 'SAIDA',
            detalhes: 'Saída de 2 unidades de Monitor 24"'
        },
        {
            dataHora: '03/06/2025 11:45',
            usuario: 'Pedro Gomes',
            acao: 'ENTRADA',
            detalhes: 'Entrada de 5 unidades de Teclado Mecânico'
        },
        {
            dataHora: '02/06/2025 09:20',
            usuario: 'Ana Ferreira',
            acao: 'SAIDA',
            detalhes: 'Saída de 1 unidade de Notebook Dell'
        }
    ];
    
    tabelaAuditoria.innerHTML = '';
    
    registrosEstaticos.forEach(registro => {
        const tr = document.createElement('tr');
        
        if (registro.acao === 'ENTRADA') {
            tr.classList.add('table-success-light');
        } else if (registro.acao === 'SAIDA') {
            tr.classList.add('table-danger-light');
        }
        
        tr.innerHTML = `
            <td>${registro.dataHora}</td>
            <td>${registro.usuario}</td>
            <td>
                <span class="badge ${registro.acao === 'ENTRADA' ? 'bg-success' : 'bg-danger'}">
                    ${registro.acao === 'ENTRADA' ? 'Entrada' : 'Saída'}
                </span>
            </td>
            <td>${registro.detalhes}</td>
            <td>
                <button class="btn btn-sm btn-info view-details">
                    <i class="bi bi-eye"></i>
                </button>
            </td>
        `;
        tabelaAuditoria.appendChild(tr);
    });
    
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', function() {
            const detalhesModal = new bootstrap.Modal(document.getElementById('detalhesModal'));
            
            // Preencher dados estáticos no modal
            document.getElementById('detalheDataHora').textContent = '05/06/2025 10:15';
            document.getElementById('detalheUsuario').textContent = 'João Silva';
            document.getElementById('detalheTipoAcao').textContent = 'Entrada de Produto';
            document.getElementById('detalheDescricao').textContent = 'Entrada de 10 unidades de Notebook Dell';
            
            document.getElementById('secaoDetalheProduto').classList.remove('d-none');
            document.getElementById('detalheProduto').textContent = 'Notebook Dell (ID: 1)';
            
            document.getElementById('secaoDetalheAntes').classList.add('d-none');
            document.getElementById('secaoDetalheDepois').classList.add('d-none');
            
            detalhesModal.show();
        });
    });
}