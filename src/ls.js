const today = new Date();

let currentLatLng = {
    lat: 0,
    lng: 0
};

let opponentLatLng = undefined;

const hours = () => {
    // 表示する桁数を2桁へ調整
    return ("00" + today.getHours()).slice(-2);
}

const minutes = () => {
    // 表示する桁数を2桁へ調整
    return ("00" + today.getMinutes()).slice(-2);    
}

window.onload = () => {
    let url = location.href;
    paramLatLng = url.substring(url.indexOf("#") + 1, url.length);
    let lat = parseFloat(paramLatLng.split("/")[0]);
    let lng = parseFloat(paramLatLng.split("/")[1]);
    console.log(`${lat.toString()}, ${lng.toString()}`);

    if (!isNaN(lat) && !isNaN(lng)) {
        opponentLatLng = [lat, lng];
    }
    else {
        opponentLatLng = undefined;
    }

    quickStart();
    initShareButton();
};

function quickStart() {
    // Leafletマップオブジェクトを作成
    let map = L.map("map", {doubleClickZoom: false});

    // 現在地を地図で表示
    map.locate({setView: true, maxZoom: 7});

    // 現在地にピン
    map.on("locationfound", (e) => {
        let marker;
        if (!marker) {
            marker = L.marker(e.latlng).addTo(map);
        } else {
            marker.setLatLng(e.latlng).addTo(map);
        }

        // 現在地情報を控える
        currentLatLng = {lat: e.latlng.lat, lng: e.latlng.lng};
        console.log(currentLatLng);

        // ピンに現在時刻を表示
        marker.bindPopup(`現在地<br>${hours()}:${minutes()}`).openPopup();
    });

    // debug
    if (opponentLatLng != undefined) {
        L.marker(opponentLatLng).bindPopup("相手の現在地").addTo(map);
    }

    // タイルレイヤーを設定
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

function initShareButton() {
    const btn = document.getElementById("shareButton");
    btn.addEventListener("click", async () => {
        const shareData = {
            title: "現在地を共有",
            text: `経度緯度(${currentLatLng.lat}, ${currentLatLng.lng}), 時刻(${hours()}:${minutes()})`,
            // url: `https://www.openstreetmap.org/#map=7/${currentLatLng.lat}/${currentLatLng.lng}`,
            // url: `https://www.openstreetmap.org/search?query=${currentLatLng.lat}%2C${currentLatLng.lng}#map=7/${currentLatLng.lat}/${currentLatLng.lng}`,
            url: `https://rainyseason-rainy-days.netlify.app/ls.html#${currentLatLng.lat}/${currentLatLng.lng}`
        };
    
        try {
            await navigator.share(shareData);
            console.log("Shared successfully");
        } catch (err) {
            console.log(`Error: ${err}`);
        }
    });
}