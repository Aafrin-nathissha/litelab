// ========================================
// COMPREHENSIVE LIGHTING DATABASE
// ========================================
const lightingProducts = [
  { id: "a30", name: "A30", category: "Art & Culture", type: "Object LED", watt: 23, lumens: 1800, efficiency: 78.3, features: "Zoom optics (15°-50°), High CRI" },
  { id: "m30", name: "M30", category: "Art & Culture", type: "Recessed LED", watt: 23, lumens: 1800, efficiency: 78.3, features: "Hidden ceiling mount version" },
  { id: "c2s", name: "C2S (SADE)", category: "Art & Culture", type: "Precision Spot", watt: 12, lumens: 700, efficiency: 58.3, features: "Ultra-narrow beam, Museum grade" },
  { id: "c30", name: "C30", category: "Art & Culture", type: "High Output", watt: 35, lumens: 3100, efficiency: 88.6, features: "For high-ceiling galleries/museums" },
  { id: "lcs", name: "LCS", category: "Workplace", type: "Linear LED", watt: 15, lumens: 1000, efficiency: 66.7, features: "General ambient lighting" },
  { id: "lwh", name: "L-WH", category: "Workplace", type: "Wall Washer", watt: 18, lumens: 1200, efficiency: 66.7, features: "Uniform wall illumination" },
  { id: "stix", name: "Stix Light", category: "Residential", type: "Decorative Stick", watt: 8, lumens: 560, efficiency: 70, features: "Minimalist aesthetic, Aluminum" },
  { id: "modular", name: "Modular Flood", category: "Facade", type: "Exterior Flood", watt: 50, lumens: 4500, efficiency: 90, features: "IP65 rated, High intensity" },
  { id: "astolfo", name: "Astolfo", category: "Hospitality", type: "Floor Lamp", watt: 36, lumens: 3240, efficiency: 90, features: "Direct/Indirect lighting" },
  { id: "sibylla", name: "Sibylla", category: "Hospitality", type: "Pendant", watt: 24, lumens: 2100, efficiency: 87.5, features: "Geometric designer lighting" },
  { id: "tomoko", name: "Tomoko", category: "Residential", type: "Table Lamp", watt: 15, lumens: 1100, efficiency: 73.3, features: "Soft-glow task lighting" },
  { id: "quantum", name: "Quantum", category: "Commercial", type: "Architectural", watt: 20, lumens: 1600, efficiency: 80, features: "High-performance recessed" },
  { id: "chichibio", name: "Chichibio", category: "Residential", type: "Floor Light", watt: 10, lumens: 800, efficiency: 80, features: "Slim profile, Low power" },
  { id: "busbar", name: "BusBar", category: "Infrastructure", type: "Power Track", watt: 15, lumens: null, efficiency: null, features: "Modular power rail system" },
  { id: "concrete", name: "Concrete LED", category: "Facade", type: "Custom Panel", watt: 25, lumens: 2000, efficiency: 80, features: "Integrated in facade panels" }
];

// ========================================
// INITIALIZE DATA ON PAGE LOAD
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  populateLightingSelect();
  initializeNavigation();
  setupEventListeners();
  initializeCharts();
  generateComparisonTable();
});

function populateLightingSelect() {
  const select = document.getElementById("lightSelect");
  select.innerHTML = '<option value="">-- Select a product --</option>';
  
  lightingProducts.forEach(product => {
    if (product.lumens) { // Only products with measurable light output
      const option = document.createElement("option");
      option.value = product.id;
      option.textContent = `${product.name} - ${product.watt}W (${product.efficiency} lm/W)`;
      select.appendChild(option);
    }
  });
}

// ========================================
// TAB NAVIGATION
// ========================================
function initializeNavigation() {
  const tabs = document.querySelectorAll(".nav-tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");
      
      // Remove active from all
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));
      
      // Add active to clicked
      tab.classList.add("active");
      document.getElementById(targetTab).classList.add("active");
      
      // Refresh charts if analytics tab
      if (targetTab === "analytics") {
        setTimeout(() => {
          updateAllCharts();
        }, 100);
      }
    });
  });
}

