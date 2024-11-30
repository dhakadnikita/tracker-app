const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) =>{
        const{ latitude,longitude} = position.coords;
        socket.emit('send-location', { latitude, longitude});
    },
(error) => {
    console.error(error);
},
{
    enableHighAccuracy:true,
    timeout:5000,
    maximumAge:0
})
}

const map = L.map("map").setView([0,0],16);

L.tileLayer("https://{s}.title.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:"OpenStreetMap",
}).addTo(map);

const markers = {};

socket.on("receive-location",(data)=> {
    const {id,lattitude,longitude} = data;
    map.setView([lattitude,longitude],16);
    if(markers[id]){
        markers[id].setLatLng([lattitude, longitude]);
    }
    else{
        markers[id] = L.markers([lattitude,longitude]).addTo(map);
    }
});

socket.on("user-disconnect", (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})