// script.js

// URL del JSON externo
const DATA_URL =
  "https://raw.githubusercontent.com/conyln/BUTTERS/refs/heads/main/datos.json";

// Cargar datos y ejecutar renderizadores
fetch(DATA_URL)
  .then((response) => response.json())
  .then((data) => {
    renderRoleEvolution(data.roleEvolution);
    renderPresencePerSeason(data.presenceBySeason);
    renderProtagonismComparison(
      data.presenceBySeason,
      data.characterComparison
    );
    renderStatsComparison(data.characterComparison);
    renderCrimes(data.crimes);
  })
  .catch((error) => console.error("Error loading JSON:", error));

// Línea de tiempo (evolución del rol)
function renderRoleEvolution(roleData) {
  const svg = d3.select("#roleEvolutionChart");
  const width = 600;
  const height = 200;
  svg.attr("width", width).attr("height", height);

  const xScale = d3
    .scaleLinear()
    .domain([1, d3.max(roleData, (d) => d.season)])
    .range([50, width - 50]);

  const yScale = d3
    .scalePoint()
    .domain(roleData.map((d) => d.role))
    .range([50, height - 50]);

  svg
    .selectAll("circle")
    .data(roleData)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.season))
    .attr("cy", (d) => yScale(d.role))
    .attr("r", 6)
    .attr("fill", "#729fcf");

  svg
    .selectAll("text")
    .data(roleData)
    .enter()
    .append("text")
    .attr("x", (d) => xScale(d.season))
    .attr("y", (d) => yScale(d.role) - 10)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .text((d) => `S${d.season}: ${d.role}`);
}

// Presencia por temporada
function renderPresencePerSeason(presenceData) {
  const svg = d3.select("#presenceFlowChart");
  const width = 600;
  const height = 300;
  svg.attr("width", width).attr("height", height);

  const xScale = d3
    .scaleLinear()
    .domain([1, d3.max(presenceData, (d) => d.season)])
    .range([40, width - 20]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(presenceData, (d) => d.episodes)])
    .range([height - 40, 20]);

  const line = d3
    .line()
    .x((d) => xScale(d.season))
    .y((d) => yScale(d.episodes));

  svg
    .append("path")
    .datum(presenceData)
    .attr("fill", "none")
    .attr("stroke", "#fcaf3e")
    .attr("stroke-width", 2)
    .attr("d", line);

  svg
    .selectAll("circle")
    .data(presenceData)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.season))
    .attr("cy", (d) => yScale(d.episodes))
    .attr("r", 4)
    .attr("fill", "#ef2929");
}

// Comparación de protagonismo
function renderProtagonismComparison(presenceData, characters) {
  const svg = d3.select("#protagonismFlowChart");
  const width = 600;
  const height = 300;
  svg.attr("width", width).attr("height", height);

  // Asumimos que Butters es el primero del array
  const buttersData = presenceData.map((d) => ({
    season: d.season,
    episodes: d.episodes,
  }));

  const xScale = d3
    .scaleLinear()
    .domain([1, 26])
    .range([40, width - 40]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(buttersData, (d) => d.episodes)])
    .range([height - 40, 20]);

  const line = d3
    .line()
    .x((d) => xScale(d.season))
    .y((d) => yScale(d.episodes));

  svg
    .append("path")
    .datum(buttersData)
    .attr("fill", "none")
    .attr("stroke", "#729fcf")
    .attr("stroke-width", 2)
    .attr("d", line);
}

// Comparación de personajes (Radar Chart)
function renderStatsComparison(data) {
  if (!window.Chart) return;

  const ctx = document.getElementById("statsComparisonChart").getContext("2d");
  new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Screen Time", "Lines"],
      datasets: data.map((char) => ({
        label: char.character,
        data: [char.screenTime, char.lines],
        fill: true,
      })),
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
}

// Renderizar crímenes progresivamente
function renderCrimes(crimes) {
  const container = document.getElementById("crimes-list");

  let index = 0;

  function showNextCrime() {
    if (index >= crimes.length) return;
    const crime = crimes[index];

    const div = document.createElement("div");
    div.className = `crime-item crime-${crime.severity}`;

    const gifMap = {
      Justified:
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWw5OTY4cHVpd2JxdTdxczZ3enQ1OW8ydzNmMHJtbXJyOW1nNTMyeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/KeJaNM7Uee43KoodYn/giphy.gif",
      Low: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWw5OTY4cHVpd2JxdTdxczZ3enQ1OW8ydzNmMHJtbXJyOW1nNTMyeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/KeJaNM7Uee43KoodYn/giphy.gif",
      Medium:
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWw5OTY4cHVpd2JxdTdxczZ3enQ1OW8ydzNmMHJtbXJyOW1nNTMyeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/fq8aPV216Lu5CdKtjt/giphy.gif",
      High: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWw5OTY4cHVpd2JxdTdxczZ3enQ1OW8ydzNmMHJtbXJyOW1nNTMyeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/SqqNETwLOEu6VbHLNj/giphy.gif",
    };

    const gifUrl = gifMap[crime.severity] || gifMap["Low"];
    div.innerHTML = `
      <img src="${gifUrl}" alt="Butters dancing ${crime.severity} severity" class="crime-gif" style="width:100px;float:left;margin-right:1rem;border-radius:8px;">
      <div>
        <p><strong>${crime.crime}</strong> (${crime.alias})</p>
        <p>${crime.description}</p>
        <p><em>Episode: ${crime.episode}</em></p>
      </div>
    `;

    container.appendChild(div);
    div.style.animation = `fadeInUp 0.6s ease forwards`;

    index++;
    setTimeout(showNextCrime, 1800);
  }

  showNextCrime();
}
