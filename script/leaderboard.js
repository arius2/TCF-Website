const leaderboardTable = document.getElementById("leaderboard");
const leaderboardBody = leaderboardTable.getElementsByTagName("tbody")[0];
const leaderboardHead = leaderboardTable.getElementsByTagName("thead")[0];
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
