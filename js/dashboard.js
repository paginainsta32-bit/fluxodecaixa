let dadosGlobais = { vendas: [], despesas: [] };
let tipoFiltroAtual = 'dia'; 

async function iniciarDashboard() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    
    document.getElementById("filtroData").value = `${ano}-${mes}-${dia}`;
    document.getElementById("filtroMes").value = mes;
    document.getElementById("filtroAno").value = ano;

    await buscarDadosDoServidor();
    calcularEExibirDados();
}

async function buscarDadosDoServidor() {
    try {
        const vendasResponse = await fetch(`${API_URL}/${TABLES.vendas}/?user_field_names=true&size=1000`, {
            headers: { "Authorization": `Token ${BASEROW_TOKEN}` }
        });
        
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

// Função auxiliar para padronizar qualquer tipo de data para YYYY-MM-DD
function normalizarData(dataString) {
    if (!dataString) return "";
    let stringLimpa = dataString.split("T")[0].trim(); // Remove horas se houver
    
    // Se a data vier no formato DD/MM/AAAA converte para AAAA-MM-DD
    if (stringLimpa.includes("/")) {
        const partes = stringLimpa.split("/");
        if (partes[0].length === 4) return stringLimpa.replace(/\//g, "-"); // Caso venha YYYY/MM/DD
        return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    return stringLimpa;
}

function calcularEExibirDados() {
    let totalVendas = 0;
    let totalDespesas = 0;

    const dataSelecionada = document.getElementById("filtroData").value; 
    const mesSelecionado = document.getElementById("filtroMes").value; 
    const anoSelecionado = document.getElementById("filtroAno").value; 

    if (tipoFiltroAtual === 'dia') {
        const dataFormatada = dataSelecionada.split('-').reverse().join('/');
        document.getElementById("tituloPeriodo").innerText = `Resumo do Dia`;
        document.getElementById("subtituloPeriodo").innerText = `Analisando a data: ${dataFormatada}`;

        // Soma Vendas do Dia
        dadosGlobais.vendas.forEach(v => {
            const dataRegistro = normalizarData(v.data || v.Data || v.DATA);
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

        // Soma Despesas do Dia
        dadosGlobais.despesas.forEach(d => {
            const dataRegistro = normalizarData(d.data || d.Data || d.DATA);
            if (dataRegistro === dataSelecionada) {
                totalDespesas += Number(d.valor || d.Valor || d.valor_total || 0);
            }
        });

    } else if (tipoFiltroAtual === 'mes') {
        const nomeMes = document.getElementById("filtroMes").options[document.getElementById("filtroMes").selectedIndex].text;
        document.getElementById("tituloPeriodo").innerText = `Fechamento Mensal`;
        document.getElementById("subtituloPeriodo").innerText = `Analisando o mês de ${nomeMes} de ${anoSelecionado}`;

        // Soma Vendas do Mês
        dadosGlobais.vendas.forEach(v => {
            const dataRegistro = normalizarData(v.data || v.Data || v.DATA);
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

        // Soma Despesas do Mês
        dadosGlobais.despesas.forEach(d => {
            const dataRegistro = normalizarData(d.data || d.Data || d.DATA);
            if (dataRegistro) {
                const [ano, mes, dia] = dataRegistro.split('-');
                if (ano === anoSelecionado && mes === mesSelecionado) {
                    totalDespesas += Number(d.valor || d.Valor || d.valor_total || 0);
                }
            }
        });
    }

    const lucro = totalVendas - totalDespesas;

    // Renderiza na tela
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

window.onload = iniciarDashboard;
