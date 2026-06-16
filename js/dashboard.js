let dadosGlobais = { vendas: [], despesas: [] };
let tipoFiltroAtual = 'dia'; 

async function iniciarDashboard() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    
    if (document.getElementById("filtroData")) document.getElementById("filtroData").value = `${ano}-${mes}-${dia}`;
    if (document.getElementById("filtroMes")) document.getElementById("filtroMes").value = mes;
    if (document.getElementById("filtroAno")) document.getElementById("filtroAno").value = ano;

    await buscarDadosDoServidor();
    calcularEExibirDados();
}

async function buscarDadosDoServidor() {
    try {
        const urlVendas = `${API_URL.replace(/\/$/, "")}/database/rows/table/${TABLES.vendas}/?user_field_names=true&size=1000`;
        const urlDespesas = `${API_URL.replace(/\/$/, "")}/database/rows/table/${TABLES.despesas}/?user_field_names=true&size=1000`;

        const vendasResponse = await fetch(urlVendas, { headers: { "Authorization": `Token ${BASEROW_TOKEN}` } });
        const despesasResponse = await fetch(urlDespesas, { headers: { "Authorization": `Token ${BASEROW_TOKEN}` } });

        if (vendasResponse.ok && despesasResponse.ok) {
            const vendasDados = await vendasResponse.json();
            const despesasDados = await despesasResponse.json();
            dadosGlobais.vendas = vendasDados.results || [];
            dadosGlobais.despesas = despesasDados.results || [];
        }
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}

function alternarFiltro(tipo) {
    tipoFiltroAtual = tipo;
    calcularEExibirDados();
}

// Reconhece e normaliza de forma inteligente qualquer string de data (seja BR ou ISO) para AAAA-MM-DD
function normalizarData(dataString) {
    if (!dataString) return "";
    
    // Remove horas e minutos se existirem na string
    let apenasData = dataString.trim().split(" ")[0].split("T")[0];
    
    if (apenasData.includes("/")) {
        const partes = apenasData.split("/");
        // Se já estiver como AAAA/MM/DD
        if (partes[0].length === 4) {
            return `${partes[0]}-${partes[1]}-${partes[2]}`;
        }
        // Converte DD/MM/AAAA para AAAA-MM-DD
        return `${partes[2]}-${partes[1]}-${partes[0]}`; 
    }
    return apenasData;
}

function calcularEExibirDados() {
    let totalVendas = 0;
    let totalDespesas = 0;

    const dataSelecionada = document.getElementById("filtroData") ? document.getElementById("filtroData").value : ""; 
    const mesSelecionado = document.getElementById("filtroMes") ? document.getElementById("filtroMes").value : ""; 
    const anoSelecionado = document.getElementById("filtroAno") ? document.getElementById("filtroAno").value : ""; 

    if (tipoFiltroAtual === 'dia') {
        const dataFormatada = dataSelecionada.split('-').reverse().join('/');
        if (document.getElementById("tituloPeriodo")) document.getElementById("tituloPeriodo").innerText = `Resumo do Dia`;
        if (document.getElementById("subtituloPeriodo")) document.getElementById("subtituloPeriodo").innerText = `Analisando a data: ${dataFormatada}`;

        // Calcula Vendas Validadas
        dadosGlobais.vendas.forEach(v => {
            if (!v.produto && !v.Produto) return; 
            
            const dataRegistro = normalizarData(v.data || v.Data || v.DATA);
            if (dataRegistro === dataSelecionada) {
                const total = Number(v.valor_total || v.Valor_Total || 0);
                const unitario = Number(v.valor_unitario || v.Valor_Unitario || 0);
                const qtd = Number(v.quantidade || v.Quantidade || 1);
                
                totalVendas += (total > 0) ? total : (unitario * qtd);
            }
        });

        // Calcula Despesas Validadas
        dadosGlobais.despesas.forEach(d => {
            const dataRegistro = normalizarData(d.data || d.Data || d.DATA);
            if (dataRegistro === dataSelecionada) {
                totalDespesas += Number(d.valor || d.Valor || 0);
            }
        });

    } else if (tipoFiltroAtual === 'mes') {
        const comboMes = document.getElementById("filtroMes");
        const nomeMes = comboMes ? comboMes.options[comboMes.selectedIndex].text : "";
        if (document.getElementById("tituloPeriodo")) document.getElementById("tituloPeriodo").innerText = `Fechamento Mensal`;
        if (document.getElementById("subtituloPeriodo")) document.getElementById("subtituloPeriodo").innerText = `Analisando o mês de ${nomeMes} de ${anoSelecionado}`;

        dadosGlobais.vendas.forEach(v => {
            if (!v.produto && !v.Produto) return; 
            
            const dataRegistro = normalizarData(v.data || v.Data || v.DATA);
            if (dataRegistro) {
                const [ano, mes, dia] = dataRegistro.split('-');
                if (ano === anoSelecionado && mes === mesSelecionado) {
                    const total = Number(v.valor_total || v.Valor_Total || 0);
                    const unitario = Number(v.valor_unitario || v.Valor_Unitario || 0);
                    const qtd = Number(v.quantidade || v.Quantidade || 1);
                    
                    totalVendas += (total > 0) ? total : (unitario * qtd);
                }
            }
        });

        dadosGlobais.despesas.forEach(d => {
            const dataRegistro = normalizarData(d.data || d.Data || d.DATA);
            if (dataRegistro) {
                const [ano, mes, dia] = dataRegistro.split('-');
                if (ano === anoSelecionado && mes === mesSelecionado) {
                    totalDespesas += Number(d.valor || d.Valor || 0);
                }
            }
        });
    }

    const lucro = totalVendas - totalDespesas;

    if (document.getElementById("vendasTotal")) {
        document.getElementById("vendasTotal").innerHTML = `R$ ${totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (document.getElementById("despesasTotal")) {
        document.getElementById("despesasTotal").innerHTML = `R$ ${totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    const lucroElement = document.getElementById("lucroTotal");
    if (lucroElement) {
        lucroElement.innerHTML = `R$ ${lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        lucroElement.className = (lucro >= 0) ? "text-lucro" : "text-despesas";
    }
}

window.onload = iniciarDashboard;
