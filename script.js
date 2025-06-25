const DATA_URL = "https://raw.githubusercontent.com/conyln/BUTTERS/refs/heads/main/datos.json";

async function loadData() {
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error loading JSON:", error);
        return null;
    }
}

// Render the radar chart for stats comparison using Chart.js
function renderStatsComparison(data) {
    const ctx = document.getElementById("statsComparisonChart").getContext("2d");
    const characters = data.characterComparison.map(d => d.character);
    const screenTimes = data.characterComparison.map(d => d.screenTime);
    const lines = data.characterComparison.map(d => d.lines);

    new Chart(ctx, {
        type: "radar",
        data: {
            labels: characters,
            datasets: [
                {
                    label: "Screen Time",
                    data: screenTimes,
                    borderColor: "#fce94f",
                    backgroundColor: "rgba(252, 233, 79, 0.4)",
                    fill: true,
                },
                {
                    label: "Lines",
                    data: lines,
                    borderColor: "#729fcf",
                    backgroundColor: "rgba(114, 159, 207, 0.4)",
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: "#222222",
                        font: {
                            family: "'Atkinson Hyperlegible', monospace",
                        },
                    },
                },
            },
            scales: {
                r: {
                    angleLines: { color: "#222222" },
                    grid: { color: "#bbb" },
                    pointLabels: { color: "#222222", font: { family: "'Atkinson Hyperlegible'" } },
                    ticks: { color: "#222222" },
                },
            },
        },
    });
}

// Render the crimes list with animation and colored backgrounds
function renderCrimes(data) {
    const crimesList = document.getElementById("crimes-list");
    crimesList.innerHTML = "";

    data.crimes.forEach((crime, index) => {
        const div = document.createElement("div");
        div.classList.add("crime-item", `crime-${crime.severity}`);
        div.style.animation = `fadeInUp 0.5s ease forwards`;
        div.style.animationDelay = `${index * 0.2}s`;
        div.innerHTML = `<strong>${crime.crime} (${crime.alias})</strong><br>${crime.description}<br><em>Episode: ${crime.episode}</em>`;
        crimesList.appendChild(div);
    });
}

// Animation keyframes via JS injection (needed for crimes fade in)
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes fadeInUp {
    from {opacity: 0; transform: translateY(20px);}
    to {opacity: 1; transform: translateY(0);}
}`;
document.head.appendChild(styleSheet);

// Main initialization
(async () => {
    const data = await loadData();
    if (!data) return;

    renderStatsComparison(data);
    renderCrimes(data);

    // TODO: add D3.js charts for other sections (role evolution, presence, protagonism)
})();