// ========================================
// EVENT LISTENERS
// ========================================
function setupEventListeners() {
  const lightSelect = document.getElementById("lightSelect");
  const quantity = document.getElementById("quantity");
  const usageHours = document.getElementById("usageHours");
  const rate = document.getElementById("rate");
  const categoryFilters = document.querySelectorAll(".category-filter");
  const resetFilters = document.getElementById("resetFilters");
  const getRecommendations = document.getElementById("getRecommendations");

  lightSelect.addEventListener("change", updateDashboard);
  quantity.addEventListener("change", updateDashboard);
  usageHours.addEventListener("change", updateDashboard);
  rate.addEventListener("change", updateDashboard);

  categoryFilters.forEach(filter => {
    filter.addEventListener("change", generateComparisonTable);
  });

  resetFilters.addEventListener("click", () => {
    categoryFilters.forEach(f => f.checked = false);
    generateComparisonTable();
  });

  getRecommendations.addEventListener("click", generateRecommendations);
}

// ========================================
// DASHBOARD UPDATES
// ========================================
function updateDashboard() {
  const lightId = document.getElementById("lightSelect").value;
  
  if (!lightId) {
    document.getElementById("specsCard").style.display = "none";
    return;
  }

  const product = lightingProducts.find(p => p.id === lightId);
  const quantity = parseInt(document.getElementById("quantity").value) || 1;
  const usageHours = parseFloat(document.getElementById("usageHours").value) || 6;
  const rate = parseFloat(document.getElementById("rate").value) || 8;

  // Update specs
  document.getElementById("specsCard").style.display = "block";
  document.getElementById("category").textContent = product.category;
  document.getElementById("type").textContent = product.type;
  document.getElementById("wattage").textContent = product.watt;
  document.getElementById("lumens").textContent = product.lumens;
  document.getElementById("efficiency").textContent = product.efficiency + " lm/W";
  document.getElementById("features").textContent = product.features;

  // Calculate energy & cost
  const dailyEnergy = (product.watt * usageHours * quantity) / 1000;
  const monthlyEnergy = dailyEnergy * 30;
  const monthlyCost = monthlyEnergy * rate;
  const annualCost = monthlyCost * 12;

  document.getElementById("dailyEnergy").textContent = dailyEnergy.toFixed(2);
  document.getElementById("monthlyEnergy").textContent = monthlyEnergy.toFixed(1);
  document.getElementById("monthlyCost").textContent = Math.round(monthlyCost);
  document.getElementById("annualCost").textContent = Math.round(annualCost);

  // Efficiency score (0-100)
  const maxEfficiency = 90; // Highest possible efficiency
  const score = Math.min((product.efficiency / maxEfficiency) * 100, 100);
  document.getElementById("scoreBar").style.width = score + "%";

  let scoreText = "Excellent";
  if (score >= 85) scoreText = "⭐ World-Class Efficiency";
  else if (score >= 75) scoreText = "✓ Highly Efficient";
  else if (score >= 60) scoreText = "→ Balanced Performance";
  else scoreText = "◄ Standard Efficiency";
  
  document.getElementById("scoreText").textContent = scoreText;

  // Industry comparison
  const avgEfficiency = lightingProducts.reduce((sum, p) => sum + (p.efficiency || 0), 0) / lightingProducts.filter(p => p.efficiency).length;
  const comparisonPercent = (product.efficiency / avgEfficiency) * 100;
  document.getElementById("efficiencyComp").style.width = Math.min(comparisonPercent, 100) + "%";
  document.getElementById("efficiencyCompValue").textContent = comparisonPercent.toFixed(0) + "%";

  const costPer1000Lumens = (product.watt / product.lumens) * 1000;
  document.getElementById("costPer1000").textContent = "₹" + costPer1000Lumens.toFixed(2) + " per 1000 lm";

  // Recommendation
  const recommendation = getProductRecommendation(product);
  document.getElementById("recommendation").textContent = recommendation;
}

function getProductRecommendation(product) {
  if (product.efficiency >= 85) return "⭐ Premium Choice - Exceptional efficiency";
  if (product.efficiency >= 75) return "✓ Recommended - Great value & performance";
  if (product.efficiency >= 70) return "◄ Good Option - Solid performance";
  return "→ Standard - Consider more efficient models";
}

