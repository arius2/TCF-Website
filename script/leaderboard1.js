const leaderboardTable = document.getElementById("leaderboard");
const leaderboardBody = leaderboardTable.getElementsByTagName("tbody")[0];
const leaderboardHead = leaderboardTable.getElementsByTagName("thead")[0];
const topLeaderboard = document.getElementById("top-leaderboard");
var leaderboard = null;

function displayLeaderboard() {
  if (!leaderboard) {
    return;
  }
  leaderboardBody.innerHTML = "";
  leaderboard.forEach((student) => {
    let tableRow = document.createElement("tr");
    tableRow.innerHTML = `
      <td>${student.rank}</td>
      <td>${student.name}</td>
      <td>${student.sem}</td>
      <td>${student.language}</td>
      <td>${student.score}</td>`;
    leaderboardBody.append(tableRow);
  });
}

function displayTopLeaderboard() {
  sortLeaderboard("rank", true);
  const leaderboardBars = topLeaderboard.querySelectorAll(".leaderboard-bar");
  const topScore = leaderboard[0].score;
  const topMinScore = (
    leaderboard[leaderboardBars.length - 1] || leaderboard[leaderboard.length - 1]
  ).score;

  topLeaderboard.style.setProperty("--top-score", topScore);

  // (topMinScore - base-score) / (topScore - base-score) = height, height >= 0.25
  // (topMinScore - base-score) / (topScore - base-score) >= 0.25
  // base-score >= (topMinScore - 0.25 * topScore) / 0.75
  topLeaderboard.style.setProperty(
    "--base-score",
    (topMinScore - 0.25 * topScore) / 0.75
  );
  leaderboardBars.forEach((bar) => {
    const idx = bar.getAttribute("data-idx");
    bar.style.setProperty("--score", leaderboard[idx].score);
    bar.style.setProperty("--language", leaderboard[idx].language);
    bar.setAttribute("data-name", leaderboard[idx].name);
    bar.setAttribute("data-rank", leaderboard[idx].rank);
    bar.querySelector(".bar-score").textContent = leaderboard[idx].score;
    const rank =
      leaderboard[idx].rank == 1
        ? "1st"
        : leaderboard[idx].rank == 2
        ? "2nd"
        : leaderboard[idx].rank == 3
        ? "3rd"
        : leaderboard[idx].rank + "th";
    bar.querySelector(".bar-rank").textContent = rank;
  });
}

function sortLeaderboard(sortBy, ascending = true) {
  function sortNum(a, b, ascending) {
    return ascending ? a - b : b - a;
  }
  function sortStr(a, b, ascending) {
    return ascending ? a.localeCompare(b) : b.localeCompare(a);
  }

  if (!leaderboard) return;
  if (sortBy == "rank") {
    leaderboard.sort((a, b) => sortNum(a.rank, b.rank, ascending));
  } else if (sortBy == "name") {
    leaderboard.sort((a, b) => sortStr(a.name, b.name, ascending));
  } else if (sortBy == "sem") {
    leaderboard.sort((a, b) => sortStr(a.sem, b.sem, ascending));
  } else if (sortBy == "language") {
    leaderboard.sort((a, b) => sortStr(a.language, b.language, ascending));
  } else if (sortBy == "score") {
    leaderboard.sort((a, b) => sortNum(a.score, b.score, ascending));
  } else {
    console.error("Invalid sort order ", sortBy);
  }

  displayLeaderboard();
}

fetch("data/leaderboard.json")
  .then((response) => response.json())
  .then((data) => {
    leaderboard = Object.values(data).sort((a, b) => b.score - a.score);

    var curRank = 1;
    for (let i = 0; i < leaderboard.length; i++) {
      leaderboard[i].rank = curRank;
      if (
        i !== leaderboard.length - 1 &&
        leaderboard[i].score !== leaderboard[i + 1].score
      ) {
        curRank++;
      }
    }

    displayLeaderboard();
    displayTopLeaderboard();
  })
  .catch((error) => console.error("Error fetching data:", error));

leaderboardHead.addEventListener("click", (event) => {
  const head = event.target;
  const sortBy = head.getAttribute("data-name");
  if (!sortBy) return;

  leaderboardHead.querySelectorAll("th").forEach((cell) => {
    if (cell === head) return;
    cell.removeAttribute("data-sort");
  });

  head.setAttribute(
    "data-sort",
    head.getAttribute("data-sort") === "asc" ? "desc" : "asc"
  );
  sortLeaderboard(sortBy, head.getAttribute("data-sort") === "asc");
});
