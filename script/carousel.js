const renderitems = () => {
  return new Promise((resolve, reject) => {
    const container = document.getElementsByClassName(
      "sub-container-carousel"
    )[0];
    let currentIndex = 0;
    let leaderboard;

    fetch("data/leaderboard.json")
      .then((response) => response.json())
      .then((data) => {
        leaderboard = Object.values(data).sort((a, b) => b.score - a.score);
        renderTopFive();
        resolve("Data fetched and rendered successfully");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        reject(error);
      });

    const renderTopFive = () => {
      container.innerHTML = "";
      const topFive = leaderboard.slice(currentIndex, currentIndex + 5);
      topFive.forEach((student, index) => {
        student.rank = index + 1;
        createStudentElement(student, index);
      });
    };

    const createStudentElement = (student, index) => {
      const div = document.createElement("div");
      div.setAttribute("class", "main-container-carousel");
      div.innerHTML = content(student, index);
      container.appendChild(div);
    };

    const content = (student, index) => {
      const badgeName = ["gold", "silver", "bronze", "4", "5"];
      const badgeIndex =
        index < badgeName.length ? index : badgeName.length - 1;
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
  });
};

renderitems()
  .then((message) => {
    console.log(message);
    console.log("Rendering completed!");
    const addIcons = () => {
      return new Promise((resolve, reject) => {
        const container = document.getElementsByClassName(
          "sub-container-carousel"
        );
        container.innerHTML += `<div class="prev-icon">
        <img src="./images/navbefore.svg" alt="prev">
    </div>
    <div class="next-icon">
        <img src="./images/navnext.svg" alt="next">
    </div>
    <div class="carousel-nav">
        <div class="bar">
            <div class="button">.</div>
            <div class="button">.</div>
            <div class="button">.</div>
            <div class="button">.</div>
            <div class="button">.</div>
        </div>
    </div>`;
      });
    };
  })
  .catch((error) => {
    console.error("Error rendering items:", error);
  });
