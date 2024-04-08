const container = document.getElementsByClassName("sub-container-carousel")[0];
let currentIndex = 0;
let leaderboard; // Define leaderboard variable

fetch("data/leaderboard.json")
  .then((response) => response.json())
  .then((data) => {
    leaderboard = Object.values(data).sort((a, b) => b.score - a.score);
    updateHTML(); // Update the HTML immediately after fetching data
    setInterval(() => {
      updateStudentsPosition();
      updateHTML();
    }, 5000);
  })
  .catch((error) => console.error("Error fetching data:", error));

const updateStudentsPosition = () => {
  currentIndex = (currentIndex + 1) % leaderboard.length; // Rotate to the next position
};

const updateHTML = () => {
  container.innerHTML = ""; // Clear existing content
  const topFive = leaderboard
    .slice(currentIndex)
    .concat(leaderboard.slice(0, currentIndex)); // Rotate the top five students array
  topFive.forEach((student, index) => {
    student.rank = index + 1;
    setvalues(student, index);
  });
};

const content = (student, index) => {
  const badgeName = ["gold", "silver", "bronze", "4", "5"];
  const badgeIndex = index < badgeName.length ? index : badgeName.length - 1;
  const currentBadge = badgeName[badgeIndex];

  return `
    <div class="top-main">
      <div class="badget">
        <img src="./images/illustration-${currentBadge}.svg" alt="${currentBadge} badge">
      </div>
      <div class="scores">
        <div class="points">${student.score}</div>
        <div class="text-points">points</div>
      </div>
    </div>
    <div class="bottom-main">
      <div class="name">${student.name}</div>
      <div class="class">${student.sem}st sem</div>
    </div>`;
};

const setvalues = (student, index) => {
  let div1 = document.createElement("div");
  div1.setAttribute("id", `${index}`);
  div1.setAttribute("class", `main-container-carousel`);
  div1.innerHTML = content(student, index);
  container.append(div1);
  console.log(div1.innerHTML);
};
