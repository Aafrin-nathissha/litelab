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
  initializeWorkspace();
  loadSavedProjects();
  loadWorkspaceFromUrl();
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
  const roomWidth = document.getElementById("roomWidth");
  const roomHeight = document.getElementById("roomHeight");
  const gridSize = document.getElementById("gridSize");
  const clearLayout = document.getElementById("clearLayout");
  const exportProject = document.getElementById("exportProject");
  const saveProject = document.getElementById("saveProject");
  const loadProjectBtn = document.getElementById("loadProjectBtn");
  const baselineWatt = document.getElementById("baselineWatt");
  const upgradeCost = document.getElementById("upgradeCost");
  const exportPdf = document.getElementById("exportPdf");
  const toggleHeatmap = document.getElementById("toggleHeatmap");
  const workspacePreset = document.getElementById("workspacePreset");
  const shareProject = document.getElementById("shareProject");

  lightSelect.addEventListener("change", updateDashboard);
  quantity.addEventListener("change", updateDashboard);
  usageHours.addEventListener("change", () => {
    updateDashboard();
    updateWorkspaceSummary();
  });
  rate.addEventListener("change", () => {
    updateDashboard();
    updateWorkspaceSummary();
  });

  categoryFilters.forEach(filter => {
    filter.addEventListener("change", generateComparisonTable);
  });

  resetFilters.addEventListener("click", () => {
    categoryFilters.forEach(f => f.checked = false);
    generateComparisonTable();
  });

  getRecommendations.addEventListener("click", generateRecommendations);

  baselineWatt.addEventListener("change", updateROI);
  upgradeCost.addEventListener("change", updateROI);

  roomWidth.addEventListener("change", updateWorkspaceDimensions);
  roomHeight.addEventListener("change", updateWorkspaceDimensions);
  gridSize.addEventListener("change", updateWorkspaceDimensions);
  clearLayout.addEventListener("click", clearWorkspaceLayout);
  exportProject.addEventListener("click", exportWorkspaceProject);
  saveProject.addEventListener("click", saveWorkspaceProject);
  loadProjectBtn.addEventListener("click", loadWorkspaceProject);
  exportPdf.addEventListener("click", exportWorkspacePdf);
  shareProject.addEventListener("click", shareWorkspaceLink);
  toggleHeatmap.addEventListener("change", () => {
    workspaceState.showHeatmap = toggleHeatmap.checked;
    renderWorkspace();
  });
  workspacePreset.addEventListener("change", applyWorkspacePreset);
}

