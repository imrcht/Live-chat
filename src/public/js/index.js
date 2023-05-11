const techList = document.getElementById('tech-names');
const techUsers = document.getElementById('tech-users');

async function outputTechs(url) {
  const response = await fetch(url);
  let techNames = await response.json();
  techNames = techNames.techNames;
  // console.log(techNames);
  techList.innerHTML = '';
  techNames.forEach((techName) => {
    const li = document.createElement('li');
    li.innerText = `${techName.tech} - ${techName.current_members}`;
    techList.appendChild(li);
  });
}

// async function outputTechs(url) {
//   const response = await fetch(url);
//   let techNames = await response.json();
//   techNames = techNames.techNames;
//   // console.log(techNames);
//   techList.innerHTML = '';
//   techNames.forEach((techName) => {
//     const h4 = document.createElement('h4');
//     h4.innerText = techName.tech;
//     outputTechUsers('http://localhost:7000/getTechUsers', techName.tech);
//     techList.appendChild(h4);
//   });
// }

// async function outputTechUsers(userUrl, tech) {}

outputTechs(
  `https://9c24-2409-4043-4e1f-1b7-3510-7ac7-619-c137.ngrok-free.app/getTechNames`
);
