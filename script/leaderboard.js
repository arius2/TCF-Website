const leaderboardTable = document.getElementById("leaderboard");
const leaderboardBody = leaderboardTable.getElementsByTagName("tbody")[0];
var leaderboard = null;

fetch("data/leaderboard.json")
  .then((response) => response.json())
  .then((data) => {
    leaderboard = Object.values(data).sort((a, b) => b.score - a.score);

    leaderboard.forEach((student, index) => {
      student.rank = index + 1;

      let tableRow = document.createElement("tr");
      tableRow.innerHTML = `
        <td>${student.rank}</td>
        <td>${student.name}</td>
        <td>${student.sem}</td>
        <td>${student.language}</td>
        <td>${student.score}</td>`;

      leaderboardBody.append(tableRow);
    });
  })
  .catch((error) => console.error("Error fetching data:", error));
