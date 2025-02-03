(() => {
  const results = document.querySelector("#results ul");
  const resultDetails = document.querySelector("#result_details");
  const baseURL = "https://swapi.dev/api/";
  const buttonBody = document.querySelectorAll("#filter-list li");
  const buttonStart = document.querySelector("#body button");
  const filterBox = document.querySelector("#filter__box");
  const showFilter = document.querySelector("#showFilter");
  const resultSynopsis = document.querySelector("#result_synopsis");
  console.log(buttonStart);

  buttonStart.addEventListener("click", () => {
    const i = buttonStart.querySelector("i");
    filterBox.classList.toggle("hidden");
    if (filterBox.classList.contains("hidden")) {
      i.style.transform = "rotate(-90deg)";
    } else {
      i.style.transform = "rotate(0)";
    }
    filterBox.addEventListener("mouseleave", () => {
      i.style.transform = "rotate(-90deg)";
      filterBox.classList.add("hidden");
    });
  });

  buttonBody.forEach((list) => {
    list.addEventListener("click", () => {
      showFilter.innerHTML = list.dataset.action;
      document.querySelector("#result-type").textContent = list.dataset.action;
      document.querySelector(
        "#result-headline"
      ).textContent = `These Galactic units has ${list.dataset.desc} BMI`;
    });
  });

  //   Fetch all characters
  function getAllChars() {
    let allCharacters = [];
    let nextPage = `${baseURL}/people/?page=1`;

    function fetchPage(url) {
      return fetch(url)
        .then((res) => res.json())
        .then((response) => {
          allCharacters.push(...response.results);
          if (response.next) {
            return fetchPage(response.next);
          }
        });
    }
    return fetchPage(nextPage).then(() => {
      return allCharacters;
    });
  }

  //   Fetch all planets
  function getAllPlanets() {
    let allPlanets = [];
    let nextPage = `${baseURL}/planets/?page=1`;

    function fetchPage(url) {
      return fetch(url)
        .then((res) => res.json())
        .then((response) => {
          allPlanets.push(...response.results);
          if (response.next) {
            return fetchPage(response.next);
          }
        });
    }
    return fetchPage(nextPage).then(() => {
      return allPlanets;
    });
  }

  //   Fetch all species
  function getAllSpecies() {
    let allSpecies = [];
    let nextPage = `${baseURL}/species/?page=1`;

    function fetchPage(url) {
      return fetch(url)
        .then((res) => res.json())
        .then((response) => {
          allSpecies.push(...response.results);
          if (response.next) {
            return fetchPage(response.next);
          }
        });
    }
    return fetchPage(nextPage).then(() => {
      return allSpecies;
    });
  }

  //   Fetch all films
  function getAllFilms() {
    let allFilms = [];
    let nextPage = `${baseURL}/films/?page=1`;

    function fetchPage(url) {
      return fetch(url)
        .then((res) => res.json())
        .then((response) => {
          allFilms.push(...response.results);
          if (response.next) {
            return fetchPage(response.next);
          }
        });
    }
    return fetchPage(nextPage).then(() => {
      return allFilms;
    });
  }

  //   Calculate BMI
  function calBMI(height, weight) {
    if (!isNaN(height) && !isNaN(weight)) {
      let calculated = (weight / (height * 2)) * 100;
      return calculated;
    }
  }

  //   Filter Characters
  let filterCharacters = [];
  buttonBody.forEach((list) => {
    list.addEventListener("click", () => {
      const cal = list.dataset.action;
      results.innerHTML = "";
      resultDetails.innerHTML = "";
      resultSynopsis.innerHTML = "";

      getAllChars().then((data) => {
        filterCharacters = data.filter((char) => {
          let height = parseFloat(char.height);
          let weight = parseFloat(char.mass);
          let calculated = calBMI(height, weight);

          if (calculated === null) return false;

          switch (cal) {
            case "obesity":
              return calculated >= 30;
            case "overweight":
              return calculated < 30 && calculated > 25;
            case "normal":
              return calculated >= 18.5 && calculated < 25;
            case "underweight":
              return calculated < 18.5;
            default:
              return false;
          }
        });

        filterCharacters.forEach((char) => {
          const li = document.createElement("li");
          li.textContent = char.name;
          results.appendChild(li);
        });
      });
    });
  });

  buttonBody.forEach((list) => {
    list.addEventListener("click", () => {
      console.log(list.dataset.action);
    });
  });

  //  Filter Planets
  let filterPlanets = [];
  function loadPlanetsData() {
    getAllPlanets()
      .then((data) => {
        filterPlanets = data;
        console.log("Loaded Planets:", filterPlanets);
      })
      .catch((error) => {
        console.error("Issue:", error);
      });
  }
  loadPlanetsData();

  //  Filter Species
  let filterSpecies = [];
  function loadSpeciesData() {
    getAllSpecies()
      .then((data) => {
        filterSpecies = data;
        console.log("Loaded Species:", filterSpecies);
      })
      .catch((error) => {
        console.error("Issue:", error);
      });
  }

  loadSpeciesData();

  //  Filter Films
  let filterFilms = [];
  function loadFilmsData() {
    getAllFilms()
      .then((data) => {
        filterFilms = data;
        console.log("Loaded Films:", filterFilms);
      })
      .catch((error) => {
        console.error("Issue:", error);
      });
  }
  loadFilmsData();

  //  Display Character Details
  results.addEventListener("click", async (event) => {
    resultDetails.innerHTML = "";
    resultSynopsis.innerHTML = "";
    if (event.target.tagName === "LI") {
      const charName = event.target.textContent;
      const selectedCharacter = filterCharacters.find(
        (char) => char.name === charName
      );

      if (selectedCharacter) {
        const p = document.createElement("p");
        const pHeight = document.createElement("p");
        const pWeight = document.createElement("p");
        p.textContent = `Name: ${selectedCharacter.name}`;
        pHeight.textContent = `Height: ${selectedCharacter.height} cm`;
        pWeight.textContent = `Weight: ${selectedCharacter.mass} kg`;
        resultDetails.appendChild(p);
        resultDetails.appendChild(pHeight);
        resultDetails.appendChild(pWeight);

        for (let i = 0; i < filterPlanets.length; i++) {
          if (selectedCharacter.homeworld === filterPlanets[i].url) {
            const p = document.createElement("p");
            p.textContent = `Planet: ${filterPlanets[i].name}`;
            resultDetails.appendChild(p);
          }
        }
        for (let i = 0; i < filterSpecies.length; i++) {
          if (selectedCharacter.species[0] === filterSpecies[i].url) {
            const p = document.createElement("p");
            p.textContent = `Species: ${filterSpecies[i].name}`;
            resultDetails.appendChild(p);
          }
        }

        let found = false;

        for (let i = 0; i < filterFilms.length; i++) {
          if (
            selectedCharacter.films[0] === `https://swapi.dev/api/films/${i}/`
          ) {
            found = true;
            const p = document.createElement("p");
            const div = document.createElement("div");
            const img = document.createElement("img");
            const pSynopsis = document.createElement("p");
            p.textContent = `First Film: ${filterFilms[i - 1].title}`;
            pSynopsis.innerHTML = filterFilms[i - 1].opening_crawl;
            img.src = `images/starwars0${i}.jpg`;
            div.appendChild(img);
            resultDetails.appendChild(p);
            resultDetails.appendChild(div);
            resultSynopsis.appendChild(pSynopsis);
          }
        }
        if (!found) {
          const errorMsg = document.createElement("p");
          errorMsg.textContent = "No matching film found!";
          errorMsg.style.color = "red";
          resultDetails.appendChild(errorMsg);
        }
      }
    }
  });
})();
