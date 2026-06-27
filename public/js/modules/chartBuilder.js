// PEER REVIEW — Sanjay Sundar BV (CS 5610)
//
// Suggestion 1: The chart has no visual indicator when portfolio history
// is empty — the canvas just stays blank. A better UX would be to show
// a message like "Add a holding to see your portfolio chart."
// Example fix:
//   if (portfolioHistory.length === 0) {
//     chartElement.closest('.chart-container')?.insertAdjacentHTML(
//       'afterend',
//       '<p class="text-muted">Add a holding to see your chart.</p>'
//     );
//     return;
//   }
//
// Suggestion 2: The chart dataset has no color configuration — it uses
// Chart.js defaults. Adding a color makes it look more polished.
// Example fix inside the datasets array:
//   borderColor: '#2563eb',
//   backgroundColor: 'rgba(37, 99, 235, 0.1)',
//   fill: true,
//   tension: 0.3,
//
// Suggestion 3: The chart is recreated on every load with no cleanup.
// If loadPortfolioChart() is ever called twice, you get two overlapping
// charts. Consider storing the chart instance and destroying it first:
//   if (window._portfolioChart) window._portfolioChart.destroy();
//   window._portfolioChart = new Chart(chartElement, { ... });

// note for the future when this gets iterated on in react
// This import was annoying because docs have a bundle, ended up needing to serve
// this via cdn bc it's a static page, but once it's jsx I can just:
// import Chart from 'chart.js/auto'
// and not worry about manual registration

import { getAllHoldings } from "./api.js";

import {
  Chart,
  registerables,
} from "https://cdn.jsdelivr.net/npm/chart.js@4/+esm";

Chart.register(...registerables);

const chartElement = document.getElementById("holdings-chart");

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

async function loadPortfolioChart() {
  if (!chartElement) {
    return;
  }

  try {
    const data = await getAllHoldings();
    const portfolioHistory = data.portfolioHistory || [];

    if (portfolioHistory.length === 0) {
      console.log("No portfolio history to chart yet.");
      return;
    }

    new Chart(chartElement, {
      type: "line",
      data: {
        labels: portfolioHistory.map((row) => formatDate(row.date)),
        datasets: [
          {
            label: "Portfolio Value",
            data: portfolioHistory.map((row) => row.value),
          },
        ],
      },
    });
  } catch (error) {
    console.error("Failed to load portfolio chart:", error.message);
  }
}

loadPortfolioChart();
