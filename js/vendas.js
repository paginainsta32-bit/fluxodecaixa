async function salvarVenda() {
    const produto = document.getElementById("produto").value.trim();
    const quantidade = Number(document.getElementById("quantidade").value);
    const valor = Number(document.getElementById("valor").value);

    if (!produto || !quantidade || !valor) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Gera os dois formatos para garantir compatibilidade com o tipo de coluna do Baserow
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    
    // Tenta enviar o formato ISO padrão que o Baserow prefere em campos Date nativos
    const dataFormatada = `${ano}-${mes}-${dia}`;

    try {
        const urlLimpa = `${API_URL.replace(/\/$/, "")}/database/rows/table/${TABLES.vendas}/?user_field_names=true`;
        
        const response = await fetch(urlLimpa, {
            method: "POST",
            headers: {
                "Authorization": `Token ${BASEROW_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "data": dataFormatada,
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
            // Se o Baserow rejeitar por causa do formato de data nativa (ex: se for campo de texto), tenta o formato BR
            const dataBR = `${dia}/${mes}/${ano}`;
            const retryResponse = await fetch(urlLimpa, {
                method: "POST",
                headers: {
                    "Authorization": `Token ${BASEROW_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "data": dataBR,
                    "produto": produto,
                    "quantidade": quantidade,
                    "valor_unitario": valor
                })
            });

            if (retryResponse.ok) {
                alert("Venda cadastrada com sucesso!");
                document.getElementById("produto").value = "";
                document.getElementById("quantidade").value = "";
                document.getElementById("valor").value = "";
            } else {
                const erroCorpo = await retryResponse.json();
                console.error("Erro Baserow Vendas:", erroCorpo);
                alert("Erro ao salvar. Verifique se as colunas no Baserow se chamam: data, produto, quantidade e valor_unitario.");
            }
        }
    } catch (error) {
        console.error("Erro na conexão:", error);
        alert("Não foi possível conectar ao servidor.");
    }
}
