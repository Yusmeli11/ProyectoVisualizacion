// Global variables
let worldData = [];
let countriesData = [];
let mapData = [];
let currentYear = 1960;
let isPlaying = false;
let playInterval;

// Initialize the visualization
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupScrollAnimations();
    setupEventListeners();
});

// Load data from JSON files
async function loadData() {
    try {
        // For demo purposes, we'll create sample data
        // In a real implementation, you would load from the JSON files created by the Python script
        
        // Sample world data
        worldData = generateSampleWorldData();
        
        // Sample countries data
        countriesData = generateSampleCountriesData();
        
        // Sample map data
        mapData = generateSampleMapData();
        
        // Initialize visualizations
        createHeroVisualization();
        createGlobalChart();
        createRegionalChart();
        createWorldMap();
        createRacingChart();
        createScatterChart();
        createGenerationalChart();
        
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to sample data
        worldData = generateSampleWorldData();
        countriesData = generateSampleCountriesData();
        mapData = generateSampleMapData();
        
        createHeroVisualization();
        createGlobalChart();
        createRegionalChart();
        createWorldMap();
        createRacingChart();
        createScatterChart();
        createGenerationalChart();
    }
}

// Generate sample data for demonstration
function generateSampleWorldData() {
    const data = [];
    for (let year = 1960; year <= 2020; year++) {
        const rate = 5.0 - ((year - 1960) / 60) * 2.7; // Decline from 5.0 to 2.3
        data.push({ year, fertility_rate: Math.max(2.3, rate) });
    }
    return data;
}

// En la función generateSampleCountriesData, actualizar para incluir más países y asegurar que Nigeria esté presente:

function generateSampleCountriesData() {
    const countries = [
        { name: 'China', startRate: 5.8, endRate: 1.7, color: '#e74c3c' },
        { name: 'India', startRate: 6.0, endRate: 2.2, color: '#f39c12' },
        { name: 'United States', startRate: 3.7, endRate: 1.8, color: '#3498db' },
        { name: 'Nigeria', startRate: 6.9, endRate: 5.4, color: '#2ecc71' },
        { name: 'Germany', startRate: 2.4, endRate: 1.6, color: '#9b59b6' },
        { name: 'Japan', startRate: 2.0, endRate: 1.4, color: '#1abc9c' },
        { name: 'Brazil', startRate: 6.2, endRate: 1.7, color: '#e67e22' }
    ];
    
    return countries.map(country => ({
        country: country.name,
        color: country.color,
        data: generateCountryData(country.startRate, country.endRate)
    }));
}

function generateCountryData(startRate, endRate) {
    const data = [];
    for (let year = 1960; year <= 2020; year++) {
        const progress = (year - 1960) / 60;
        const rate = startRate - (startRate - endRate) * progress;
        data.push({ year, fertility_rate: rate });
    }
    return data;
}

function generateSampleMapData() {
    const countries = [
        'United States', 'China', 'India', 'Brazil', 'Russia', 'Germany', 
        'Japan', 'Nigeria', 'Bangladesh', 'Pakistan', 'Indonesia', 'Mexico'
    ];
    
    return countries.map(country => ({
        country,
        fertility_rate: Math.random() * 4 + 1 // Random rate between 1-5
    }));
}

// Hero visualization
function createHeroVisualization() {
    const container = d3.select('#hero-viz');
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Create animated background particles
    const particles = svg.selectAll('.particle')
        .data(d3.range(50))
        .enter()
        .append('circle')
        .attr('class', 'particle')
        .attr('r', d => Math.random() * 3 + 1)
        .attr('cx', () => Math.random() * width)
        .attr('cy', () => Math.random() * height)
        .attr('fill', 'white')
        .attr('opacity', 0.3);
    
    // Animate particles
    function animateParticles() {
        particles.transition()
            .duration(10000)
            .ease(d3.easeLinear)
            .attr('cx', () => Math.random() * width)
            .attr('cy', () => Math.random() * height)
            .on('end', animateParticles);
    }
    
    animateParticles();
}

