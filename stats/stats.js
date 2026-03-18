// Applique le thème sauvegardé
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

// Affiche le nom utilisateur dans la sidebar
const nom = localStorage.getItem("username");
if (nom) {
  document.getElementById("sidebar-username").textContent = nom;
  document.getElementById("sidebar-avatar").textContent = nom
    .charAt(0)
    .toUpperCase();
}

// ─────────────────────────────────────────────
// Récupération des données depuis localStorage
// (partagé entre toutes les pages du même domaine)
// ─────────────────────────────────────────────
const donneesStockees = localStorage.getItem("transactions");
const transactions = donneesStockees ? JSON.parse(donneesStockees) : [];

// ─────────────────────────────────────────────
// CARDS : recalcule les soldes (même logique que script.js)
// ─────────────────────────────────────────────
function afficherSoldes() {
  const totalRevenus = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.montant, 0);
  const totalDepenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.montant, 0);
  const solde = totalRevenus - totalDepenses;

  document.getElementById("solde-total").textContent = solde.toFixed(2) + " €";
  document.getElementById("total-revenus").textContent =
    "+ " + totalRevenus.toFixed(2) + " €";
  document.getElementById("total-depenses").textContent =
    "- " + totalDepenses.toFixed(2) + " €";
}

afficherSoldes();

// ─────────────────────────────────────────────
// GRAPHIQUE 1 : Donut — dépenses par catégorie
// ─────────────────────────────────────────────

// On filtre uniquement les dépenses
const depenses = transactions.filter((t) => t.type === "expense");

// On regroupe par catégorie : { alimentation: 120, transport: 45, ... }
const parCategorie = {};
depenses.forEach(function (t) {
  if (t.categorie in parCategorie) {
    parCategorie[t.categorie] += t.montant;
  } else {
    parCategorie[t.categorie] = t.montant;
  }
});

const donutContainer = document.getElementById("donut-container");

if (depenses.length === 0) {
  // État vide : pas encore de dépenses
  donutContainer.innerHTML = `
    <div class="empty-state">
      <span>💸</span>
      <p>Aucune dépense enregistrée</p>
    </div>
  `;
} else {
  // On crée un canvas pour Chart.js
  donutContainer.innerHTML = `<canvas id="donut-chart"></canvas>`;

  const ctxDonut = document.getElementById("donut-chart").getContext("2d");

  new Chart(ctxDonut, {
    type: "doughnut",
    data: {
      labels: Object.keys(parCategorie), // ["alimentation", "transport", ...]
      datasets: [
        {
          data: Object.values(parCategorie), // [120, 45, ...]
          backgroundColor: [
            "#FFCC0A",
            "#222C56",
            "#099B3E",
            "#d63030",
            "#4a5a8a",
            "#FFF1BD",
          ],
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 16,
            font: { size: 13 },
          },
        },
        tooltip: {
          callbacks: {
            // Affiche le montant en € dans le tooltip
            label: function (context) {
              return " " + context.parsed.toFixed(2) + " €";
            },
          },
        },
      },
    },
  });
}

// ─────────────────────────────────────────────
// GRAPHIQUE 2 : Courbe — évolution du solde
// ─────────────────────────────────────────────

// On trie les transactions par date (id = timestamp Date.now())
const triees = [...transactions].sort((a, b) => a.id - b.id);

// On calcule le solde cumulé après chaque transaction
let soldeCumulé = 0;
const labels = []; // axe X : numéro de transaction ou date
const valeurs = []; // axe Y : solde à ce moment

triees.forEach(function (t, index) {
  if (t.type === "income") {
    soldeCumulé += t.montant;
  } else {
    soldeCumulé -= t.montant;
  }
  labels.push(t.description); // on affiche la description comme label
  valeurs.push(parseFloat(soldeCumulé.toFixed(2)));
});

const courbeContainer = document.getElementById("courbe-container");

if (transactions.length === 0) {
  courbeContainer.innerHTML = `
    <div class="empty-state">
      <span>📈</span>
      <p>Aucune transaction enregistrée</p>
    </div>
  `;
} else {
  courbeContainer.innerHTML = `<canvas id="courbe-chart"></canvas>`;

  const ctxCourbe = document.getElementById("courbe-chart").getContext("2d");

  new Chart(ctxCourbe, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Solde (€)",
          data: valeurs,
          borderColor: "#222C56",
          backgroundColor: "rgba(34, 44, 86, 0.06)",
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: "#FFCC0A",
          tension: 0.3, // courbe légèrement arrondie
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              return " " + context.parsed.y.toFixed(2) + " €";
            },
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: function (value) {
              return value + " €";
            },
          },
          grid: {
            color: "rgba(0,0,0,0.04)",
          },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  });
}

lucide.createIcons();
