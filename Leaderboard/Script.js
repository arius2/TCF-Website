fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    const studentData = data;
    console.log(studentData);

    const studentArray = Object.values(studentData).sort(
      (a, b) => b.points - a.points
    );

    studentArray.forEach((student, index) => {
      student.rank = index + 1;
    
      let tableRow  = document.createElement("tr");
      tableRow.innerHTML = `
        <td>${student.rank}</td>
        <td>${student.name}</td>
        <td>${student.sem}</td>
        <td>${student.language}</td>
        <td>${student.points}</td>`;
      
      let parent = document.getElementsByClassName("table")[0];
      parent.append(tableRow);
    });
  })
  .catch((error) => console.error("Error fetching data:", error));