// ========================================
// DASHBOARD UPDATES
// ========================================
function updateDashboard() {
  const lightId = document.getElementById("lightSelect").value;
  
  if (!lightId) {
    document.getElementById("specsCard").style.display = "none";
    updateROI(null);
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

  updateROI(product);
}

function updateROI(product) {
  const annualSavingsEl = document.getElementById("annualSavings");
  const paybackEl = document.getElementById("paybackPeriod");
  const noteEl = document.getElementById("roiNote");
  if (!annualSavingsEl || !paybackEl || !noteEl) return;

  if (!product) {
    annualSavingsEl.textContent = "₹0";
    paybackEl.textContent = "--";
    noteEl.textContent = "Select a product to calculate ROI.";
    return;
  }

  const baselineWatt = parseFloat(document.getElementById("baselineWatt").value) || 0;
  const upgradeCost = parseFloat(document.getElementById("upgradeCost").value) || 0;
  const quantity = parseInt(document.getElementById("quantity").value) || 1;
  const usageHours = parseFloat(document.getElementById("usageHours").value) || 6;
  const rate = parseFloat(document.getElementById("rate").value) || 8;

  const wattDelta = baselineWatt - product.watt;
  const annualSavings = (wattDelta * usageHours * quantity * 365 / 1000) * rate;
  const monthlySavings = annualSavings / 12;

  annualSavingsEl.textContent = `₹${Math.round(annualSavings)}`;
  if (monthlySavings > 0 && upgradeCost > 0) {
    const paybackMonths = upgradeCost / monthlySavings;
    paybackEl.textContent = `${paybackMonths.toFixed(1)} months`;
    noteEl.textContent = "Positive savings vs baseline lighting.";
  } else if (annualSavings <= 0) {
    paybackEl.textContent = "No payback";
    noteEl.textContent = "Selected fixture uses equal or more power than baseline.";
  } else {
    paybackEl.textContent = "--";
    noteEl.textContent = "Add upgrade cost to estimate payback period.";
  }
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

// ========================================
// PROJECT WORKSPACE
// ========================================
const workspaceState = {
  roomWidth: 12,
  roomHeight: 8,
  gridSize: 0.5,
  fixtures: [],
  selectedId: null,
  draggingId: null,
  dragOffset: { x: 0, y: 0 },
  showHeatmap: true
};

const workspacePresets = {
  gallery: {
    roomWidth: 18,
    roomHeight: 10,
    fixtures: [
      { productId: "a30", x: 4, y: 3 },
      { productId: "a30", x: 9, y: 3 },
      { productId: "a30", x: 14, y: 3 },
      { productId: "c30", x: 4, y: 7 },
      { productId: "c30", x: 9, y: 7 },
      { productId: "c30", x: 14, y: 7 }
    ]
  },
  office: {
    roomWidth: 20,
    roomHeight: 12,
    fixtures: [
      { productId: "lcs", x: 4, y: 3 },
      { productId: "lcs", x: 10, y: 3 },
      { productId: "lcs", x: 16, y: 3 },
      { productId: "lwh", x: 4, y: 9 },
      { productId: "lwh", x: 10, y: 9 },
      { productId: "lwh", x: 16, y: 9 }
    ]
  },
  hotel: {
    roomWidth: 14,
    roomHeight: 10,
    fixtures: [
      { productId: "sibylla", x: 4, y: 4 },
      { productId: "sibylla", x: 10, y: 4 },
      { productId: "astolfo", x: 4, y: 8 },
      { productId: "astolfo", x: 10, y: 8 }
    ]
  },
  facade: {
    roomWidth: 22,
    roomHeight: 6,
    fixtures: [
      { productId: "modular", x: 3, y: 3 },
      { productId: "modular", x: 8, y: 3 },
      { productId: "modular", x: 13, y: 3 },
      { productId: "modular", x: 18, y: 3 }
    ]
  }
};

let workspaceCanvas = null;
let workspaceCtx = null;

function initializeWorkspace() {
  workspaceCanvas = document.getElementById("floorCanvas");
  if (!workspaceCanvas) return;
  workspaceCtx = workspaceCanvas.getContext("2d");

  buildFixtureLibrary();
  syncWorkspaceInputs();
  resizeWorkspaceCanvas();
  renderWorkspace();
  updateWorkspaceSummary();

  workspaceCanvas.addEventListener("mousedown", onWorkspaceMouseDown);
  workspaceCanvas.addEventListener("mousemove", onWorkspaceMouseMove);
  workspaceCanvas.addEventListener("mouseup", onWorkspaceMouseUp);
  workspaceCanvas.addEventListener("mouseleave", onWorkspaceMouseUp);

  window.addEventListener("resize", () => {
    resizeWorkspaceCanvas();
    renderWorkspace();
  });
}

function buildFixtureLibrary() {
  const container = document.getElementById("fixtureLibrary");
  if (!container) return;
  container.innerHTML = "";

  lightingProducts.filter(p => p.lumens).forEach(product => {
    const card = document.createElement("div");
    card.className = "fixture-card";
    card.innerHTML = `
      <div>
        <strong>${product.name}</strong>
        <div class="fixture-meta">${product.type} • ${product.watt}W • ${product.efficiency} lm/W</div>
      </div>
      <button class="btn-tertiary" data-product="${product.id}">Add</button>
    `;
    card.querySelector("button").addEventListener("click", () => addFixtureToWorkspace(product.id));
    container.appendChild(card);
  });
}

function syncWorkspaceInputs() {
  const roomWidth = document.getElementById("roomWidth");
  const roomHeight = document.getElementById("roomHeight");
  const gridSize = document.getElementById("gridSize");
  if (roomWidth) roomWidth.value = workspaceState.roomWidth;
  if (roomHeight) roomHeight.value = workspaceState.roomHeight;
  if (gridSize) gridSize.value = workspaceState.gridSize;
}

function updateWorkspaceDimensions() {
  const roomWidth = parseFloat(document.getElementById("roomWidth").value) || 12;
  const roomHeight = parseFloat(document.getElementById("roomHeight").value) || 8;
  const gridSize = parseFloat(document.getElementById("gridSize").value) || 0.5;

  workspaceState.roomWidth = roomWidth;
  workspaceState.roomHeight = roomHeight;
  workspaceState.gridSize = gridSize;

  resizeWorkspaceCanvas();
  renderWorkspace();
  updateWorkspaceSummary();
}

function resizeWorkspaceCanvas() {
  if (!workspaceCanvas) return;
  const ratio = window.devicePixelRatio || 1;
  const rect = workspaceCanvas.getBoundingClientRect();
  workspaceCanvas.width = rect.width * ratio;
  workspaceCanvas.height = rect.height * ratio;
  workspaceCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function getWorkspaceScale() {
  const width = workspaceCanvas.clientWidth;
  const height = workspaceCanvas.clientHeight;
  const scale = Math.min(width / workspaceState.roomWidth, height / workspaceState.roomHeight);
  const offsetX = (width - workspaceState.roomWidth * scale) / 2;
  const offsetY = (height - workspaceState.roomHeight * scale) / 2;
  return { scale, offsetX, offsetY };
}

function renderWorkspace() {
  if (!workspaceCtx || !workspaceCanvas) return;
  const ctx = workspaceCtx;
  const { scale, offsetX, offsetY } = getWorkspaceScale();

  ctx.clearRect(0, 0, workspaceCanvas.clientWidth, workspaceCanvas.clientHeight);

  // Background
  ctx.fillStyle = "#0b1226";
  ctx.fillRect(0, 0, workspaceCanvas.clientWidth, workspaceCanvas.clientHeight);

  // Grid
  ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
  ctx.lineWidth = 1;
  const grid = workspaceState.gridSize;
  for (let x = 0; x <= workspaceState.roomWidth; x += grid) {
    const px = offsetX + x * scale;
    ctx.beginPath();
    ctx.moveTo(px, offsetY);
    ctx.lineTo(px, offsetY + workspaceState.roomHeight * scale);
    ctx.stroke();
  }
  for (let y = 0; y <= workspaceState.roomHeight; y += grid) {
    const py = offsetY + y * scale;
    ctx.beginPath();
    ctx.moveTo(offsetX, py);
    ctx.lineTo(offsetX + workspaceState.roomWidth * scale, py);
    ctx.stroke();
  }

  // Room boundary
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 2;
  ctx.strokeRect(offsetX, offsetY, workspaceState.roomWidth * scale, workspaceState.roomHeight * scale);

  // Heatmap layer
  if (workspaceState.showHeatmap) {
    renderHeatmapLayer(ctx, scale, offsetX, offsetY);
  }

  // Fixtures
  workspaceState.fixtures.forEach(fixture => {
    const x = offsetX + fixture.x * scale;
    const y = offsetY + fixture.y * scale;
    const radius = 12;

    ctx.beginPath();
    ctx.fillStyle = fixture.id === workspaceState.selectedId ? "#22c55e" : "#3b82f6";
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#0f172a";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(fixture.label, x, y);
  });
}

function renderHeatmapLayer(ctx, scale, offsetX, offsetY) {
  if (workspaceState.fixtures.length === 0) return;
  const maxLumens = Math.max(...workspaceState.fixtures.map(f => f.lumens || 0), 1);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.6;

  workspaceState.fixtures.forEach(fixture => {
    const intensity = (fixture.lumens || 0) / maxLumens;
    const radiusMeters = Math.max(1.5, Math.min(5, (fixture.lumens || 0) / 1000 * 2));
    const radius = radiusMeters * scale;
    const x = offsetX + fixture.x * scale;
    const y = offsetY + fixture.y * scale;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(16, 185, 129, ${0.45 + intensity * 0.35})`);
    gradient.addColorStop(0.4, `rgba(59, 130, 246, ${0.25 + intensity * 0.25})`);
    gradient.addColorStop(1, "rgba(15, 23, 42, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function addFixtureToWorkspace(productId) {
  const product = lightingProducts.find(p => p.id === productId);
  if (!product) return;
  const newFixture = {
    id: `fx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    productId: product.id,
    label: product.name[0].toUpperCase(),
    name: product.name,
    watt: product.watt,
    lumens: product.lumens,
    x: workspaceState.roomWidth / 2,
    y: workspaceState.roomHeight / 2
  };
  workspaceState.fixtures.push(newFixture);
  workspaceState.selectedId = newFixture.id;
  renderWorkspace();
  updateWorkspaceSummary();
}

function onWorkspaceMouseDown(event) {
  const { scale, offsetX, offsetY } = getWorkspaceScale();
  const rect = workspaceCanvas.getBoundingClientRect();
  const mx = event.clientX - rect.left;
  const my = event.clientY - rect.top;

  const hit = workspaceState.fixtures.find(fixture => {
    const fx = offsetX + fixture.x * scale;
    const fy = offsetY + fixture.y * scale;
    return Math.hypot(mx - fx, my - fy) <= 14;
  });

  if (hit) {
    workspaceState.selectedId = hit.id;
    workspaceState.draggingId = hit.id;
    workspaceState.dragOffset = {
      x: (mx - (offsetX + hit.x * scale)) / scale,
      y: (my - (offsetY + hit.y * scale)) / scale
    };
  } else {
    workspaceState.selectedId = null;
  }
  renderWorkspace();
}

function onWorkspaceMouseMove(event) {
  if (!workspaceState.draggingId) return;
  const fixture = workspaceState.fixtures.find(f => f.id === workspaceState.draggingId);
  if (!fixture) return;

  const { scale, offsetX, offsetY } = getWorkspaceScale();
  const rect = workspaceCanvas.getBoundingClientRect();
  const mx = event.clientX - rect.left;
  const my = event.clientY - rect.top;

  let nx = (mx - offsetX) / scale - workspaceState.dragOffset.x;
  let ny = (my - offsetY) / scale - workspaceState.dragOffset.y;

  nx = Math.max(0, Math.min(workspaceState.roomWidth, nx));
  ny = Math.max(0, Math.min(workspaceState.roomHeight, ny));

  fixture.x = nx;
  fixture.y = ny;
  renderWorkspace();
}

function onWorkspaceMouseUp() {
  if (workspaceState.draggingId) {
    workspaceState.draggingId = null;
    updateWorkspaceSummary();
  }
}

function updateWorkspaceSummary() {
  const count = workspaceState.fixtures.length;
  const totalWatt = workspaceState.fixtures.reduce((sum, f) => sum + f.watt, 0);
  const totalLumens = workspaceState.fixtures.reduce((sum, f) => sum + f.lumens, 0);
  const area = workspaceState.roomWidth * workspaceState.roomHeight;
  const density = area ? totalWatt / area : 0;

  const usageHours = parseFloat(document.getElementById("usageHours")?.value) || 6;
  const rate = parseFloat(document.getElementById("rate")?.value) || 8;
  const monthlyEnergy = (totalWatt * usageHours * 30) / 1000;
  const monthlyCost = monthlyEnergy * rate;

  document.getElementById("summaryCount").textContent = count;
  document.getElementById("summaryWatt").textContent = `${totalWatt.toFixed(0)} W`;
  document.getElementById("summaryLumens").textContent = `${totalLumens.toFixed(0)} lm`;
  document.getElementById("summaryDensity").textContent = `${density.toFixed(2)} W/m²`;
  document.getElementById("summaryCost").textContent = `₹${Math.round(monthlyCost)}`;

  updateBOM();
}

function updateBOM() {
  const bom = {};
  workspaceState.fixtures.forEach(f => {
    if (!bom[f.productId]) {
      bom[f.productId] = { name: f.name, watt: f.watt, lumens: f.lumens, count: 0 };
    }
    bom[f.productId].count += 1;
  });

  const bomList = document.getElementById("bomList");
  bomList.innerHTML = "";
  Object.values(bom).forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <div class="bom-meta">${item.watt}W • ${item.lumens} lm</div>
      </div>
      <span class="bom-count">x${item.count}</span>
    `;
    bomList.appendChild(li);
  });

  if (Object.keys(bom).length === 0) {
    const li = document.createElement("li");
    li.className = "bom-empty";
    li.textContent = "No fixtures placed yet.";
    bomList.appendChild(li);
  }
}

function clearWorkspaceLayout() {
  workspaceState.fixtures = [];
  workspaceState.selectedId = null;
  renderWorkspace();
  updateWorkspaceSummary();
}

function saveWorkspaceProject() {
  const nameInput = document.getElementById("projectName");
  const name = (nameInput.value || "Untitled Project").trim();
  const project = {
    id: `proj_${Date.now()}`,
    name,
    createdAt: new Date().toISOString(),
    state: {
      roomWidth: workspaceState.roomWidth,
      roomHeight: workspaceState.roomHeight,
      gridSize: workspaceState.gridSize,
      fixtures: workspaceState.fixtures
    }
  };

  const projects = getSavedProjects();
  projects.unshift(project);
  localStorage.setItem("litelabProjects", JSON.stringify(projects));
  nameInput.value = "";
  loadSavedProjects();
}

function loadSavedProjects() {
  const select = document.getElementById("loadProject");
  if (!select) return;
  select.innerHTML = '<option value="">Select saved project</option>';
  getSavedProjects().forEach(project => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = `${project.name} (${new Date(project.createdAt).toLocaleDateString()})`;
    select.appendChild(option);
  });
}

function loadWorkspaceProject() {
  const select = document.getElementById("loadProject");
  const projectId = select.value;
  if (!projectId) return;

  const project = getSavedProjects().find(p => p.id === projectId);
  if (!project) return;

  workspaceState.roomWidth = project.state.roomWidth;
  workspaceState.roomHeight = project.state.roomHeight;
  workspaceState.gridSize = project.state.gridSize;
  workspaceState.fixtures = project.state.fixtures || [];
  workspaceState.selectedId = null;

  syncWorkspaceInputs();
  resizeWorkspaceCanvas();
  renderWorkspace();
  updateWorkspaceSummary();
}

function getSavedProjects() {
  return JSON.parse(localStorage.getItem("litelabProjects") || "[]");
}

function exportWorkspaceProject() {
  const payload = {
    name: document.getElementById("projectName").value || "LiteLab Project",
    createdAt: new Date().toISOString(),
    room: {
      width: workspaceState.roomWidth,
      height: workspaceState.roomHeight,
      gridSize: workspaceState.gridSize
    },
    fixtures: workspaceState.fixtures
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "litelab-project.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function applyWorkspacePreset(event) {
  const presetKey = event.target.value;
  if (!presetKey || !workspacePresets[presetKey]) return;
  const preset = workspacePresets[presetKey];

  workspaceState.roomWidth = preset.roomWidth;
  workspaceState.roomHeight = preset.roomHeight;
  workspaceState.fixtures = preset.fixtures.map((item, index) => {
    const product = lightingProducts.find(p => p.id === item.productId);
    return {
      id: `fx_preset_${presetKey}_${index}`,
      productId: product.id,
      label: product.name[0].toUpperCase(),
      name: product.name,
      watt: product.watt,
      lumens: product.lumens,
      x: item.x,
      y: item.y
    };
  });

  syncWorkspaceInputs();
  resizeWorkspaceCanvas();
  renderWorkspace();
  updateWorkspaceSummary();
}

function exportWorkspacePdf() {
  const jspdf = window.jspdf?.jsPDF;
  if (!jspdf) return;

  const doc = new jspdf();
  const projectName = document.getElementById("projectName").value || "LiteLab Project";
  const totalWatt = workspaceState.fixtures.reduce((sum, f) => sum + f.watt, 0);
  const totalLumens = workspaceState.fixtures.reduce((sum, f) => sum + f.lumens, 0);
  const count = workspaceState.fixtures.length;
  const area = workspaceState.roomWidth * workspaceState.roomHeight;
  const density = area ? totalWatt / area : 0;
  const usageHours = parseFloat(document.getElementById("usageHours")?.value) || 6;
  const rate = parseFloat(document.getElementById("rate")?.value) || 8;
  const monthlyEnergy = (totalWatt * usageHours * 30) / 1000;
  const monthlyCost = monthlyEnergy * rate;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("LiteLab Lighting Project Summary", 14, 18);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Project: ${projectName}`, 14, 28);
  doc.text(`Room: ${workspaceState.roomWidth}m x ${workspaceState.roomHeight}m`, 14, 36);
  doc.text(`Grid: ${workspaceState.gridSize}m`, 14, 44);

  doc.setFont("helvetica", "bold");
  doc.text("Totals", 14, 58);
  doc.setFont("helvetica", "normal");
  doc.text(`Fixtures: ${count}`, 14, 66);
  doc.text(`Total Wattage: ${totalWatt.toFixed(0)} W`, 14, 74);
  doc.text(`Total Lumens: ${totalLumens.toFixed(0)} lm`, 14, 82);
  doc.text(`Power Density: ${density.toFixed(2)} W/m²`, 14, 90);
  doc.text(`Monthly Cost: ₹${Math.round(monthlyCost)}`, 14, 98);

  doc.setFont("helvetica", "bold");
  doc.text("Bill of Materials", 14, 112);
  doc.setFont("helvetica", "normal");

  const bom = {};
  workspaceState.fixtures.forEach(f => {
    if (!bom[f.productId]) {
      bom[f.productId] = { name: f.name, watt: f.watt, lumens: f.lumens, count: 0 };
    }
    bom[f.productId].count += 1;
  });

  let y = 120;
  const lines = Object.values(bom);
  if (lines.length === 0) {
    doc.text("No fixtures placed.", 14, y);
  } else {
    lines.forEach(item => {
      doc.text(`${item.name} • ${item.watt}W • ${item.lumens} lm  x${item.count}`, 14, y);
      y += 8;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
  }

  doc.save("litelab-project.pdf");
}

function shareWorkspaceLink() {
  const payload = {
    name: document.getElementById("projectName").value || "LiteLab Project",
    room: {
      width: workspaceState.roomWidth,
      height: workspaceState.roomHeight,
      gridSize: workspaceState.gridSize
    },
    fixtures: workspaceState.fixtures
  };

  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  const url = `${window.location.origin}${window.location.pathname}?project=${encoded}`;

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url).then(() => showToast("Share link copied"));
  } else {
    const temp = document.createElement("textarea");
    temp.value = url;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    showToast("Share link copied");
  }
}

function loadWorkspaceFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("project");
  if (!encoded) return;

  try {
    const decoded = decodeURIComponent(escape(atob(encoded)));
    const payload = JSON.parse(decoded);
    const fixtures = (payload.fixtures || []).map((item, index) => {
      const product = lightingProducts.find(p => p.id === item.productId);
      return {
        id: `fx_shared_${index}`,
        productId: product?.id || item.productId,
        label: (product?.name || item.name || "F")[0].toUpperCase(),
        name: product?.name || item.name || "Fixture",
        watt: product?.watt || item.watt || 0,
        lumens: product?.lumens || item.lumens || 0,
        x: item.x,
        y: item.y
      };
    });

    workspaceState.roomWidth = payload.room?.width || workspaceState.roomWidth;
    workspaceState.roomHeight = payload.room?.height || workspaceState.roomHeight;
    workspaceState.gridSize = payload.room?.gridSize || workspaceState.gridSize;
    workspaceState.fixtures = fixtures;
    workspaceState.selectedId = null;

    const nameInput = document.getElementById("projectName");
    if (nameInput) nameInput.value = payload.name || "";

    syncWorkspaceInputs();
    resizeWorkspaceCanvas();
    renderWorkspace();
    updateWorkspaceSummary();
    showToast("Shared project loaded");
  } catch (error) {
    console.error("Failed to load shared project", error);
  }
}

function showToast(message) {
  let toast = document.getElementById("appToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "appToast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}
