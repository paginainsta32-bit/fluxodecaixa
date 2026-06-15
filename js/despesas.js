async function salvarDespesa() {
    const descricao = document.getElementById("descricao").value.trim();
    const valor = Number(document.getElementById("valor").value);

    if (!descricao || !valor) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${TABLES.despesas}/?user_field_names=true`, {
            method: "POST",
            headers: {
                "Authorization": `Token ${BASEROW_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: new Date().toISOString().split("T")[0],
                descricao: descricao,
                valor: valor
            })
        });

        if (response.ok) {
            alert("Despesa cadastrada com sucesso!");
            document.getElementById("descricao").value = "";
            document.getElementById("valor").value = "";
        } else {
            alert("Erro ao salvar no servidor. Verifique as configurações do Baserow.");
        }
    } catch (error) {
        console.error("Erro ao salvar despesa:", error);
        alert("Erro de conexão com o servidor.");
    }
}
