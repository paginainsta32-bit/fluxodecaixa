async function login() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const msgElement = document.getElementById("msg");

    if (!email || !senha) {
        if (msgElement) msgElement.innerHTML = "Por favor, preencha todos os campos!";
        return;
    }

    try {
        if (msgElement) msgElement.innerHTML = "Verificando...";

        // Monta a URL exata usando as variáveis globais do config.js
        const urlLimpa = `${API_URL.replace(/\/$/, "")}/${TABLES.usuarios}/?user_field_names=true`;

        const response = await fetch(urlLimpa, {
            method: "GET",
            headers: {
                "Authorization": `Token ${BASEROW_TOKEN}`
            }
        });

        if (!response.ok) {
            console.error("Erro na resposta do servidor. Status:", response.status);
            if (msgElement) msgElement.innerHTML = "Erro de resposta do servidor Baserow.";
            return;
        }

        const data = await response.json();

        // Garante que o 'results' existe para não estourar erro no console do navegador
        const listaUsuarios = data.results || [];

        if (listaUsuarios.length === 0) {
            if (msgElement) msgElement.innerHTML = "Nenhum usuário localizado ou token sem permissão.";
            console.warn("A API não retornou a lista de resultados em 'results':", data);
            return;
        }

        // Procura o usuário cadastrado correspondente
        const usuario = listaUsuarios.find(u =>
            u && u["email"] && String(u["email"]).trim().toLowerCase() === email.toLowerCase() &&
            u["senha"] && String(u["senha"]).trim() === senha
        );

        if (usuario) {
            localStorage.setItem("usuario", JSON.stringify(usuario));
            window.location.href = "dashboard.html";
        } else {
            if (msgElement) msgElement.innerHTML = "Usuário ou senha inválidos";
        }

    } catch (erro) {
        console.error("Erro completo na requisição de login:", erro);
        if (msgElement) msgElement.innerHTML = "Erro ao conectar com o servidor";
    }
}
