async function salvarDespesa(){

const descricao =
document.getElementById("descricao").value;

const valor =
Number(
document.getElementById("valor").value
);

await fetch(
`${API_URL}/${TABLES.despesas}/?user_field_names=true`,
{
method:"POST",

headers:{
Authorization:`Token ${BASEROW_21WDS4cSz6izrJsEfUzRblsIdtj9DCF5}`,
"Content-Type":"application/json"
},

body:JSON.stringify({

data:new Date()
.toISOString()
.split("T")[0],

descricao:descricao,

valor:valor

})
});

alert("Despesa cadastrada");
}