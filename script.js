// 0-Général, création d'un tableau vide pour enregistrer les futures transactions
const transactions = [];

// 0.1-Fonction pour update les totaux
function updateSoldes() {
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

//  1-Récupérer l'élément HTML button
const addButton = document.getElementById("button-add");

// 1.1-Lui assigner une fonction d'écoute au click
addButton.addEventListener("click", function () {
  const description = document.getElementById("description").value;
  const montant = document.getElementById("montant").value;
  const type = document.getElementById("type").value;
  const categorie = document.getElementById("categorie").value;
  const transaction = {
    description: description,
    montant: parseFloat(montant),
    type: type,
    categorie: categorie,
  };

  // 1.2-Ajouter les nouvelles transactions au tableau transaction et afficher
  transactions.push(transaction);
  console.log(transactions);

  // 1.3-Appeller la fonction d'update des totaux
  updateSoldes();

  // 1.4-Pour stocker la donnée: transforme le tableau des transactions en données texte
  localStorage.setItem("transactions", JSON.stringify(transactions));

  // 1.5-Récupérer l'élément HTML 'transactions-list' pour identifier où on va afficher les transactions
  const liste = document.getElementById("transactions-list");

  // 1.6-Ajout de code HTML via JS (ajouter la liste des transactions à la suite sur la page)
  liste.innerHTML += `
  <div class="transaction-item ${transaction.type}">
    <span>${transaction.description}</span>
    <span>${transaction.categorie}</span>
    <span class="${transaction.type}">
        ${transaction.type === "expense" ? "- " : "+ "}${transaction.montant} €
    </span>
    </div>
  `;

  document.getElementById("description").value = "";
  document.getElementById("montant").value = "";

  console.log(transaction);
});

// 2-Créer une fonction de stockage local des données (ne pas supprimer après un refresh)
const donneesStockees = localStorage.getItem("transactions");

// 2.1-Condition si 'non vide' à l'ouverture, alors jouer la fonction
if (donneesStockees) {
  const transactionsSauvegardees = JSON.parse(donneesStockees);
  transactionsSauvegardees.forEach(function (transaction) {
    transactions.push(transaction);
    const liste = document.getElementById("transactions-list");
    liste.innerHTML += `
      <div class="transaction-item ${transaction.type}">
        <span>${transaction.description}</span>
        <span>${transaction.categorie}</span>
        <span class="${transaction.type}">
          ${transaction.type === "expense" ? "- " : "+ "}${transaction.montant} €
        </span>
      </div>
    `;
  });

  updateSoldes();
}
