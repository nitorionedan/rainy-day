let currentLatLng = [0, 0];

function quickStart() {
    // Leafletマップオブジェクトを作成
    // var sendaiPoint = [38.268223, 140.869415];
    // let map = L.map("map").setView(sendaiPoint, 7);

    // 現在地を地図で表示
    let map = L.map("map", {doubleClickZoom: false});
    map.locate({setView: true, maxZoom: 7});

    // 現在地にピン
    let marker;
    map.on("locationfound", (e) => {
        if (!marker) {
            marker = L.marker(e.latlng).addTo(map);
        } else {
            marker.setLatLng(e.latlng).addTo(map);
        }

        marker.bindPopup(e.latlng.toString()).openPopup();
    });

    // タイルレイヤーを設定
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

function initShareButton() {
    const shareData = {
        title: "Current Address",
        text: "LatLng(xxx, yyy)",
        url: "https://developer.mozilla.org",
    };

    const btn = document.getElementById("shareButton");
    const resultPara = document.getElementById("shareResult");

    btn.addEventListener("click", async () => {
        try {
            await navigator.share(shareData);
            console.log("Shared successfully");
        } catch (err) {
            console.log(`Error: ${err}`);
        }
    });
}

quickStart();
initShareButton();