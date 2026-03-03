
const VALID_USER = "admin";
const VALID_PASS = "1234";

function handleLogin() {
    const userInp = document.getElementById('username').value;
    const passInp = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');

    if (userInp === VALID_USER && passInp === VALID_PASS) {
    
        window.location.href = "dashboard.html";
    } else {
        errorMsg.innerText = "Invalid credentials! Try admin / 1234";
    }
}

function logout() {
    window.location.href = "index.html";
}
let audio = document.getElementById("myAudio");

function playMusic() {
    audio.play();
}

function pauseMusic() {
    audio.pause();
}

function changeVolume(val) {
    audio.volume = val;
}

async function connectBT() {
    const connInterface = document.getElementById('connection-interface');
    const musicInterface = document.getElementById('music-interface');
    
    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [
                { namePrefix: 'ESP32' }, 
                { namePrefix: 'Sync' }   
            ],
        
            optionalServices: ['battery_service', 'heart_rate'] 
        });

        console.log("Found device:", device.name);
        
        const server = await device.gatt.connect();

       
        connInterface.style.display = "none";
        musicInterface.style.display = "block";
        
        device.addEventListener('gattserverdisconnected', onDisconnected);

    } catch (error) {
        console.error("Connection failed:", error);
        alert("Bluetooth Error: " + error.message);
    }
}

function onDisconnected(event) {
    const device = event.target;
    console.log('Device ' + device.name + ' is disconnected.');
    disconnectBT(); 
}

setInterval(() => {
    
    const temp = (Math.random() * (26 - 22) + 22).toFixed(1);
    if(document.getElementById('temp')) document.getElementById('temp').innerText = temp + "°C";

    const cpu = Math.floor(Math.random() * 10) + 10;
    if(document.getElementById('cpu-load')) document.getElementById('cpu-load').innerText = cpu + "%";
}, 3000); 

let ledState = false;
function toggleLED() {
    ledState = !ledState;
    const btn = document.getElementById('led-btn');
    btn.innerText = ledState ? "ON" : "OFF";
    btn.style.background = ledState ? "#28a745" : "#dc3545";
}

const imageFiles = [
    '10ef58da6b3201ac2b28fbd3ba86fa4a.jpg',
    'Asphalt 8 Air.jpg',
    'Audi RS7 Wallpaper.jpg',
    'Mclaren P1.jpg',
    'Porsche Taycan Turbo s.jpg',
    'wp6442345-porsche-911-carrera-gts-hd-wallpapers.jpg',
];

const sliderTrack = document.getElementById('image-slider');
const slideInterval = 5000; 


function loadImages() {
    imageFiles.forEach((filename) => {
        const img = document.createElement('img');
        img.src = `images/${filename}`; 
        img.alt = "Instagram Post";
        sliderTrack.appendChild(img);
    });
}

let currentIndex = 0;

function startSlideshow() {
    
    if (imageFiles.length === 0) return;

    setInterval(() => {
        currentIndex++;
        
        if (currentIndex >= imageFiles.length) {
            // Instant jump back to start for loop
            sliderTrack.style.transition = 'none';
            currentIndex = 0;
            sliderTrack.style.transform = `translateX(0)`;
            
            setTimeout(() => {
                sliderTrack.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            }, 50);
        } else {
            sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }, slideInterval);
}

loadImages();
startSlideshow();

const ctxLine = document.getElementById('rssiChart').getContext('2d');
const rssiChart = new Chart(ctxLine, {
    type: 'line',
    data: {
        labels: ['1s', '2s', '3s', '4s', '5s', '6s'],
        datasets: [{
            label: 'Signal (dBm)',
            data: [-65, -59, -80, -81, -56, -55],
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: false }, x: { display: false } }
    }
});


const ctxPie = document.getElementById('devicePieChart').getContext('2d');
new Chart(ctxPie, {
    type: 'doughnut',
    data: {
        labels: ['ESP32', 'Sensors', 'Actuators'],
        datasets: [{
            data: [4, 12, 7],
            backgroundColor: ['#4f46e5', '#3b82f6', '#10b981'],
            borderWidth: 0
        }]
    },
    options: {
        cutout: '70%',
        plugins: { legend: { position: 'bottom' } }
    }
});

// Simulate Live Data Update for Line Chart
setInterval(() => {
    rssiChart.data.datasets[0].data.shift();
    rssiChart.data.datasets[0].data.push(Math.floor(Math.random() * ( -50 - (-90) ) + (-90)));
    rssiChart.update();
}, 2000);
function updateSignalUI(rssi) {
    const dot = document.getElementById('rssi-dot');
    const label = document.getElementById('rssi-label');
    const valText = document.getElementById('rssi-value');
    const bar = document.getElementById('rssi-bar');

    valText.innerText = `${rssi} dBm`;

   
    if (rssi >= -60) {
        label.innerText = "Excellent";
        label.style.color = "#10b981"; // Green
        dot.style.background = "#10b981";
        bar.style.background = "#10b981";
        bar.style.width = "95%";
    } else if (rssi >= -80) {
        label.innerText = "Fair";
        label.style.color = "#f59e0b"; // Amber
        dot.style.background = "#f59e0b";
        bar.style.background = "#f59e0b";
        bar.style.width = "60%";
    } else {
        label.innerText = "Poor";
        label.style.color = "#ef4444"; // Red
        dot.style.background = "#ef4444";
        bar.style.background = "#ef4444";
        bar.style.width = "30%";
    }
}


setInterval(() => {
   
    const mockRSSI = Math.floor(Math.random() * (-40 - (-100) + 1) + (-100));
    updateSignalUI(mockRSSI);
    
   
    if (rssiChart) {
        rssiChart.data.datasets[0].data.shift();
        rssiChart.data.datasets[0].data.push(mockRSSI);
        rssiChart.update();
    }
}, 3000);