// Global trend chart
function createGlobalChart() {
    const container = d3.select('#global-chart');
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.bottom - margin.top;
    
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(worldData, d => d.year))
        .range([0, width]);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(worldData, d => d.fertility_rate)])
        .range([height, 0]);
    
    // Line generator
    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.fertility_rate))
        .curve(d3.curveMonotoneX);
    
    // Add axes
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format('d')));
    
    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale));
    
    // Add axis labels
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Tasa de Fertilidad');
    
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${width / 2}, ${height + margin.bottom})`)
        .style('text-anchor', 'middle')
        .text('Año');
    
    // Add the line with animation
    const path = g.append('path')
        .datum(worldData)
        .attr('class', 'line world-line')
        .attr('d', line);
    
    // Animate the line drawing
    const totalLength = path.node().getTotalLength();
    path
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);
    
    // Add tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    
    // Add dots for interaction
    g.selectAll('.dot')
        .data(worldData.filter((d, i) => i % 5 === 0)) // Show every 5th point
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScale(d.year))
        .attr('cy', d => yScale(d.fertility_rate))
        .attr('r', 4)
        .attr('fill', '#e74c3c')
        .on('mouseover', function(event, d) {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`Año: ${d.year}<br/>Tasa: ${d.fertility_rate.toFixed(2)}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function(d) {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });
}

// En la función createRegionalChart, agregar tooltips informativos y asegurar que todos los países estén disponibles:

