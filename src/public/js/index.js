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
    li.innerText = techName.tech;
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

outputTechs(`https://p2p-communication.netlify.app/getTechNames`);
