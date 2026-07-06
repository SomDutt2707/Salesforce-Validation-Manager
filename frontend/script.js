const loginBtn = document.getElementById("loginBtn");
const getRulesBtn = document.getElementById("getRulesBtn");
const previewBtn = document.getElementById("previewBtn");
const deployBtn = document.getElementById("deployBtn");
const searchBox = document.querySelector("input");
const statusFilter = document.getElementById("statusFilter");
const rulesTable = document.getElementById("rulesTable");
const filterDropdown = document.querySelector("select");
const totalRules = document.getElementById("totalRules");
const activeRules = document.getElementById("activeRules");
const inactiveRules = document.getElementById("inactiveRules");
const previewBox = document.getElementById("previewBox");
const previewContent = document.getElementById("previewContent");

let allRules = [];
let validationRules = [];

// Login
loginBtn.addEventListener("click", () => {
  window.location.href = "https://salesforce-validation-manager-bxs8.onrender.com/api/salesforce/login";
});

// Get Validation Rules
getRulesBtn.addEventListener("click", async () => {
  try {
    const response = await fetch(
      "https://salesforce-validation-manager-bxs8.onrender.com/api/salesforce/validation-rules",
      {
        credentials: "include",
      },
    );

    const data = await response.json();
    allRules = data.records;

    if (!data.success) {
      alert(data.message);
      return;
    }

    validationRules = data.records;

    renderRules(validationRules);
    updateDashboard();
  } catch (err) {
    console.log(err);

    alert("Cannot connect to backend.");
  }
});

// Render Table
function renderRules(rules) {
  rulesTable.innerHTML = "";

  rules.forEach((rule) => {
    rulesTable.innerHTML += `
        <tr>

            <td>

                <input
                    type="checkbox"
                    class="ruleCheckbox"
                    data-id="${rule.Id}"
                >

            </td>

            <td>${rule.ValidationName}</td>

            <td>${rule.EntityDefinition.QualifiedApiName}</td>

            <td>

            <span class="${rule.Active ? "activeStatus" : "inactiveStatus"}">
              ${rule.Active ? "🟢 Active" : "🔴 Inactive"}
            </span>

            <br><br>

            <button
            class="toggleBtn"
            data-id="${rule.Id}"
            data-active="${rule.Active}"
            >

            ${rule.Active ? "Deactivate" : "Activate"}

            </button>

            </td>

        </tr>
        `;
  });
}
function updateDashboard() {
  totalRules.textContent = validationRules.length;

  activeRules.textContent = validationRules.filter(
    (rule) => rule.Active,
  ).length;

  inactiveRules.textContent = validationRules.filter(
    (rule) => !rule.Active,
  ).length;
}

// Search
searchBox.addEventListener("input", filterRules);

// Filter
statusFilter.addEventListener("change", filterRules);

function filterRules() {
  let filtered = [...validationRules];

  const keyword = searchBox.value.toLowerCase();

  const status = statusFilter.value;

  filtered = filtered.filter((rule) => {
    return (
      rule.ValidationName.toLowerCase().includes(keyword) ||
      rule.EntityDefinition.QualifiedApiName.toLowerCase().includes(keyword)
    );
  });

  if (status === "active") {
    filtered = filtered.filter((rule) => rule.Active);
  }

  if (status === "inactive") {
    filtered = filtered.filter((rule) => !rule.Active);
  }

  renderRules(filtered);
}

// Preview
previewBtn.addEventListener("click", () => {
  const selected = [];

  document.querySelectorAll(".ruleCheckbox").forEach((box) => {
    if (box.checked) {
      const rule = validationRules.find((r) => r.Id === box.dataset.id);

      selected.push({
        ValidationRule: rule.ValidationName,
        Object: rule.EntityDefinition.QualifiedApiName,
        Status: rule.Active ? "Active" : "Inactive",
      });
    }
  });

  if (selected.length === 0) {
    alert("Please select at least one Validation Rule.");

    return;
  }

  previewBox.style.display = "block";

  previewContent.textContent = JSON.stringify(selected, null, 4);
});

document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("toggleBtn")) return;

  const id = e.target.dataset.id;

  const rule = validationRules.find((r) => r.Id === id);

  if (!rule) return;

  rule.Active = !rule.Active;

  filterRules();

  updateDashboard();

  alert(
    `${rule.ValidationName} will be ${
      rule.Active ? "Activated" : "Deactivated"
    } during deployment.`,
  );
});

// Generate Deployment JSON
deployBtn.addEventListener("click", () => {
  const selected = [];

  document.querySelectorAll(".ruleCheckbox").forEach((box) => {
    if (box.checked) {
      const rule = validationRules.find((r) => r.Id === box.dataset.id);

      selected.push({
        id: rule.Id,

        validationRule: rule.ValidationName,

        object: rule.EntityDefinition.QualifiedApiName,

        targetStatus: rule.Active ? "Active" : "Inactive",
      });
    }
  });

  if (selected.length === 0) {
    alert("Please select Validation Rules.");

    return;
  }

  const deployment = {
    generatedOn: new Date(),

    project: "Salesforce Validation Rule Manager",

    totalRules: selected.length,

    deploymentTarget: "Salesforce",

    generatedBy: "Somdutt Sharma",

    changes: selected,
  };

  const json = JSON.stringify(deployment, null, 4);

  const blob = new Blob([json], {
    type: "application/json",
  });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);

  link.download = "validation-rule-deployment-plan.json";

  link.click();
});