function createRegionalChart() {
    const container = d3.select('#regional-chart');
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.bottom - margin.top;
    
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain([1960, 2020])
        .range([0, width]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 7])
        .range([height, 0]);
    
    // Line generator
    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.fertility_rate))
        .curve(d3.curveMonotoneX);
    
    // Add axes
    g.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format('d')));
    
    g.append('g')
        .attr('class', 'axis y-axis')
        .call(d3.axisLeft(yScale));
    
    // Add axis labels
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Tasa de Fertilidad');
    
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${width / 2}, ${height + margin.bottom})`)
        .style('text-anchor', 'middle')
        .text('Año');
    
    // Tooltip para las líneas
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    
    // Add lines for all countries
    const countryLines = g.selectAll('.country-line')
        .data(countriesData)
        .enter()
        .append('path')
        .attr('class', 'country-line')
        .attr('d', d => line(d.data))
        .attr('stroke', d => d.color)
        .attr('opacity', 0.7)
        .on('mouseover', function(event, d) {
            // Solo resaltar si la línea está visible
            const currentOpacity = d3.select(this).attr('opacity');
            if (currentOpacity > 0) {
                d3.select(this)
                    .attr('opacity', 1)
                    .attr('stroke-width', 6);
                
                // Calcular estadísticas
                const startRate = d.data[0].fertility_rate;
                const endRate = d.data[d.data.length - 1].fertility_rate;
                const change = endRate - startRate;
                const changePercent = ((change / startRate) * 100).toFixed(1);
                const trend = change < 0 ? 'descendente' : 'ascendente';
                const peakRate = Math.max(...d.data.map(item => item.fertility_rate));
                const peakYear = d.data.find(item => item.fertility_rate === peakRate).year;
                
                // Mostrar tooltip
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);
                tooltip.html(`
                    <div class="tooltip-title">${d.country}</div>
                    <div class="tooltip-content">
                        <strong>Evolución 1960-2020:</strong><br/>
                        • Inicio (1960): ${startRate.toFixed(1)} hijos por mujer<br/>
                        • Final (2020): ${endRate.toFixed(1)} hijos por mujer<br/>
                        • Cambio: ${change.toFixed(1)} (${changePercent}%)<br/>
                        • Tendencia: ${trend}<br/>
                        • Pico máximo: ${peakRate.toFixed(1)} en ${peakYear}<br/>
                        <br/>
                        <em>${getCountryInsight(d.country, startRate, endRate, change)}</em>
                    </div>
                `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            }
        })
        .on('mouseout', function(d) {
            // Restaurar el estado según el filtro actual
            const activeButtons = document.querySelectorAll('.country-btn.active');
            const selectedCountries = Array.from(activeButtons).map(btn => btn.dataset.country);
            
            if (selectedCountries.includes('all')) {
                d3.select(this)
                    .attr('opacity', 0.7)
                    .attr('stroke-width', 3);
            } else if (selectedCountries.includes(d.country)) {
                d3.select(this)
                    .attr('opacity', 1)
                    .attr('stroke-width', 5);
            }
                
            tooltip.transition()
                .duration(300)
                .style('opacity', 0);
        });
    
    // Add country labels
    const labels = g.selectAll('.country-label')
        .data(countriesData)
        .enter()
        .append('text')
        .attr('class', 'country-label')
        .attr('x', width - 10)
        .attr('y', d => yScale(d.data[d.data.length - 1].fertility_rate))
        .attr('dy', '0.35em')
        .style('text-anchor', 'end')
        .style('font-size', '12px')
        .style('fill', d => d.color)
        .text(d => d.country);
    
    // Country selection functionality con selección múltiple
    window.updateRegionalChart = function(selectedCountries) {
        if (selectedCountries.includes('all')) {
            // Mostrar todas las líneas
            countryLines
                .transition()
                .duration(500)
                .attr('opacity', 0.7)
                .attr('stroke-width', 3);
            labels
                .transition()
                .duration(500)
                .attr('opacity', 1);
        } else {
            // Mostrar solo las líneas seleccionadas
            countryLines
                .transition()
                .duration(500)
                .attr('opacity', d => selectedCountries.includes(d.country) ? 1 : 0)
                .attr('stroke-width', d => selectedCountries.includes(d.country) ? 5 : 3);
            
            // Mostrar solo las etiquetas de países seleccionados
            labels
                .transition()
                .duration(500)
                .attr('opacity', d => selectedCountries.includes(d.country) ? 1 : 0);
        }
    };
}

// Función auxiliar para generar insights específicos por país
function getCountryInsight(country, startRate, endRate, change) {
    const insights = {
        'China': 'La política del hijo único (1979-2015) causó una dramática caída en la fertilidad.',
        'India': 'Transición gradual impulsada por urbanización y programas de planificación familiar.',
        'United States': 'Declive constante con ligeras fluctuaciones por factores económicos.',
        'Nigeria': 'Mantiene alta fertilidad debido a factores culturales y económicos.',
        'Germany': 'Baja fertilidad persistente típica de países desarrollados europeos.',
        'Japan': 'Envejecimiento poblacional extremo con fertilidad muy por debajo del reemplazo.',
        'Brazil': 'Rápida transición demográfica en las últimas décadas.'
    };
    
    return insights[country] || `Cambio de ${Math.abs(change).toFixed(1)} puntos en 60 años refleja la transición demográfica global.`;
}

// World map
function createWorldMap() {
    const container = d3.select('#world-map');
    const width = 900;
    const height = 500;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Color scale mejorada
    const colorScale = d3.scaleThreshold()
        .domain([1, 2, 3, 4, 5])
        .range(['#4575b4', '#74add1', '#fee08b', '#fc8d59', '#d73027']);
    
    // Agregar imagen de fondo del mapa
    svg.append('image')
        .attr('href', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NjcwNWhszUgYS4E1X6mtG2KuclcnlI.png')
        .attr('width', width)
        .attr('height', height)
        .attr('opacity', 0.3);
    
    // Datos de países con coordenadas corregidas basadas en el mapa
    const countriesWithCoords = [
        { name: 'United States', x: 180, y: 200, rate: 1.8, gdp: 65000 },
        { name: 'Canada', x: 180, y: 120, rate: 1.5, gdp: 48000 },
        { name: 'Mexico', x: 160, y: 280, rate: 2.1, gdp: 10000 },
        { name: 'Brazil', x: 280, y: 350, rate: 1.7, gdp: 9000 },
        { name: 'Argentina', x: 270, y: 420, rate: 2.3, gdp: 11000 },
        { name: 'United Kingdom', x: 450, y: 150, rate: 1.7, gdp: 42000 },
        { name: 'Germany', x: 480, y: 160, rate: 1.6, gdp: 48000 },
        { name: 'France', x: 460, y: 170, rate: 1.8, gdp: 41000 },
        { name: 'Russia', x: 580, y: 130, rate: 1.8, gdp: 12000 },
        { name: 'Turkey', x: 520, y: 200, rate: 2.1, gdp: 9000 },
        { name: 'Egypt', x: 510, y: 260, rate: 3.3, gdp: 4000 },
        { name: 'Nigeria', x: 470, y: 300, rate: 5.4, gdp: 2400 },
        { name: 'South Africa', x: 510, y: 380, rate: 2.4, gdp: 7000 },
        { name: 'India', x: 620, y: 260, rate: 2.2, gdp: 2500 },
        { name: 'China', x: 680, y: 220, rate: 1.7, gdp: 12000 },
        { name: 'Japan', x: 750, y: 210, rate: 1.4, gdp: 40000 },
        { name: 'Indonesia', x: 720, y: 320, rate: 2.3, gdp: 4200 },
        { name: 'Australia', x: 780, y: 400, rate: 1.8, gdp: 55000 }
    ];
    
    // Tooltip mejorado
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    
    // Crear círculos para países
    svg.selectAll('.country-circle')
        .data(countriesWithCoords)
        .enter()
        .append('circle')
        .attr('class', 'country-circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => Math.sqrt(d.rate) * 8)
        .attr('fill', d => colorScale(d.rate))
        .attr('stroke', '#333')
        .attr('stroke-width', 1)
        .attr('opacity', 0.8)
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', Math.sqrt(d.rate) * 10)
                .attr('stroke-width', 2);
                
            tooltip.transition()
                .duration(200)
                .style('opacity', 1);
            tooltip.html(`
                <div class="tooltip-title">${d.name}</div>
                <div class="tooltip-content">
                    <strong>Tasa de Fertilidad:</strong> ${d.rate}<br/>
                    <strong>PIB per cápita:</strong> $${d.gdp.toLocaleString()}<br/>
                    <strong>Categoría:</strong> ${d.rate > 4 ? 'Muy Alta' : d.rate > 3 ? 'Alta' : d.rate > 2 ? 'Media' : d.rate > 1 ? 'Baja' : 'Muy Baja'}
                </div>
            `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function(d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', d => Math.sqrt(d.rate) * 8)
                .attr('stroke-width', 1);
                
            tooltip.transition()
                .duration(300)
                .style('opacity', 0);
        });
    
    // Agregar etiquetas para países principales
    svg.selectAll('.country-label')
        .data(countriesWithCoords.filter(d => d.rate > 3 || d.gdp > 40000))
        .enter()
        .append('text')
        .attr('class', 'country-label')
        .attr('x', d => d.x)
        .attr('y', d => d.y - Math.sqrt(d.rate) * 8 - 5)
        .style('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text(d => d.name);
}

// En la función createRacingChart, asegurar que se muestren todos los países:

function createRacingChart() {
    const container = d3.select('#racing-chart');
    const margin = { top: 20, right: 30, bottom: 40, left: 150 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.bottom - margin.top;
    
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Usar todos los países disponibles para el racing chart
    const topCountries = countriesData.slice(0, 7); // Todos los países
    
    const xScale = d3.scaleLinear()
        .domain([0, 7])
        .range([0, width]);
    
    const yScale = d3.scaleBand()
        .domain(topCountries.map(d => d.country))
        .range([0, height])
        .padding(0.1);
    
    // Add axes con clases específicas para evitar conflictos
    const xAxis = g.append('g')
        .attr('class', 'axis x-axis-racing')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));
    
    const yAxis = g.append('g')
        .attr('class', 'axis y-axis-racing')
        .call(d3.axisLeft(yScale));
    
    // Add bars
    const bars = g.selectAll('.country-bar')
        .data(topCountries)
        .enter()
        .append('rect')
        .attr('class', 'country-bar')
        .attr('x', 0)
        .attr('y', d => yScale(d.country))
        .attr('width', d => xScale(d.data[0].fertility_rate))
        .attr('height', yScale.bandwidth())
        .attr('fill', d => d.color);
    
    // Add value labels
    const labels = g.selectAll('.bar-label')
        .data(topCountries)
        .enter()
        .append('text')
        .attr('class', 'bar-label')
        .attr('x', d => xScale(d.data[0].fertility_rate) + 5)
        .attr('y', d => yScale(d.country) + yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .text(d => d.data[0].fertility_rate.toFixed(1));
    
    // Animation function
    window.updateRacingChart = function(year) {
        const yearIndex = year - 1960;
        
        topCountries.forEach(country => {
            if (yearIndex < country.data.length) {
                country.currentRate = country.data[yearIndex].fertility_rate;
            }
        });
        
        // Sort by current rate
        topCountries.sort((a, b) => b.currentRate - a.currentRate);
        
        // Update y scale
        yScale.domain(topCountries.map(d => d.country));
        
        // Update bars
        bars.data(topCountries, d => d.country)
            .transition()
            .duration(500)
            .attr('y', d => yScale(d.country))
            .attr('width', d => xScale(d.currentRate));
        
        // Update labels
        labels.data(topCountries, d => d.country)
            .transition()
            .duration(500)
            .attr('x', d => xScale(d.currentRate) + 5)
            .attr('y', d => yScale(d.country) + yScale.bandwidth() / 2)
            .text(d => d.currentRate.toFixed(1));
        
        // Update y axis - MANTENER EL EJE X INTACTO
        yAxis.transition()
            .duration(500)
            .call(d3.axisLeft(yScale));
        
        // El eje X no se actualiza para evitar que desaparezca
    };
}

// Nuevo gráfico de dispersión
function createScatterChart() {
    const container = d3.select('#scatter-chart');
    const margin = { top: 20, right: 30, bottom: 60, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.bottom - margin.top;
    
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Datos para el gráfico de dispersión
    const scatterData = [
        { country: 'Niger', gdp: 600, fertility: 6.8, population: 25 },
        { country: 'Chad', gdp: 800, fertility: 6.4, population: 17 },
        { country: 'Mali', gdp: 900, fertility: 6.0, population: 21 },
        { country: 'Nigeria', gdp: 2400, fertility: 5.4, population: 220 },
        { country: 'India', gdp: 2500, fertility: 2.2, population: 1400 },
        { country: 'Egypt', gdp: 4000, fertility: 3.3, population: 105 },
        { country: 'Brazil', gdp: 9000, fertility: 1.7, population: 215 },
        { country: 'Turkey', gdp: 9000, fertility: 2.1, population: 85 },
        { country: 'Mexico', gdp: 10000, fertility: 2.1, population: 130 },
        { country: 'Argentina', gdp: 11000, fertility: 2.3, population: 46 },
        { country: 'China', gdp: 12000, fertility: 1.7, population: 1440 },
        { country: 'Russia', gdp: 12000, fertility: 1.8, population: 146 },
        { country: 'Japan', gdp: 40000, fertility: 1.4, population: 125 },
        { country: 'Germany', gdp: 48000, fertility: 1.6, population: 84 },
        { country: 'Canada', gdp: 48000, fertility: 1.5, population: 39 },
        { country: 'Australia', gdp: 55000, fertility: 1.8, population: 26 },
        { country: 'United States', gdp: 65000, fertility: 1.8, population: 335 }
    ];
    
    // Escalas - cambiar a escala lineal para mejor legibilidad
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(scatterData, d => d.gdp)])
        .range([0, width]);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(scatterData, d => d.fertility)])
        .range([height, 0]);
    
    const sizeScale = d3.scaleSqrt()
        .domain(d3.extent(scatterData, d => d.population))
        .range([5, 30]);
    
    // Ejes con mejor formato
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale)
            .tickFormat(d => {
                if (d >= 1000) {
                    return `$${(d/1000).toFixed(0)}K`;
                }
                return `$${d}`;
            })
            .ticks(8)
        );
    
    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale));
    
    // Etiquetas de ejes
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Tasa de Fertilidad');
    
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 10})`)
        .style('text-anchor', 'middle')
        .text('PIB per cápita (USD)');
    
    // Tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    
    // Puntos
    g.selectAll('.scatter-point')
        .data(scatterData)
        .enter()
        .append('circle')
        .attr('class', 'scatter-point')
        .attr('cx', d => xScale(d.gdp))
        .attr('cy', d => yScale(d.fertility))
        .attr('r', d => sizeScale(d.population))
        .attr('fill', d => d.fertility > 4 ? '#d73027' : d.fertility > 3 ? '#fc8d59' : d.fertility > 2 ? '#fee08b' : '#4575b4')
        .attr('opacity', 0.7)
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('opacity', 1)
                .attr('stroke', '#333')
                .attr('stroke-width', 2);
                
            tooltip.transition()
                .duration(200)
                .style('opacity', 1);
            tooltip.html(`
                <div class="tooltip-title">${d.country}</div>
                <div class="tooltip-content">
                    <strong>PIB per cápita:</strong> $${d.gdp.toLocaleString()}<br/>
                    <strong>Tasa de Fertilidad:</strong> ${d.fertility}<br/>
                    <strong>Población:</strong> ${d.population}M habitantes<br/>
                    <strong>Desarrollo:</strong> ${d.gdp > 30000 ? 'Alto' : d.gdp > 10000 ? 'Medio-Alto' : d.gdp > 3000 ? 'Medio' : 'Bajo'}
                </div>
            `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function(d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('opacity', 0.7)
                .attr('stroke', 'none');
                
            tooltip.transition()
                .duration(300)
                .style('opacity', 0);
        });
    
    // Línea de tendencia con escala lineal
    const regression = calculateLinearRegression(scatterData);
    const lineData = [
        { x: d3.min(scatterData, d => d.gdp), y: regression.slope * d3.min(scatterData, d => d.gdp) + regression.intercept },
        { x: d3.max(scatterData, d => d.gdp), y: regression.slope * d3.max(scatterData, d => d.gdp) + regression.intercept }
    ];
    
    g.append('line')
        .attr('x1', xScale(lineData[0].x))
        .attr('y1', yScale(lineData[0].y))
        .attr('x2', xScale(lineData[1].x))
        .attr('y2', yScale(lineData[1].y))
        .attr('stroke', '#e74c3c')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('opacity', 0.8);
}

