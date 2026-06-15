async function salvarVenda(){

const produto =
document.getElementById("produto").value;

const quantidade =
Number(
document.getElementById("quantidade").value
);

const valor =
Number(
document.getElementById("valor").value
);

await fetch(
`${API_URL}/${TABLES.vendas}/?user_field_names=true`,
{
method:"POST",

headers:{
Authorization:`Token ${BASEROW_TOKEN}`,
"Content-Type":"application/json"
},

body:JSON.stringify({

data:new Date()
.toISOString()
.split("T")[0],

produto:produto,

quantidade:quantidade,

valor_unitario:valor

})
});

alert("Venda cadastrada");
}