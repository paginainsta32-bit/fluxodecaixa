// Variável global para armazenar todos os dados brutos vindos do Baserow
let dadosGlobais = { vendas: [], despesas: [] };
let tipoFiltroAtual = 'dia'; // pode ser 'dia' ou 'mes'

// Função executada assim que a página abre
async function iniciarDashboard() {
    // Define a data de hoje nos campos da tela para começar atualizado
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    
    document.getElementById("filtroData").value = `${ano}-${mes}-${dia}`;
    document.getElementById("filtroMes").value = mes;
    document.getElementById("filtroAno").value = ano;

    // Busca todos os dados do Baserow
    await buscarDadosDoServidor();
    
    // Processa o filtro inicial (que é o dia de hoje)
    calcularEExibirDados();
}

async function buscarDadosDoServidor() {
    try {
        // Puxa as vendas
        const vendasResponse = await fetch(`${API_URL}/${TABLES.vendas}/?user_field_names=true&size=1000`, {
            headers: { "Authorization": `Token ${BASEROW_TOKEN}` }
        });
        
        // Puxa as despesas
        const despesasResponse = await fetch(`${API_URL}/${TABLES.despesas}/?user_field_names=true&size=1000`, {
            headers: { "Authorization": `Token ${BASEROW_TOKEN}` }
        });

        const vendasDados = await vendasResponse.json();
        const despesasDados = await despesasResponse.json();

        dadosGlobais.vendas = vendasDados.results || [];
        dadosGlobais.despesas = despesasDados.results || [];

    } catch (error) {
        console.error("Erro ao conectar com o Baserow:", error);
    }
}

function alternarFiltro(tipo) {
    tipoFiltroAtual = tipo;
    calcularEExibirDados();
}

function calcularEExibirDados() {
    let totalVendas = 0;
    let totalDespesas = 0;

    const dataSelecionada = document.getElementById("filtroData").value; // Formato: YYYY-MM-DD
    const mesSelecionado = document.getElementById("filtroMes").value; // Formato: MM
    const anoSelecionado = document.getElementById("filtroAno").value; // Formato: YYYY

    if (tipoFiltroAtual === 'dia') {
        const dataFormatada = dataSelecionada.split('-').reverse().join('/');
        document.getElementById("tituloPeriodo").innerText = `Resumo do Dia`;
        document.getElementById("subtituloPeriodo").innerText = `Analisando a data: ${dataFormatada}`;

        // Filtra Vendas do dia específico (tolerante a maiúsculas/minúsculas no nome da coluna)
        dadosGlobais.vendas.forEach(v => {
            const dataRegistro = v.data || v.Data || v.DATA || "";
            if (dataRegistro === dataSelecionada) {
                const total = Number(v.valor_total || v.Valor_Total || 0);
                const unitario = Number(v.valor_unitario || v.Valor_Unitario || v.valor || v.Valor || 0);
                const qtd = Number(v.quantidade || v.Quantidade || v.qtd || v.Qtd || 1);
                
                if (total > 0) {
                    totalVendas += total;
                } else {
                    totalVendas += (unitario * qtd);
                }
            }
        });

        // Filtra Despesas do dia específico
        dadosGlobais.despesas.forEach(d => {
            const dataRegistro = d.data || d.Data || d.DATA || "";
            if (dataRegistro === dataSelecionada) {
                totalDespesas += Number(d.valor || d.Valor || d.valor_total || 0);
            }
        });

    } else if (tipoFiltroAtual === 'mes') {
        const nomeMes = document.getElementById("filtroMes").options[document.getElementById("filtroMes").selectedIndex].text;
        document.getElementById("tituloPeriodo").innerText = `Fechamento Mensal`;
        document.getElementById("subtituloPeriodo").innerText = `Analisando o mês de ${nomeMes} de ${anoSelecionado}`;

        // Filtra Vendas do mês e ano selecionados
        dadosGlobais.vendas.forEach(v => {
            const dataRegistro = v.data || v.Data || v.DATA || "";
            if (dataRegistro) {
                const [ano, mes, dia] = dataRegistro.split('-');
                if (ano === anoSelecionado && mes === mesSelecionado) {
                    const total = Number(v.valor_total || v.Valor_Total || 0);
                    const unitario = Number(v.valor_unitario || v.Valor_Unitario || v.valor || v.Valor || 0);
                    const qtd = Number(v.quantidade || v.Quantidade || v.qtd || v.Qtd || 1);
                    
                    if (total > 0) {
                        totalVendas += total;
                    } else {
                        totalVendas += (unitario * qtd);
                    }
                }
            }
        });

        // Filtra Despesas do mês e ano selecionados
        dadosGlobais.despesas.forEach(d => {
            const dataRegistro = d.data || d.Data || d.DATA || "";
            if (dataRegistro) {
                const [ano, mes, dia] = dataRegistro.split('-');
                if (ano === anoSelecionado && mes === mesSelecionado) {
                    totalDespesas += Number(d.valor || d.Valor || d.valor_total || 0);
                }
            }
        });
    }

    // Calcula o balanço final
    const lucro = totalVendas - totalDespesas;

    // Atualiza o painel com formatação em Real (R$)
    document.getElementById("vendasTotal").innerHTML = `R$ ${totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById("despesasTotal").innerHTML = `R$ ${totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    const lucroElement = document.getElementById("lucroTotal");
    lucroElement.innerHTML = `R$ ${lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    if (lucro >= 0) {
        lucroElement.className = "text-lucro";
    } else {
        lucroElement.className = "text-despesas";
    }
}

// Inicialização automática do sistema ao abrir a página
window.onload = iniciarDashboard;
