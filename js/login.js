async function login() {

    const response = await fetch(
        `${API_URL}/${TABLES.usuarios}/?user_field_names=true`,
        {
            headers: {
                Authorization: `Token ${BASEROW_TOKEN}`
            }
        }
    );

    const data = await response.json();

    alert(JSON.stringify(data, null, 2));

}
