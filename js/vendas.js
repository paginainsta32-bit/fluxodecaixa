async function salvarVenda() {
    const produto = document.getElementById("produto").value.trim();
    const quantidade = Number(document.getElementById("quantidade").value);
    const valor = Number(document.getElementById("valor").value);

    if (!produto || !quantidade || !valor) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Solução da Data: Cria o formato ISO corrigindo o fuso horário local para o Baserow aceitar o campo Date + Time
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; 
    const dataLocalISO = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');

    try {
        const urlLimpa = `${API_URL.replace(/\/$/, "")}/database/rows/table/${TABLES.vendas}/?user_field_names=true`;
        
        const response = await fetch(urlLimpa, {
            method: "POST",
            headers: {
                "Authorization": `Token ${BASEROW_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "data": dataLocalISO,
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
            console.error("Erro Baserow:", erroCorpo);
            alert("Erro ao salvar. Certifique-se de que os nomes das colunas são data, produto, quantidade e valor_unitario.");
        }
    } catch (error) {
        console.error("Erro na conexão:", error);
        alert("Não foi possível conectar ao servidor.");
    }
}
