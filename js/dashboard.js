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

    // Busca todos os dados do Baserow uma única vez para processar rápido
    await buscarDadosDoServidor();
    
    // Processa o filtro inicial (que é o dia de hoje)
    calcularEExibirDados();
}

async function buscarDadosDoServidor() {
    try {
        // Puxa as vendas (aumentando o limite para garantir que pegue o mês/dia completo)
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
        // Muda os títulos textuais da tela
        const dataFormatada = dataSelecionada.split('-').reverse().join('/');
        document.getElementById("tituloPeriodo").innerText = `Resumo do Dia`;
        document.getElementById("subtituloPeriodo").innerText = `Analisando a data: ${dataFormatada}`;

        // Filtra Vendas do dia específico
        dadosGlobais.vendas.forEach(v => {
            if (v.data === dataSelecionada) {
                const unitario = Number(v.valor_total || v.valor_unitario || 0);
                const qtd = Number(v.quantidade || 1);
                totalVendas += (unitario * qtd);
            }
        });

        // Filtra Despesas do dia específico
        dadosGlobais.despesas.forEach(d => {
            if (d.data === dataSelecionada) {
                totalDespesas += Number(d.valor || 0);
            }
        });

    } else if (tipoFiltroAtual === 'mes') {
        const nomeMes = document.getElementById("filtroMes").options[document.getElementById("filtroMes").selectedIndex].text;
        document.getElementById("tituloPeriodo").innerText = `Fechamento Mensal`;
        document.getElementById("subtituloPeriodo").innerText = `Analisando o mês de ${nomeMes} de ${anoSelecionado}`;

        // Filtra Vendas do mês e ano selecionados
        dadosGlobais.vendas.forEach(v => {
            if (v.data) {
                const [ano, mes, dia] = v.data.split('-');
                if (ano === anoSelecionado && mes === mesSelecionado) {
                    const unitario = Number(v.valor_total || v.valor_unitario || 0);
                    const qtd = Number(v.quantidade || 1);
                    totalVendas += (unitario * qtd);
                }
            }
        });

        // Filtra Despesas do mês e ano selecionados
        dadosGlobais.despesas.forEach(d => {
            if (d.data) {
                const [ano, mes, dia] = d.data.split('-');
                if (ano === anoSelecionado && mes === mesSelecionado) {
                    totalDespesas += Number(d.valor || 0);
                }
            }
        });
    }

    // Calcula o balanço final (Apurado menos o Gasto)
    const lucro = totalVendas - totalDespesas;

    // Joga os valores formatados em moeda real R$ de volta pra tela
    document.getElementById("vendasTotal").innerHTML = `R$ ${totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById("despesasTotal").innerHTML = `R$ ${totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    const lucroElement = document.getElementById("lucroTotal");
    lucroElement.innerHTML = `R$ ${lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    // Altera a cor do texto do lucro de forma inteligente (Verde se deu lucro, vermelho se fechou negativo)
    if (lucro >= 0) {
        lucroElement.className = "text-lucro";
    } else {
        lucroElement.className = "text-despesas";
    }
}

// Inicialização automática do sistema ao abrir a página
window.onload = iniciarDashboard;
