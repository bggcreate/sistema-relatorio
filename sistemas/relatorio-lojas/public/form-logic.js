// lógica do formulário de relatório.
// tanto pela página principal quanto pela janela Live.

function setupForm() {
    // Encontra os elementos do formulário na página em que o script foi carregado
    const form = document.getElementById('form-relatorio');
    if (!form) return; // Se não houver formulário na página, não faz nada

    const selectLoja = document.getElementById('loja');
    const funcaoEspecialContainer = document.getElementById('funcao-especial-container');
    const labelFuncaoEspecial = document.getElementById('label-funcao-especial');
    const nomeFuncaoEspecialInput = document.getElementById('nome_funcao_especial');
    const vendedoresContainer = document.getElementById('vendedores-container');

    // Função para carregar as lojas do banco de dados via API
    async function carregarLojas() {
        try {
            const response = await fetch('/api/lojas');
            const lojas = await response.json();
            selectLoja.innerHTML = '<option value="" disabled selected>Selecione a loja</option>';
            lojas.forEach(loja => {
                const option = document.createElement('option');
                option.value = loja.nome;
                option.textContent = loja.nome;
                option.dataset.funcao = loja.funcao_especial || '';
                selectLoja.appendChild(option);
            });
        } catch (e) {
            selectLoja.innerHTML = '<option value="" disabled selected>Erro ao carregar lojas</option>';
        }
    }

    // Mostra/esconde o campo de função especial baseado na loja selecionada
    function handleLojaChange() {
        const selectedOption = selectLoja.options[selectLoja.selectedIndex];
        if (!selectedOption) return;
        const nomeFuncao = selectedOption.dataset.funcao;
        if (nomeFuncao) {
            labelFuncaoEspecial.textContent = nomeFuncao;
            nomeFuncaoEspecialInput.value = nomeFuncao;
            funcaoEspecialContainer.style.display = 'block';
        } else {
            funcaoEspecialContainer.style.display = 'none';
            nomeFuncaoEspecialInput.value = '';
        }
    }
    
    // Calcula o total de vendas (Cartão + PIX + Dinheiro)
    function calcularTotalVendas() {
        const total = ['vendas_cartao', 'vendas_pix', 'vendas_dinheiro']
            .reduce((acc, id) => acc + (parseInt(document.getElementById(id).value) || 0), 0);
        document.getElementById('total_vendas').value = total;
    }
    
    // Adiciona uma nova linha para um vendedor
    window.adicionarVendedor = function() {
        const newVendedorRow = document.createElement('div');
        newVendedorRow.className = 'row g-2 align-items-center mb-2 vendedor-row';
        newVendedorRow.innerHTML = `<div class="col-5"><input type="text" class="form-control form-control-sm" placeholder="Nome" required></div><div class="col-3"><input type="number" class="form-control form-control-sm" placeholder="Atend." required></div><div class="col-3"><input type="number" class="form-control form-control-sm" placeholder="Vendas" required></div><div class="col-1"><button type="button" class="btn btn-danger btn-sm py-0 px-2" onclick="this.closest('.vendedor-row').remove()">X</button></div>`;
        vendedoresContainer.appendChild(newVendedorRow);
    };
    
    // Prepara os dados dos vendedores para serem enviados com o formulário
    form.addEventListener('submit', (e) => {
        const vendedores = [];
        document.querySelectorAll('.vendedor-row').forEach(row => {
            const inputs = row.querySelectorAll('input');
            if(inputs[0].value) { // Só adiciona se o nome for preenchido
                vendedores.push({ nome: inputs[0].value, atendimentos: inputs[1].value, vendas: inputs[2].value });
            }
        });
        document.getElementById('vendedores-json').value = JSON.stringify(vendedores);
    });
    
    // Conecta os eventos aos elementos
    selectLoja.addEventListener('change', handleLojaChange);
    ['vendas_cartao', 'vendas_pix', 'vendas_dinheiro'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calcularTotalVendas);
    });
    
    // Funções de inicialização
    carregarLojas();
    calcularTotalVendas();
}

// Garante que o DOM esteja pronto antes de executar a lógica
document.addEventListener('DOMContentLoaded', setupForm);