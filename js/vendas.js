async function salvarVenda() {
    const produto = document.getElementById("produto").value.trim();
    const quantidade = Number(document.getElementById("quantidade").value);
    const valor = Number(document.getElementById("valor").value);

    if (!produto || !quantidade || !valor) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Pega a data de hoje local do navegador (evita problemas de fuso horário)
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    const dataFormatada = `${ano}-${mes}-${dia}`; // Formato padrão YYYY-MM-DD

    try {
        const response = await fetch(`${API_URL}/${TABLES.vendas}/?user_field_names=true`, {
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
            alert("Erro ao salvar a venda no Baserow.");
        }
    } catch (error) {
        console.error("Erro ao salvar venda:", error);
        alert("Erro de conexão.");
    }
}
