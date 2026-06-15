async function carregarDashboard() {
    try {
        // Busca Vendas
        const vendasResponse = await fetch(`${API_URL}/${TABLES.vendas}/?user_field_names=true`, {
            headers: { "Authorization": `Token ${BASEROW_TOKEN}` }
        });
        
        // Busca Despesas
        const despesasResponse = await fetch(`${API_URL}/${TABLES.despesas}/?user_field_names=true`, {
            headers: { "Authorization": `Token ${BASEROW_TOKEN}` }
        });

        const vendas = await vendasResponse.json();
        const despesas = await despesasResponse.json();

        let totalVendas = 0;
        let totalDespesas = 0;

        // Proteção caso a resposta não venha no formato esperado ou vazia
        if (vendas && vendas.results) {
            vendas.results.forEach(v => {
                // Multiplica valor_unitario pela quantidade para ter o real valor total vendido
                const unitario = Number(v.valor_total || v.valor_unitario || 0);
                const qtd = Number(v.quantidade || 1);
                totalVendas += (unitario * qtd);
            });
        }

        if (despesas && despesas.results) {
            despesas.results.forEach(d => {
                totalDespesas += Number(d.valor || 0);
            });
        }

        const lucro = totalVendas - totalDespesas;

        // Atualiza a tela com formatação em Real (R$)
        document.getElementById("vendasTotal").innerHTML = `R$ ${totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        document.getElementById("despesasTotal").innerHTML = `R$ ${totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        const lucroElement = document.getElementById("lucroTotal");
        lucroElement.innerHTML = `R$ ${lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        // Altera a cor do lucro se estiver negativo
        if(lucro >= 0) {
            lucroElement.className = "text-lucro";
        } else {
            lucroElement.className = "text-despesas";
        }

    } catch (error) {
        console.error("Erro ao carregar dados do Dashboard:", error);
    }
}

// Executa automaticamente ao abrir a página
window.onload = carregarDashboard;
