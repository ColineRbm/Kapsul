// 0-Général, création d'un tableau vide pour enregistrer les futures transactions
const transactions = [];

// Fonction pour update les totaux
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
} // ← FIN updateSoldes

// 1-Récupérer l'élément HTML button
const addButton = document.getElementById("button-add");

// 1.1-Lui assigner une fonction d'écoute au click
addButton.addEventListener("click", function () {
  const description = document.getElementById("description").value;
  const montant = document.getElementById("montant").value;
  const type = document.getElementById("type").value;
  const categorie = document.getElementById("categorie").value;

  const transaction = {
    id: Date.now(),
    description: description,
    montant: parseFloat(montant),
    type: type,
    categorie: categorie,
  };

  // 1.2-Ajouter les nouvelles transactions au tableau
  transactions.push(transaction);

  // 1.3-Appeler la fonction d'update des totaux
  updateSoldes();

  // 1.4-Stocker la donnée en localStorage
  localStorage.setItem("transactions", JSON.stringify(transactions));

  // 1.5-Récupérer l'élément HTML 'transactions-list'
  const liste = document.getElementById("transactions-list");

  // 1.6-Ajout de code HTML via JS
  liste.innerHTML += `
    <div class="transaction-item ${transaction.type}" data-id="${transaction.id}">
      <span>${transaction.description}</span>
      <span>${transaction.categorie}</span>
      <span class="${transaction.type}">
        ${transaction.type === "expense" ? "- " : "+ "}${transaction.montant} €
      </span>
      <div class="transaction-actions">
        <button class="editButton" data-id="${transaction.id}"><i data-lucide="pencil"></i></button>
        <button class="suppButton" data-id="${transaction.id}"><i data-lucide="trash-2"></i></button>
      </div>
    </div>
  `;
  lucide.createIcons();

  document.getElementById("description").value = "";
  document.getElementById("montant").value = "";
}); // ← FIN addButton addEventListener

// 2-Stockage local des données
const donneesStockees = localStorage.getItem("transactions");

// 2.1-Condition si 'non vide' à l'ouverture
if (donneesStockees) {
  const transactionsSauvegardees = JSON.parse(donneesStockees);
  transactionsSauvegardees.forEach(function (transaction) {
    transactions.push(transaction);
    const liste = document.getElementById("transactions-list");
    liste.innerHTML += `
      <div class="transaction-item ${transaction.type}" data-id="${transaction.id}">
        <span>${transaction.description}</span>
        <span>${transaction.categorie}</span>
        <span class="${transaction.type}">
          ${transaction.type === "expense" ? "- " : "+ "}${transaction.montant} €
        </span>
        <div class="transaction-actions">
          <button class="editButton" data-id="${transaction.id}"><i data-lucide="pencil"></i></button>
          <button class="suppButton" data-id="${transaction.id}"><i data-lucide="trash-2"></i></button>
        </div>
      </div>
    `;
  });
  updateSoldes();
  lucide.createIcons();
} // ← FIN if localStorage

// 3-Gérer les clics sur la liste
const liste = document.getElementById("transactions-list");

liste.addEventListener("click", function (event) {
  // 3.1-Suppression
  const bouton = event.target.closest(".suppButton");
  if (bouton) {
    const confirmation = confirm("Supprimer cette transaction ?");
    if (!confirmation) return;
    const id = parseInt(bouton.dataset.id);
    const index = transactions.findIndex((t) => t.id === id);
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    bouton.closest(".transaction-item").remove();
    updateSoldes();
  } // ← FIN suppression

  // 3.2-Modification
  const boutonEdit = event.target.closest(".editButton");
  if (boutonEdit) {
    const id = parseInt(boutonEdit.dataset.id);
    const transaction = transactions.find((t) => t.id === id);
    const item = boutonEdit.closest(".transaction-item");
    item.innerHTML = `
      <input class="edit-input" type="text" value="${transaction.description}" data-field="description" />
      <input class="edit-input" type="number" value="${transaction.montant}" data-field="montant" />
      <select class="edit-input" data-field="type">
        <option value="income" ${transaction.type === "income" ? "selected" : ""}>Revenu</option>
        <option value="expense" ${transaction.type === "expense" ? "selected" : ""}>Dépense</option>
      </select>
      <button class="saveButton" data-id="${id}"><i data-lucide="check"></i></button>
    `;
    lucide.createIcons();
  } // ← FIN modification

  const boutonSave = event.target.closest(".saveButton");
  if (boutonSave) {
    const id = parseInt(boutonSave.dataset.id);
    const item = boutonSave.closest(".transaction-item");
    const inputs = item.querySelectorAll(".edit-input");

    const index = transactions.findIndex((t) => t.id === id);
    transactions[index].description = inputs[0].value;
    transactions[index].montant = parseFloat(inputs[1].value);
    transactions[index].type = inputs[2].value;

    localStorage.setItem("transactions", JSON.stringify(transactions));

    const t = transactions[index];
    item.innerHTML = `
      <span>${t.description}</span>
      <span>${t.categorie}</span>
      <span class="${t.type}">
        ${t.type === "expense" ? "- " : "+ "}${t.montant} €
      </span>
      <div class="transaction-actions">
        <button class="editButton" data-id="${t.id}"><i data-lucide="pencil"></i></button>
        <button class="suppButton" data-id="${t.id}"><i data-lucide="trash-2"></i></button>
      </div>
    `;
    item.className = `transaction-item ${t.type}`;
    lucide.createIcons();
    updateSoldes();
  } // ← FIN sauvegarde
}); // ← FIN liste addEventListener

lucide.createIcons();
