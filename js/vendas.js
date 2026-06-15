async function salvarVenda() {
    const produto = document.getElementById("produto").value.trim();
    const quantidade = Number(document.getElementById("quantidade").value);
    const valor = Number(document.getElementById("valor").value);

    if (!produto || !quantidade || !valor) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    const dataFormatada = `${ano}-${mes}-${dia}`; 

    try {
        const urlDestino = `${API_URL.replace(/\/$/, "")}/database/rows/table/${TABLES.vendas}/?user_field_names=true`;
        
        const response = await fetch(urlDestino, {
            method: "POST",
            headers: {
                "Authorization": `Token ${BASEROW_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: dataFormatada,
                produto: produto,
                quantidade: quantidade,
                valor_unitario: valor
            })
        });

        if (response.ok) {
            alert("Venda cadastrada com sucesso!");
            document.getElementById("produto").value = "";
            document.getElementById("quantidade").value = "";
            document.getElementById("valor").value = "";
        } else {
            alert("Erro do Baserow ao registrar. Verifique o nome dos campos na sua tabela.");
        }
    } catch (error) {
        console.error("Erro na conexão da venda:", error);
        alert("Não foi possível conectar ao servidor.");
    }
}
