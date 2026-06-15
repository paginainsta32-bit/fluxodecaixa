async function carregarDashboard(){

const vendasResponse =
await fetch(
`${API_URL}/${TABLES.vendas}/?user_field_names=true`,
{
headers:{
Authorization:`Token ${BASEROW_TOKEN}`
}
});

const despesasResponse =
await fetch(
`${API_URL}/${TABLES.despesas}/?user_field_names=true`,
{
headers:{
Authorization:`Token ${BASEROW_TOKEN}`
}
});

const vendas =
await vendasResponse.json();

const despesas =
await despesasResponse.json();

let totalVendas = 0;
let totalDespesas = 0;

vendas.results.forEach(v=>{

totalVendas +=
Number(v.valor_total || 0);

});

despesas.results.forEach(d=>{

totalDespesas +=
Number(d.valor || 0);

});

const lucro =
totalVendas - totalDespesas;

document.getElementById(
"vendasTotal"
).innerHTML =
`R$ ${totalVendas.toFixed(2)}`;

document.getElementById(
"despesasTotal"
).innerHTML =
`R$ ${totalDespesas.toFixed(2)}`;

document.getElementById(
"lucroTotal"
).innerHTML =
`R$ ${lucro.toFixed(2)}`;

}

carregarDashboard();