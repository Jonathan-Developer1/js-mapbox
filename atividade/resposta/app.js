var map;
const centralLatLong = [-43.9397233, -19.9332786]; // Ponto central do mapa (Belo Horizonte).

async function buscarLocais() {
    var locais;

    await fetch("https://c67b7f93-3f2a-494e-9a7c-a410930d6f58-00-24egakakh3bds.kirk.replit.dev/locais")
        .then((resposta) => resposta.json())
        .then((json) => {
            locais = json;
        });

    return locais;
}

// Função que carrega os dados de unidades da PUC Minas:
window.onload = async () => {
    var locaisCadastradosNoReplit = await buscarLocais();
    montarMapa(locaisCadastradosNoReplit);
}

function montarMapa(locais) {
    // Defina o Access Token do Mapbox:
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9tbWVsY2FybmVpcm8tcHVjIiwiYSI6ImNsb3ZuMTBoejBsd2gyamwzeDZzcWl5b3oifQ.VPWc3qoyon8Z_-URfKpvKg';
    map = new mapboxgl.Map({
        container: 'map', // O container do mapa.
        style: 'mapbox://styles/mapbox/streets-v12', // Estilo do mapa.
        center: centralLatLong, // Localização central do mapa
        zoom: 9 // Zoom inicial.
    });

    // Adiciona marcadores para cada local:
    locais.forEach(local => {
        let popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>
                        <a href="${local.url}" target="_blank">
                          ${local.descricao}
                        </a>
                      </h3>
                      <br>${local.endereco} 
                      <br> ${local.cidade}`);

        const marker = new mapboxgl.Marker({ color: local.cor })
            .setLngLat(local.latlong)
            .setPopup(popup)
            .addTo(map);
    });

    // Obtém a localização do usuário e adiciona um marcador:
    navigator.geolocation.getCurrentPosition(processarGetCurrentPosition, () => { alert('Erro ao obter localização.') });
}

// Função para processar a localização do usuário:
function processarGetCurrentPosition(local) {
    let popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3> Estou aqui!!! </h3>`);

    const marker = new mapboxgl.Marker({ color: 'yellow' })
        .setLngLat([local.coords.longitude, local.coords.latitude])
        .setPopup(popup)
        .addTo(map);
}

function processar() {
    const nome = document.getElementById("nome").value.trim();
    const latitude = document.getElementById("latitude").value.trim();
    const longitude = document.getElementById("longitude").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const cor = document.getElementById("cor").value;

    var local = {
        "nome": nome,
        "descricao": descricao,
        "endereco": endereco,
        "favorito": true,
        "cidade": nome,
        "latlong": [
            latitude,
            longitude
        ],
        "url": "informar",
        "cor": cor
    };

    processarPosicao(local);
}

// Função para processar a localização:
function processarPosicao(local) {
    let popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3>${local.cidade}</h3>
                  ${local.descricao}<br>
                  ${local.endereco}`);

    const marker = new mapboxgl.Marker({ color: local.cor })
        .setLngLat([local.latlong[1], local.latlong[0]])
        .setPopup(popup)
        .addTo(map);
}