// Función auxiliar para calcular regresión
function calculateRegression(data) {
    const n = data.length;
    const sumX = data.reduce((sum, d) => sum + Math.log(d.gdp), 0);
    const sumY = data.reduce((sum, d) => sum + d.fertility, 0);
    const sumXY = data.reduce((sum, d) => sum + Math.log(d.gdp) * d.fertility, 0);
    const sumXX = data.reduce((sum, d) => sum + Math.log(d.gdp) * Math.log(d.gdp), 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
}

// Función auxiliar para calcular regresión lineal
function calculateLinearRegression(data) {
    const n = data.length;
    const sumX = data.reduce((sum, d) => sum + d.gdp, 0);
    const sumY = data.reduce((sum, d) => sum + d.fertility, 0);
    const sumXY = data.reduce((sum, d) => sum + d.gdp * d.fertility, 0);
    const sumXX = data.reduce((sum, d) => sum + d.gdp * d.gdp, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
}

// Nuevo gráfico generacional
function createGenerationalChart() {
    const container = d3.select('#generational-chart');
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.bottom - margin.top;
    
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Datos de pirámides poblacionales
    const pyramidData = {
        traditional: [
            { age: '0-14', male: 35, female: 33 },
            { age: '15-29', male: 25, female: 24 },
            { age: '30-44', male: 18, female: 18 },
            { age: '45-59', male: 12, female: 13 },
            { age: '60-74', male: 7, female: 8 },
            { age: '75+', male: 3, female: 4 }
        ],
        transitional: [
            { age: '0-14', male: 22, female: 21 },
            { age: '15-29', male: 28, female: 27 },
            { age: '30-44', male: 24, female: 24 },
            { age: '45-59', male: 15, female: 16 },
            { age: '60-74', male: 8, female: 9 },
            { age: '75+', male: 3, female: 3 }
        ],
        inverted: [
            { age: '0-14', male: 12, female: 11 },
            { age: '15-29', male: 15, female: 14 },
            { age: '30-44', male: 18, female: 18 },
            { age: '45-59', male: 22, female: 22 },
            { age: '60-74', male: 20, female: 21 },
            { age: '75+', male: 13, female: 14 }
        ]
    };
    
    let currentType = 'traditional';
    
    // Escalas
    const yScale = d3.scaleBand()
        .domain(pyramidData.traditional.map(d => d.age))
        .range([height, 0])
        .padding(0.1);
    
    const xScale = d3.scaleLinear()
        .domain([-40, 40])
        .range([0, width]);
    
    // Ejes
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${width/2},${height})`)
        .call(d3.axisBottom(xScale.copy().domain([0, 40])).tickFormat(d => Math.abs(d) + '%'));
    
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${width/2},0)`)
        .call(d3.axisLeft(yScale));
    
    // Etiquetas
    g.append('text')
        .attr('class', 'pyramid-label')
        .attr('x', width/4)
        .attr('y', height + 35)
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .text('Hombres');
    
    g.append('text')
        .attr('class', 'pyramid-label')
        .attr('x', 3*width/4)
        .attr('y', height + 35)
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .text('Mujeres');
    
    // Tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    
    function updatePyramid(type) {
        const data = pyramidData[type];
        
        // Barras masculinas (izquierda)
        const maleBars = g.selectAll('.male-bar')
            .data(data);
        
        maleBars.enter()
            .append('rect')
            .attr('class', 'male-bar')
            .merge(maleBars)
            .transition()
            .duration(800)
            .attr('x', d => xScale(-d.male))
            .attr('y', d => yScale(d.age))
            .attr('width', d => xScale(0) - xScale(-d.male))
            .attr('height', yScale.bandwidth())
            .attr('fill', '#3498db')
            .attr('opacity', 0.8);
        
        // Barras femeninas (derecha)
        const femaleBars = g.selectAll('.female-bar')
            .data(data);
        
        femaleBars.enter()
            .append('rect')
            .attr('class', 'female-bar')
            .merge(femaleBars)
            .transition()
            .duration(800)
            .attr('x', xScale(0))
            .attr('y', d => yScale(d.age))
            .attr('width', d => xScale(d.female) - xScale(0))
            .attr('height', yScale.bandwidth())
            .attr('fill', '#e74c3c')
            .attr('opacity', 0.8);
        
        // Agregar interactividad
        g.selectAll('.male-bar, .female-bar')
            .on('mouseover', function(event, d) {
                const isMale = d3.select(this).classed('male-bar');
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);
                tooltip.html(`
                    <div class="tooltip-title">Grupo de edad: ${d.age}</div>
                    <div class="tooltip-content">
                        <strong>Hombres:</strong> ${d.male}%<br/>
                        <strong>Mujeres:</strong> ${d.female}%<br/>
                        <strong>Total:</strong> ${d.male + d.female}%
                    </div>
                `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                tooltip.transition()
                    .duration(300)
                    .style('opacity', 0);
            });
    }
    
    // Inicializar con pirámide tradicional
    updatePyramid(currentType);
    
    // Función global para actualizar
    window.updateGenerationalChart = function(type) {
        currentType = type;
        updatePyramid(type);
    };
}

