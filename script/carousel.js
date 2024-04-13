let container;
let previous = document.querySelector(".prev-icon");
let next = document.querySelector(".next-icon");

const renderItems = () => {
  return new Promise((resolve, reject) => {
    container = document.querySelector(".sub-container-carousel");
    if (!container) {
      reject("Sub container not found.");
      return;
    }

    let currentIndex = 0;
    let leaderboard;

    fetch("data/leaderboard.json")
      .then((response) => response.json())
      .then((data) => {
        leaderboard = Object.values(data).sort((a, b) => b.score - a.score);
        renderTopFive();
        resolve(container);
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
      div.innerHTML = generateContent(student, index);
      container.appendChild(div);
    };

    const generateContent = (student, index) => {
      const badgeName = ["gold", "silver", "bronze", "4", "5"];
      const badgeIndex =
        index < badgeName.length ? index : badgeName.length - 1;
      const currentBadge = badgeName[badgeIndex];

      return `
        <div class="top-main">
          <div class="badge">
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

renderItems()
  .then(() => {
    let scrolled = 0;
    let id = 0;
    let scrollingFunction;

    const startScrolling = () => {
      if (!container) return;
      clearInterval(scrollingFunction);
      scrollingFunction = setInterval(() => {
        const scrollWidth = container.scrollWidth;

        if (scrolled >= scrollWidth * (4 / 5)) {
          container.scrollLeft = 0;
          scrolled = 0;
          id = 0;
          applyStyleToNthChild(id);
        } else {
          container.scrollLeft += container.offsetWidth;
          scrolled += container.offsetWidth;
          id = (id + 1) % 5;
          applyStyleToNthChild(id);
        }
      }, 5000);
    };

    startScrolling();
    const handleNext = () => {
      container.scrollLeft += container.offsetWidth;
      clearInterval(scrollingFunction);
      startScrolling();
      if (id < 4) {
        id += 1;
      } else {
        id = 0;
        scrolled = 0;
        container.scrollLeft = 0;
      }
      applyStyleToNthChild(id);
    };

    const handlePrev = () => {
      const scrollWidth = container.scrollWidth;

      container.scrollLeft -= container.offsetWidth;
      scrolled -= container.offsetWidth;
      if (id > 0) {
        id -= 1;
      } else {
        id = 4;
        scrolled = scrollWidth;
        container.scrollLeft = scrollWidth;
      }
      applyStyleToNthChild(id);
      clearInterval(scrollingFunction);
      startScrolling();
    };

    previous.addEventListener("click", handlePrev);
    next.addEventListener("click", handleNext);

    const bar = document.querySelector(".bar");
    if (!bar) return;

    const children = bar.children;

    for (let i = 0; i < children.length; i++) {
      children[i].addEventListener("click", () => {
        container.scrollLeft = i * container.offsetWidth;
        scrolled = i * container.offsetWidth;
        id = i;
        applyStyleToNthChild(id);
        clearInterval(scrollingFunction);
        startScrolling();
      });
    }
  })
  .catch((error) => {
    console.error("Error rendering items:", error);
  });

function applyStyleToNthChild(n) {
  const bar = document.querySelector(".bar");
  if (!bar) return;
  const children = bar.children;

  for (let i = 0; i < children.length; i++) {
    children[i].style.opacity = i === n ? "1" : "0.4";
  }

  const container = document.querySelector(".sub-container-carousel");
  if (!container) return;

  container.scrollLeft = n * container.offsetWidth;
}
