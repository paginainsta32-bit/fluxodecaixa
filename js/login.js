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

        // Garante a construção exata da URL do Baserow sem barras duplicadas ou caminhos quebrados
        const urlLimpa = `${API_URL.replace(/\/$/, "")}/database/rows/table/${TABLES.usuarios}/?user_field_names=true`;

        const response = await fetch(urlLimpa, {
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

        // Procura o usuário ignorando maiúsculas/minúsculas e espaços extras
        const usuario = data.results.find(u =>
            String(u["email"]).trim().toLowerCase() === email.toLowerCase() &&
            String(u["senha"]).trim() === senha
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