// Modificar la función de animación del racing chart
function startAnimation() {
    isPlaying = true;
    document.getElementById('play-btn').textContent = '⏸ Pausar';
    
    playInterval = setInterval(() => {
        currentYear += 1;
        if (currentYear > 2020) {
            // Detener automáticamente al llegar al final
            stopAnimation();
            return;
        }
        
        document.getElementById('current-year').textContent = currentYear;
        updateRacingChart(currentYear);
    }, 200);
}

// Agregar función de reinicio
function resetAnimation() {
    currentYear = 1960;
    document.getElementById('current-year').textContent = currentYear;
    updateRacingChart(currentYear);
}

// Actualizar event listeners
function setupEventListeners() {
    // Country buttons con selección múltiple
    document.querySelectorAll('.country-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const country = this.dataset.country;
            
            if (country === 'all') {
                // Si se selecciona "Todos", desactivar todos los demás
                document.querySelectorAll('.country-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                updateRegionalChart(['all']);
            } else {
                // Remover "Todos" si está activo
                const allBtn = document.querySelector('.country-btn[data-country="all"]');
                if (allBtn) allBtn.classList.remove('active');
                
                // Toggle del país actual
                this.classList.toggle('active');
                
                // Obtener países seleccionados
                const activeButtons = document.querySelectorAll('.country-btn.active:not([data-country="all"])');
                const selectedCountries = Array.from(activeButtons).map(btn => btn.dataset.country);
                
                // Si no hay países seleccionados, activar "Todos"
                if (selectedCountries.length === 0) {
                    if (allBtn) allBtn.classList.add('active');
                    updateRegionalChart(['all']);
                } else {
                    updateRegionalChart(selectedCountries);
                }
            }
        });
    });
    
    // Generation buttons
    document.querySelectorAll('.generation-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.generation-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateGenerationalChart(this.dataset.type);
        });
    });
    
    // Play button mejorado
    document.getElementById('play-btn').addEventListener('click', function() {
        if (isPlaying) {
            stopAnimation();
        } else {
            if (currentYear >= 2020) {
                resetAnimation();
            }
            startAnimation();
        }
    });

    function stopAnimation() {
        isPlaying = false;
        document.getElementById('play-btn').textContent = '▶ Reproducir';
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
    }
    
    // Agregar botón de reinicio
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '⏮ Reiniciar';
    resetBtn.className = 'play-button';
    resetBtn.style.marginLeft = '10px';
    resetBtn.addEventListener('click', resetAnimation);
    document.querySelector('#racing .controls').appendChild(resetBtn);
}

// Scroll animations
function setupScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Responsive handling
window.addEventListener('resize', function() {
    // Recreate visualizations on resize
    d3.selectAll('svg').remove();
    createHeroVisualization();
    createGlobalChart();
    createRegionalChart();
    createWorldMap();
    createRacingChart();
    createScatterChart();
    createGenerationalChart();
});

// Actualizar la función de inicialización
async function loadData() {
    try {
        worldData = generateSampleWorldData();
        countriesData = generateSampleCountriesData();
        mapData = generateSampleMapData();
        
        createHeroVisualization();
        createGlobalChart();
        createRegionalChart();
        createWorldMap();
        createRacingChart();
        createScatterChart();
        createGenerationalChart();
        
    } catch (error) {
        console.error('Error loading data:', error);
        worldData = generateSampleWorldData();
        countriesData = generateSampleCountriesData();
        mapData = generateSampleMapData();
        
        createHeroVisualization();
        createGlobalChart();
        createRegionalChart();
        createWorldMap();
        createRacingChart();
        createScatterChart();
        createGenerationalChart();
    }
}
