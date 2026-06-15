async function salvarDespesa() {
    const descricao = document.getElementById("descricao").value.trim();
    const valor = Number(document.getElementById("valor").value);

    if (!descricao || !valor) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Solução da Data: Mesma correção de fuso horário local para o campo Date + Time do Baserow
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; 
    const dataLocalISO = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');

    try {
        const urlLimpa = `${API_URL.replace(/\/$/, "")}/database/rows/table/${TABLES.despesas}/?user_field_names=true`;

        const response = await fetch(urlLimpa, {
            method: "POST",
            headers: {
                "Authorization": `Token ${BASEROW_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "data": dataLocalISO,
                "descricao": descricao,
                "valor": valor
            })
        });

        if (response.ok) {
            alert("Despesa cadastrada com sucesso!");
            document.getElementById("descricao").value = "";
            document.getElementById("valor").value = "";
        } else {
            const erroCorpo = await response.json();
            console.error("Erro Baserow:", erroCorpo);
            alert("Erro ao salvar a despesa. Verifique as colunas da tabela.");
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
        alert("Erro de conexão com o servidor.");
    }
}