// ========================================
// COMPARISON TABLE
// ========================================
function generateComparisonTable() {
  const checkedCategories = Array.from(document.querySelectorAll(".category-filter:checked")).map(el => el.value);
  
  let filtered = lightingProducts.filter(p => p.lumens);
  if (checkedCategories.length > 0) {
    filtered = filtered.filter(p => checkedCategories.includes(p.category));
  }

  filtered.sort((a, b) => b.efficiency - a.efficiency);

  const tableHTML = `
    <table class="comparison-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Category</th>
          <th>Type</th>
          <th>Wattage</th>
          <th>Lumens</th>
          <th>Efficiency (lm/W)</th>
          <th>Cost per 1000 lm</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.map(p => `
          <tr>
            <td><strong>${p.name}</strong></td>
            <td>${p.category}</td>
            <td>${p.type}</td>
            <td>${p.watt}W</td>
            <td>${p.lumens} lm</td>
            <td class="efficiency-col">
              <div class="eff-badge" style="width: ${(p.efficiency / 90) * 100}%">
                ${p.efficiency} lm/W
              </div>
            </td>
            <td>₹${(p.watt / p.lumens * 1000).toFixed(2)}</td>
            <td>${getEfficiencyRating(p.efficiency)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  document.getElementById("comparisonTable").innerHTML = tableHTML;
}

function getEfficiencyRating(efficiency) {
  if (efficiency >= 85) return "⭐⭐⭐ Premium";
  if (efficiency >= 75) return "⭐⭐ Excellent";
  if (efficiency >= 70) return "⭐ Good";
  return "Standard";
}

// ========================================
// ANALYTICS & CHARTS
// ========================================
let charts = {};

function initializeCharts() {
  updateAllCharts();
}

function updateAllCharts() {
  const productsWithLumens = lightingProducts.filter(p => p.lumens);
  const ctx1 = document.getElementById("efficiencyChart")?.getContext("2d");
  const ctx2 = document.getElementById("lumensChart")?.getContext("2d");
  const ctx3 = document.getElementById("topEfficiencyChart")?.getContext("2d");
  const ctx4 = document.getElementById("costChart")?.getContext("2d");

  if (ctx1) updateEfficiencyChart(ctx1, productsWithLumens);
  if (ctx2) updateLumensChart(ctx2, productsWithLumens);
  if (ctx3) updateTopEfficiencyChart(ctx3, productsWithLumens);
  if (ctx4) updateCostChart(ctx4, productsWithLumens);
}

function updateEfficiencyChart(ctx, products) {
  if (charts.efficiency) charts.efficiency.destroy();
  
  charts.efficiency = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [{
        label: "Product Efficiency",
        data: products.map(p => ({ x: p.watt, y: p.efficiency, label: p.name })),
        backgroundColor: products.map(p => {
          if (p.efficiency >= 85) return "#10b981";
          if (p.efficiency >= 75) return "#3b82f6";
          if (p.efficiency >= 70) return "#f59e0b";
          return "#ef4444";
        }),
        borderColor: "rgba(75, 192, 192, 1)",
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { title: { display: true, text: "Wattage (W)" }, ticks: { color: "#e5e7eb" }, grid: { color: "#1e293b" } },
        y: { title: { display: true, text: "Efficiency (lm/W)" }, ticks: { color: "#e5e7eb" }, grid: { color: "#1e293b" } }
      }
    }
  });
}

function updateLumensChart(ctx, products) {
  if (charts.lumens) charts.lumens.destroy();
  
  const categoryLumens = {};
  products.forEach(p => {
    categoryLumens[p.category] = (categoryLumens[p.category] || 0) + p.lumens;
  });

  charts.lumens = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: Object.keys(categoryLumens),
      datasets: [{
        data: Object.values(categoryLumens),
        backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"],
        borderColor: "#0f172a",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#e5e7eb" } } }
    }
  });
}

