async function login() {

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    try {

        const response = await fetch(
            `${API_URL}/${TABLES.usuarios}/?user_field_names=true`,
            {
                headers: {
                    Authorization: `Token ${BASEROW_TOKEN}`
                }
            }
        );

        const data = await response.json();

        const usuario = data.results.find(u =>
            String(u["email"]).trim() === email &&
            String(u["senha"]).trim() === senha
        );

        if (usuario) {

            localStorage.setItem(
                "usuario",
                JSON.stringify(usuario)
            );

            window.location.href = "dashboard.html";

        } else {

            document.getElementById("msg").innerHTML =
                "Usuário ou senha inválidos";

        }

    } catch (erro) {

        console.error("Erro:", erro);

        document.getElementById("msg").innerHTML =
            "Erro ao conectar com o servidor";

    }

}
