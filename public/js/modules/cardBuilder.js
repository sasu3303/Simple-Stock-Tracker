// PEER REVIEW — Sanjay Sundar BV (CS 5610)
//
// Suggestion 1: Add color coding to Gain/Loss so users can instantly
// see positive vs negative performance without reading the number.
// Example fix — add this inside the forEach where the card HTML is built:
//   const gainLossColor = holding.gainLoss >= 0 ? '#16a34a' : '#dc2626';
//   Then in the HTML: style="color: ${gainLossColor}"
//   on the Gain/Loss paragraph.
//
// Suggestion 2: The window.location.reload() after removing a holding
// causes a full page refresh including re-fetching the chart data.
// A smoother approach would be to just remove the card from the DOM
// and update the chart without a full reload.
// Example fix:
//   cardColumn.remove(); // instead of window.location.reload()
//
// Suggestion 3: If the fetch fails silently (e.g. network timeout),
// the user only sees "Unable to load holdings." with no retry option.
// Consider adding a retry button:
//   cardContainer.innerHTML =
//     '<p>Unable to load holdings. <button onclick="loadHoldingCards()">Retry</button></p>';

import { getAllHoldings, removeHolding } from "./api.js";

const cardContainer = document.getElementById("holdings-card-container");

function formatCurrency(value) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return `$${Number(value).toFixed(2)}`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

async function loadHoldingCards() {
  if (!cardContainer) {
    return;
  }

  try {
    const data = await getAllHoldings();
    const holdings = data.holdings || [];

    cardContainer.innerHTML = "";

    if (holdings.length === 0) {
      cardContainer.innerHTML = "<p>No holdings added yet.</p>";
      return;
    }

    holdings.forEach((holding) => {
      const cardColumn = document.createElement("div");
      cardColumn.className = "col-md-4";

      cardColumn.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <h5 class="card-title">${holding.ticker}</h5>
              <button 
                class="btn btn-sm btn-outline-danger remove-holding-btn"
                data-holding-id="${holding.holdingId}"
                aria-label="Remove ${holding.ticker}"
              >
                X
              </button>
            </div>

            <p class="card-text mb-1">
              <strong>Units:</strong> ${holding.units}
            </p>

            <p class="card-text mb-1">
              <strong>Purchase Date:</strong> ${formatDate(holding.purchaseDate)}
            </p>

            <p class="card-text mb-1">
              <strong>Purchase Price:</strong> ${formatCurrency(holding.purchasePrice)}
            </p>

            <p class="card-text mb-1">
              <strong>Current Value:</strong> ${formatCurrency(holding.currentValue)}
            </p>

            <p class="card-text mb-1">
              <strong>Gain/Loss:</strong> ${formatCurrency(holding.gainLoss)}
            </p>
          </div>
        </div>
      `;

      cardContainer.appendChild(cardColumn);
    });
  } catch (error) {
    console.error("Failed to load holding cards:", error.message);
    cardContainer.innerHTML = "<p>Unable to load holdings.</p>";
  }
}

cardContainer?.addEventListener("click", async (event) => {
  if (!event.target.classList.contains("remove-holding-btn")) {
    return;
  }

  const holdingId = event.target.dataset.holdingId;

  try {
    await removeHolding(holdingId);
    window.location.reload();
  } catch (error) {
    console.error("Failed to remove holding:", error.message);
    alert(`Failed to remove holding: ${error.message}`);
  }
});

loadHoldingCards();
