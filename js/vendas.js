async function salvarVenda() {
    const produto = document.getElementById("produto").value.trim();
    const quantidade = Number(document.getElementById("quantidade").value);
    const valor = Number(document.getElementById("valor").value);

    if (!produto || !quantidade || !valor) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Captura a data e hora locais para preencher o campo combinado do Baserow corretamente
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    const horas = String(hoje.getHours()).padStart(2, '0');
    const minutos = String(hoje.getMinutes()).padStart(2, '0');
    const segundos = String(hoje.getSeconds()).padStart(2, '0');
    
    // Formato final aceito por campos Date + Time: "YYYY-MM-DD HH:MM:SS"
    const dataHoraLocal = `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;

    try {
        const urlLimpa = `${API_URL.replace(/\/$/, "")}/database/rows/table/${TABLES.vendas}/?user_field_names=true`;
        
        const response = await fetch(urlLimpa, {
            method: "POST",
            headers: {
                "Authorization": `Token ${BASEROW_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "data": dataHoraLocal,
                "produto": produto,
                "quantidade": quantidade,
                "valor_unitario": valor
            })
        });

        if (response.ok) {
            alert("Venda cadastrada com sucesso!");
            document.getElementById("produto").value = "";
            document.getElementById("quantidade").value = "";
            document.getElementById("valor").value = "";
        } else {
            const erroCorpo = await response.json();
            console.error("Erro Baserow Vendas:", erroCorpo);
            alert("Erro ao salvar. Verifique se os nomes das colunas no Baserow são exatamente: data, produto, quantidade e valor_unitario.");
        }
    } catch (error) {
        console.error("Erro na conexão:", error);
        alert("Não foi possível conectar ao servidor.");
    }
}
