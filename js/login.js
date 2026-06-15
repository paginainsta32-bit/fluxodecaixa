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

        console.log("RESPOSTA BASEROW:");
        console.log(data);

        const usuario = data.results.find(u =>
            String(u["e-mail"]).trim() === email &&
            String(u["senha"]).trim() === senha
        );

        if (usuario) {

            localStorage.setItem(
                "usuario",
                JSON.stringify(usuario)
            );

            alert("Login realizado!");

            window.location.href = "dashboard.html";

        } else {

            document.getElementById("msg").innerHTML =
                "Usuário ou senha inválidos";

        }

    } catch (erro) {

        console.error(erro);

        document.getElementById("msg").innerHTML =
            "Erro ao conectar ao Baserow";

    }

}
