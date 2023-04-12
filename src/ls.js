function leafletOnMoblie() {

}

function pinTokyo() {
    const point = [35.6895, 139.6917];
    const map = L.map("map").setView(point, 13);
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    const marker = L.marker(point).addTo(map);
    marker.bindPopup("<b>東京都</b><br>日本").openPopup();
}

function onLocationFound(e) {
    var radiius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are witihin" + radiius + "meters from this point").openPopup();

    L.circle(e.latlng, radiius).addTo(map);
}

leafletOnMoblie();
const map = L.map("map").fitWorld();
const tileLayperOpt = {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
};
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            tileLayperOpt).addTo(map);
map.locate({setView: true, maxZoom: 16});
map.on("locationfound", onLocationFound);