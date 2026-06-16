async function salvarDespesa() {
    const descricao = document.getElementById("descricao").value.trim();
    const valor = Number(document.getElementById("valor").value);

    if (!descricao || !valor) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    
    const dataFormatada = `${ano}-${mes}-${dia}`;

    try {
        const urlLimpa = `${API_URL.replace(/\/$/, "")}/database/rows/table/${TABLES.despesas}/?user_field_names=true`;

        const response = await fetch(urlLimpa, {
            method: "POST",
            headers: {
                "Authorization": `Token ${BASEROW_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "data": dataFormatada,
                "descricao": descricao,
                "valor": valor
            })
        });

        if (response.ok) {
            alert("Despesa cadastrada com sucesso!");
            document.getElementById("descricao").value = "";
            document.getElementById("valor").value = "";
        } else {
            // Segunda tentativa usando formato brasileiro caso a coluna seja do tipo texto simples
            const dataBR = `${dia}/${mes}/${ano}`;
            const retryResponse = await fetch(urlLimpa, {
                method: "POST",
                headers: {
                    "Authorization": `Token ${BASEROW_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "data": dataBR,
                    "descricao": descricao,
                    "valor": valor
                })
            });

            if (retryResponse.ok) {
                alert("Despesa cadastrada com sucesso!");
                document.getElementById("descricao").value = "";
                document.getElementById("valor").value = "";
            } else {
                const erroCorpo = await retryResponse.json();
                console.error("Erro Baserow Despesas:", erroCorpo);
                alert("Erro ao salvar a despesa. Verifique se as colunas no Baserow se chamam: data, descricao e valor.");
            }
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
        alert("Erro de conexão com o servidor.");
    }
}
