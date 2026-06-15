async function salvarVenda() {
    const produto = document.getElementById("produto").value.trim();
    const quantidade = Number(document.getElementById("quantidade").value);
    const valor = Number(document.getElementById("valor").value);

    if (!produto || !quantidade || !valor) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Pega a data e hora local da máquina atual (evita problemas de fuso horário UTC do ISO)
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const hora = String(agora.getHours()).padStart(2, '0');
    const minuto = String(agora.getMinutes()).padStart(2, '0');
    
    // Formato exato esperado pelo Baserow para campos Date com hora inclusa: "YYYY-MM-DD HH:MM"
    const dataFormatadaBaserow = `${ano}-${mes}-${dia} ${hora}:${minuto}`;

    try {
        const urlLimpa = `${API_URL.replace(/\/$/, "")}/database/rows/table/${TABLES.vendas}/?user_field_names=true`;
        
        const response = await fetch(urlLimpa, {
            method: "POST",
            headers: {
                "Authorization": `Token ${BASEROW_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "data": dataFormatadaBaserow,
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
            const erroDetalhado = await response.json();
            console.error("Erro retornado pelo Baserow:", erroDetalhado);
            
            // Se falhar, tentamos um plano B enviando apenas a data sem a hora
            console.log("Tentando salvamento com formato alternativo...");
            const dataApenas = `${ano}-${mes}-${dia}`;
            
            const responsePlanoB = await fetch(urlLimpa, {
                method: "POST",
                headers: {
                    "Authorization": `Token ${BASEROW_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "data": dataApenas,
                    "produto": produto,
                    "quantidade": quantidade,
                    "valor_unitario": valor
                })
            });

            if (responsePlanoB.ok) {
                alert("Venda cadastrada com sucesso (Formato Alternativo)!");
                document.getElementById("produto").value = "";
                document.getElementById("quantidade").value = "";
                document.getElementById("valor").value = "";
            } else {
                alert("Erro persistente no Baserow. Certifique-se de que a coluna de data permite inserção de texto ou limpe as linhas vazias do seu banco.");
            }
        }
    } catch (error) {
        console.error("Erro na requisição de rede:", error);
        alert("Não foi possível conectar ao servidor do Baserow.");
    }
}
