const addButton = document.getElementById("button-add");

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

  document.getElementById("description").value = "";
  document.getElementById("montant").value = "";

  console.log(transaction);
});
