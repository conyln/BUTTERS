// script.js

// URL del JSON
const DATA_URL = 'https://raw.githubusercontent.com/conyln/BUTTERS/refs/heads/main/datos.json';

// Fetch JSON y activar renderizado cuando esté disponible
fetch(DATA_URL)
  .then(response => response.json())
  .then(data => {
    renderRoleEvolution(data.roleEvolution);
    renderPresenceBySeason(data.presenceBySeason);
    renderProtagonismComparison(data.presenceBySeason);
    renderStatsComparison(data.characterComparison);
    renderCrimes(data.crimes);
  })
  .catch(err => console.error('Error loading JSON:', err));

// Función: Línea de tiempo - Role Evolution (usando D3.js como placeholder)
function renderRoleEvolution(data) {
  const svg = d3.select('#roleEvolutionChart');
  svg.selectAll('*').remove();

  const width = 600, height = 100;
  svg.attr('width', width).attr('height', height);

  const xScale = d3.scaleLinear()
    .domain([1, d3.max(data, d => d.season)])
    .range([50, width - 50]);

  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d.season))
    .attr('cy', height / 2)
    .attr('r', 6)
    .attr('fill', '#87CEEB');

  svg.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('x', d => xScale(d.season))
    .attr('y', height / 2 + 20)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .text(d => d.role);
}

// Función: Gráfico de flujo - Presence per Season (D3 bar chart)
function renderPresenceBySeason(data) {
  const svg = d3.select('#presenceFlowChart');
  svg.selectAll('*').remove();
  const width = 600, height = 200;
  svg.attr('width', width).attr('height', height);

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.season))
    .range([50, width - 20])
    .padding(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.episodes)])
    .range([height - 20, 20]);

  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', d => xScale(d.season))
    .attr('y', d => yScale(d.episodes))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - 20 - yScale(d.episodes))
    .attr('fill', '#FFD700');

  svg.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('x', d => xScale(d.season) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.episodes) - 5)
    .attr('text-anchor', 'middle')
    .attr('font-size', '10px')
    .text(d => d.episodes);
}

// Función: Comparación de protagonismo (ejemplo básico usando mismos datos que Presence)
function renderProtagonismComparison(data) {
  const svg = d3.select('#protagonismFlowChart');
  svg.selectAll('*').remove();
  const width = 600, height = 150;
  svg.attr('width', width).attr('height', height);

  const line = d3.line()
    .x(d => d.season * 20)
    .y(d => height - d.episodes * 5);

  svg.append('path')
    .datum(data)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', '#00BFFF')
    .attr('stroke-width', 2);
}

// Función: Comparación de personajes (Chart.js)
function renderStatsComparison(data) {
  const ctx = document.getElementById('statsComparisonChart').getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Screen Time', 'Lines'],
      datasets: data.map(char => ({
        label: char.character,
        data: [char.screenTime, char.lines],
        fill: true
      }))
    },
    options: {
      responsive: true,
      scales: {
        r: {
          angleLines: { display: false },
          suggestedMin: 0,
          suggestedMax: 1000
        }
      }
    }
  });
}

// Función: Renderizar delitos con color según gravedad
function renderCrimes(crimes) {
  const container = document.getElementById('crimes-list');
  crimes.forEach(crime => {
    const div = document.createElement('div');
    div.className = 'crime-card';

    // Color de fondo según gravedad
    let bgColor = '#eee';
    switch (crime.severity.toLowerCase()) {
      case 'low':
      case 'justified':
        bgColor = '#d1f0d1'; break;
      case 'medium':
        bgColor = '#ffe7a2'; break;
      case 'high':
        bgColor = '#f5a3a3'; break;
    }

    div.style.backgroundColor = bgColor;
    div.innerHTML = `
      <h4>${crime.crime}</h4>
      <p><strong>Alias:</strong> ${crime.alias}</p>
      <p><strong>Episode:</strong> ${crime.episode}</p>
      <p>${crime.description}</p>
    `;
    container.appendChild(div);
  });
}
