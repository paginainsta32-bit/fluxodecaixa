async function salvarDespesa() {
    const descricao = document.getElementById("descricao").value.trim();
    const valor = Number(document.getElementById("valor").value);

    if (!descricao || !valor) {
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
        const urlLimpa = `${API_URL.replace(/\/$/, "")}/database/rows/table/${TABLES.despesas}/?user_field_names=true`;

        const response = await fetch(urlLimpa, {
            method: "POST",
            headers: {
                "Authorization": `Token ${BASEROW_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "data": dataHoraLocal,
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
            console.error("Erro Baserow Despesas:", erroCorpo);
            alert("Erro ao salvar a despesa. Verifique se os nomes das colunas no Baserow são exatamente: data, descricao e valor.");
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
        alert("Erro de conexão com o servidor.");
    }
}
