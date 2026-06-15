async function salvarVenda() {
    const produto = document.getElementById("produto").value.trim();
    const quantidade = Number(document.getElementById("quantidade").value);
    const valor = Number(document.getElementById("valor").value);

    if (!produto || !quantidade || !valor) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${TABLES.vendas}/?user_field_names=true`, {
            method: "POST",
            headers: {
                "Authorization": `Token ${BASEROW_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: new Date().toISOString().split("T")[0],
                produto: produto,
                quantidade: quantidade,
                valor_unitario: valor
            })
        });

        if (response.ok) {
            alert("Venda cadastrada com sucesso!");
            // Limpa os campos
            document.getElementById("produto").value = "";
            document.getElementById("quantidade").value = "";
            document.getElementById("valor").value = "";
        } else {
            alert("Erro ao salvar a venda.");
        }
    } catch (error) {
        console.error("Erro ao salvar venda:", error);
        alert("Erro de conexão.");
    }
}
