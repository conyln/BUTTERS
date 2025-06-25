// JSON
const jsonURL = 'https://raw.githubusercontent.com/conyln/BUTTERS/refs/heads/main/datos.json';

// Convenience function to fetch JSON data
async function fetchData() {
    try {
        const res = await fetch(jsonURL);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("Error loading JSON:", err);
        alert("Failed to load data. Check console.");
    }
}

// GRAPH 1
function renderRoleEvolution(data) {
    const svg = d3.select("#roleEvolutionChart");
    svg.selectAll("*").remove();

    const margin = {top: 20, right: 40, bottom: 50, left: 50},
          width = +svg.node().getBoundingClientRect().width - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale: season (numerical)
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.season))
        .range([0, width]);

    // Y scale: role level as categorical mapped to numeric for the line
    // Map roles to numbers in order: background=1, named=2, sidekick=3, main=4, leading roles=5
    const roleMap = {background:1, named:2, sidekick:3, main:4, "leading roles":5};
    const y = d3.scaleLinear()
        .domain([1,5])
        .range([height, 0]);

    // Line generator
    const line = d3.line()
        .x(d => x(d.season))
        .y(d => y(roleMap[d.role]))
        .curve(d3.curveMonotoneX);

    // X axis
    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(data.length).tickFormat(d3.format("d")));

    // Y axis with role labels
    const yAxis = d3.axisLeft(y)
        .ticks(5)
        .tickFormat(tick => {
            for (let key in roleMap) {
                if (roleMap[key] === tick) return key;
            }
            return "";
        });
    g.append("g").call(yAxis);

    // Draw the line
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "var(--color-butters-yellow)")
        .attr("stroke-width", 3)
        .attr("d", line);

    // Points & tooltips
    g.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.season))
        .attr("cy", d => y(roleMap[d.role]))
        .attr("r", 6)
        .attr("fill", "var(--color-butters-orange)")
        .on("mouseenter", (event, d) => {
            const tooltip = g.append("text")
                .attr("id", "tooltip-role")
                .attr("x", x(d.season))
                .attr("y", y(roleMap[d.role]) - 10)
                .attr("text-anchor", "middle")
                .attr("fill", "#222")
                .style("font-size", "12px")
                .text(`${d.role} (Season ${d.season})`);
        })
        .on("mouseleave", () => {
            g.select("#tooltip-role").remove();
        });
}

// GRAPH 2
function renderPresenceFlow(data) {
    const svg = d3.select("#presenceFlowChart");
    svg.selectAll("*").remove();

    const margin = {top: 20, right: 40, bottom: 40, left: 50},
          width = +svg.node().getBoundingClientRect().width - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.season))
        .range([0, width])
        .padding(0.