function updateTopEfficiencyChart(ctx, products) {
  if (charts.topEfficiency) charts.topEfficiency.destroy();
  
  const top10 = products.sort((a, b) => b.efficiency - a.efficiency).slice(0, 10);
  
  charts.topEfficiency = new Chart(ctx, {
    type: "bar",
    data: {
      labels: top10.map(p => p.name),
      datasets: [{
        label: "Efficiency (lm/W)",
        data: top10.map(p => p.efficiency),
        backgroundColor: "#10b981",
        borderColor: "#059669",
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { ticks: { color: "#e5e7eb" }, grid: { color: "#1e293b" } }, y: { ticks: { color: "#e5e7eb" } } }
    }
  });
}

function updateCostChart(ctx, products) {
  if (charts.cost) charts.cost.destroy();
  
  const categoryCosts = {};
  products.forEach(p => {
    const cost = p.watt / p.lumens * 1000;
    if (!categoryCosts[p.category]) categoryCosts[p.category] = [];
    categoryCosts[p.category].push(cost);
  });

  const avgCosts = {};
  Object.keys(categoryCosts).forEach(cat => {
    avgCosts[cat] = categoryCosts[cat].reduce((a, b) => a + b) / categoryCosts[cat].length;
  });

  charts.cost = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(avgCosts),
      datasets: [{
        label: "Avg Cost per 1000 Lumens (₹)",
        data: Object.values(avgCosts),
        backgroundColor: "#3b82f6",
        borderColor: "#1e40af",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#e5e7eb" } } },
      scales: { y: { ticks: { color: "#e5e7eb" }, grid: { color: "#1e293b" } }, x: { ticks: { color: "#e5e7eb" } } }
    }
  });
}

// ========================================
// RECOMMENDATIONS ENGINE
// ========================================
function generateRecommendations() {
  const minLumens = parseInt(document.getElementById("minLumens").value) || 0;
  const maxWattage = parseInt(document.getElementById("maxWattage").value) || 100;
  const appCategory = document.getElementById("appCategory").value;
  const priority = document.getElementById("priority").value;

  let recommended = lightingProducts.filter(p => 
    p.lumens && 
    p.lumens >= minLumens && 
    p.watt <= maxWattage &&
    (!appCategory || p.category === appCategory)
  );

  // Sort by priority
  if (priority === "efficiency") {
    recommended.sort((a, b) => b.efficiency - a.efficiency);
  } else if (priority === "cost") {
    recommended.sort((a, b) => {
      const costA = a.watt / a.lumens;
      const costB = b.watt / b.lumens;
      return costA - costB;
    });
  } else if (priority === "lumens") {
    recommended.sort((a, b) => b.lumens - a.lumens);
  }

  const resultsHTML = `
    <div class="results-grid">
      ${recommended.slice(0, 6).map(p => `
        <div class="recommendation-card">
          <div class="rec-header">
            <h4>${p.name}</h4>
            <span class="rec-badge">${getEfficiencyRating(p.efficiency)}</span>
          </div>
          <p class="rec-category">${p.category} • ${p.type}</p>
          
          <div class="rec-stats">
            <div class="rec-stat">
              <span class="stat-label">Wattage</span>
              <span class="stat-value">${p.watt}W</span>
            </div>
            <div class="rec-stat">
              <span class="stat-label">Lumens</span>
              <span class="stat-value">${p.lumens} lm</span>
            </div>
            <div class="rec-stat highlight">
              <span class="stat-label">Efficiency</span>
              <span class="stat-value">${p.efficiency} lm/W</span>
            </div>
          </div>
          
          <p class="rec-features">${p.features}</p>
          <button class="btn-tertiary" onclick="selectProduct('${p.id}')">Use This Model</button>
        </div>
      `).join('')}
    </div>
    ${recommended.length === 0 ? '<p class="no-results">No products match your criteria. Try adjusting your requirements.</p>' : ''}
  `;

  document.getElementById("recommendationsResults").innerHTML = resultsHTML;
}

function selectProduct(productId) {
  document.getElementById("lightSelect").value = productId;
  updateDashboard();
  // Scroll to dashboard
  document.querySelector('[data-tab="dashboard"]').click();
}
