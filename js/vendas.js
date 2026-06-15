async function salvarVenda() {
    const produtoInput = document.getElementById("produto").value.trim();
    const quantidadeInput = Number(document.getElementById("quantidade").value);
    const valorInput = Number(document.getElementById("valor").value);

    if (!produtoInput || !quantidadeInput || !valorInput) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Pega a data atual no formato padrão (AAAA-MM-DD)
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    const dataFormatada = `${ano}-${mes}-${dia}`; 

    // Criamos um mapa de dados que envia tanto variações em minúsculo quanto maiúsculo
    // O Baserow vai ler o campo que ele reconhecer e ignorar os que não existem na tabela
    const dadosParaEnviar = {
        "data": dataFormatada,
        "Data": dataFormatada,
        "DATA": dataFormatada,
        
        "produto": produtoInput,
        "Produto": produtoInput,
        "PRODUTO": produtoInput,
        
        "quantidade": quantidadeInput,
        "Quantidade": quantidadeInput,
        "QUANTIDADE": quantidadeInput,
        "qtd": quantidadeInput,
        
        "valor_unitario": valorInput,
        "Valor_Unitario": valorInput,
        "valor": valorInput,
        "Valor": valorInput,
        "VALOR": valorInput
    };

    try {
        // Garante a montagem limpa da URL da tabela do Baserow
        const urlLimpa = `${API_URL.replace(/\/$/, "")}/database/rows/table/${TABLES.vendas}/?user_field_names=true`;
        
        const response = await fetch(urlLimpa, {
            method: "POST",
            headers: {
                "Authorization": `Token ${BASEROW_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosParaEnviar)
        });

        if (response.ok) {
            alert("Venda cadastrada com sucesso!");
            // Limpa os campos do formulário para o próximo lançamento
            document.getElementById("produto").value = "";
            document.getElementById("quantidade").value = "";
            document.getElementById("valor").value = "";
        } else {
            // Se o Baserow rejeitar, vamos ler a resposta exata do servidor para entender qual campo quebrou
            const erroDetalhado = await response.json();
            console.error("Resposta de erro do Baserow:", erroDetalhado);
            
            alert(`Erro na estrutura da tabela.\n\nVerifique se as colunas na sua tabela do Baserow se chamam exatamente: data, produto, quantidade e valor_unitario.`);
        }
    } catch (error) {
        console.error("Erro de conexão na requisição:", error);
        alert("Não foi possível estabelecer conexão com o servidor do Baserow.");
    }
}
