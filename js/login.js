async function login(){

const email =
document.getElementById("email").value;

const senha =
document.getElementById("senha").value;

const response = await fetch(
`${API_URL}/${TABLES.usuarios}/?user_field_names=true`,
{
headers:{
Authorization:`Token ${BASEROW_TOKEN}`
}
});

const data = await response.json();

const usuario =
data.results.find(u =>
u["e-mail"] === email &&
u["senha"] === senha
);

if(usuario){

localStorage.setItem(
"usuario",
JSON.stringify(usuario)
);

window.location =
"dashboard.html";

}else{

document.getElementById("msg")
.innerHTML =
"Usuário ou senha inválidos";

}

}