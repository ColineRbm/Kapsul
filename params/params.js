// ─────────────────────────────────────────────
// UTILITAIRE : applique le thème au chargement
// (partagé avec toutes les pages via localStorage)
// ─────────────────────────────────────────────
function appliquerTheme(dark) {
  if (dark) {
    document.body.classList.add("dark");
    document.getElementById("theme-label").textContent = "Mode sombre";
  } else {
    document.body.classList.remove("dark");
    document.getElementById("theme-label").textContent = "Mode clair";
  }
}

// ─────────────────────────────────────────────
// INITIALISATION : lecture du localStorage
// ─────────────────────────────────────────────

// Nom d'utilisateur
const nomStocke = localStorage.getItem("username");
if (nomStocke) {
  document.getElementById("input-username").value = nomStocke;
  document.getElementById("sidebar-username").textContent = nomStocke;
  document.getElementById("sidebar-avatar").textContent = nomStocke.charAt(0).toUpperCase();
}

// Thème
const darkStocke = localStorage.getItem("darkMode") === "true";
document.getElementById("toggle-theme").checked = darkStocke;
appliquerTheme(darkStocke);

// ─────────────────────────────────────────────
// 1 - Sauvegarder le nom d'utilisateur
// ─────────────────────────────────────────────
document.getElementById("btn-save-username").addEventListener("click", function () {
  const nom = document.getElementById("input-username").value.trim();

  if (!nom) return; // on ne sauvegarde pas si le champ est vide

  localStorage.setItem("username", nom);

  // Mise à jour immédiate de la sidebar
  document.getElementById("sidebar-username").textContent = nom;
  document.getElementById("sidebar-avatar").textContent = nom.charAt(0).toUpperCase();

  // Feedback visuel
  const feedback = document.getElementById("username-feedback");
  feedback.style.display = "block";
  setTimeout(function () {
    feedback.style.display = "none";
  }, 2000); // disparaît après 2 secondes
});

// ─────────────────────────────────────────────
// 2 - Toggle thème clair / sombre
// ─────────────────────────────────────────────
document.getElementById("toggle-theme").addEventListener("change", function () {
  const isDark = this.checked; // true si coché
  localStorage.setItem("darkMode", isDark);
  appliquerTheme(isDark);
});

// ─────────────────────────────────────────────
// 3 - Réinitialiser toutes les données
// ─────────────────────────────────────────────
document.getElementById("btn-reset").addEventListener("click", function () {
  const confirmation = confirm(
    "Es-tu sûre de vouloir supprimer toutes les transactions ? Cette action est irréversible."
  );

  if (!confirmation) return;

  // On supprime uniquement les transactions, pas les préférences
  localStorage.removeItem("transactions");

  alert("Toutes les transactions ont été supprimées.");
});

lucide.createIcons();
