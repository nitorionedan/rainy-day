const today = new Date();
const defaultZoomLvl = 16;

let map = undefined;
let currentLatLng = {
    lat: 0,
    lng: 0
};
let opponentLatLng = undefined;
let marker = undefined;

const hours = () => {
    // 表示する桁数を2桁へ調整
    return ("00" + today.getHours()).slice(-2);
}

const minutes = () => {
    // 表示する桁数を2桁へ調整
    return ("00" + today.getMinutes()).slice(-2);    
}

window.onload = () => {
    // URL経度緯度パラメータを解析
    const url = location.href;
    paramLatLng = url.substring(url.indexOf("#") + 1, url.length);
    const lat = parseFloat(paramLatLng.split("/")[0]);
    const lng = parseFloat(paramLatLng.split("/")[1]);
    if (!isNaN(lat) && !isNaN(lng)) {
        opponentLatLng = [lat, lng];
    }
    else {
        opponentLatLng = undefined;
    }

    // Leafletマップオブジェクトを作成
    map = L.map("map", {doubleClickZoom: false});
    
    // 現在地を地図で表示
    map.locate({setView: true, maxZoom: defaultZoomLvl});

    // タイルレイヤーを設定
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: defaultZoomLvl,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    L.Control.geocoder().addTo(map);

    // 現在地にピン
    map.once("locationfound", (e) => {
        if (!marker) {
            marker = L.marker(e.latlng).addTo(map);
        } else {
            marker.setLatLng(e.latlng).addTo(map);
        }

        // 現在地情報を控える
        currentLatLng = {lat: e.latlng.lat, lng: e.latlng.lng};

        // ピンに現在時刻を表示
        marker.bindPopup(`現在地<br>${hours()}:${minutes()}`).openPopup();
    });

    if (!navigator.geolocation) {
        console.log("Error: Geolocation機能がありません。");
    } else {
        setInterval(() => {
            navigator.geolocation.getCurrentPosition(getPosition);
        }, 5000);
    }
};

function quickStart(map) {
    // 現在地にピン
    map.once("locationfound", (e) => {
        let marker;
        if (!marker) {
            marker = L.marker(e.latlng).addTo(map);
        } else {
            marker.setLatLng(e.latlng).addTo(map);
        }

        // 現在地情報を控える
        currentLatLng = {lat: e.latlng.lat, lng: e.latlng.lng};

        // ピンに現在時刻を表示
        marker.bindPopup(`現在地<br>${hours()}:${minutes()}`).openPopup();
    });

    // debug
    if (opponentLatLng != undefined) {
        L.marker(opponentLatLng).bindPopup("相手の現在地").addTo(map);
    }
}

function initShareButton() {
    const btn = document.getElementById("share-button");
    btn.addEventListener("click", async () => {
        const shareData = {
            title: "現在地を共有",
            text: `経度緯度(${currentLatLng.lat}, ${currentLatLng.lng}), 時刻(${hours()}:${minutes()})`,
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

function getPosition(position) {
    if (marker){
        map.removeLayer(marker);
    }

    marker = L.marker([
        position.coords.latitude, 
        position.coords.longitude
    ]).addTo(map);
}