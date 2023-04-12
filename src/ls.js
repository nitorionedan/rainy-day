function quickStart() {
    // Leafletマップオブジェクトを作成
    var sendaiPoint = [38.26764, 140.87366];
    let map = L.map("map").setView(sendaiPoint, 14);

    // タイルレイヤーを設定
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // ピンを地図に追加
    let marker = L.marker(sendaiPoint).addTo(map);
    marker.bindPopup("ok").openPopup();

    // 円を地図に追加
    let circle = L.circle(sendaiPoint, {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map);

    // ポリゴンを地図に追加
    let polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ]).addTo(map);

    let popup = L.popup();
    map.on("click", (e) => {
        console.log("at " + e.latlng);
        popup.setLatLng(e.latlng)
            .setContent(e.latlng.lat.toString())
            .openOn(map);
    });
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
            resultPara.textContent = "Shared successfully";
        } catch (err) {
            resultPara.textContent = `Error: ${err}`;
        }
    });
}

quickStart();
initShareButton();