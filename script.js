// Select DOM elements
const countriesContainer = document.querySelector(".countries-container");
const filterByRegion = document.querySelector(".filter-by-region");
const searchInput = document.querySelector(".search-container input");
const themeChanger = document.querySelector(".theme-changer");

let allCountriesData;
const regionCache = {}; // Cache for region fetches

// DARK MODE: Load from localStorage
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark");
  themeChanger.innerHTML = '<i class="fa-regular fa-sun"></i>&nbsp;&nbsp;Light Mode';
} else {
  themeChanger.innerHTML = '<i class="fa-regular fa-moon"></i>&nbsp;&nbsp;Dark Mode';
}

// Show loading message while fetching
countriesContainer.innerHTML = "<p>Loading countries...</p>";

// FETCH all countries
fetch("https://restcountries.com/v3.1/independent?status=true")
  .then((res) => {
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
  })
  .then((data) => {
    allCountriesData = data;
    renderCountries(data);
  })
  .catch((err) => {
    console.error("Error fetching countries:", err);
    countriesContainer.innerHTML =
      "<p>Failed to load country data. Please check your internet connection or try again later.</p>";
  });

// FILTER BY REGION
filterByRegion.addEventListener("change", (e) => {
  const region = filterByRegion.value;

  if (!region) {
    // If "All" is selected, show all countries
    if (allCountriesData) renderCountries(allCountriesData);
    return;
  }

  // Check cache first
  if (regionCache[region]) {
    renderCountries(regionCache[region]);
    return;
  }

  countriesContainer.innerHTML = "<p>Loading region data...</p>";

  fetch(`https://restcountries.com/v3.1/region/${region}`)
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((data) => {
      regionCache[region] = data; // save to cache
      renderCountries(data);
    })
    .catch((err) => {
      console.error(`Error fetching ${region} data:`, err);
      countriesContainer.innerHTML =
        "<p>Failed to load region data. Please try again later.</p>";
    });
});

// RENDER COUNTRIES FUNCTION
function renderCountries(data) {
  countriesContainer.innerHTML = "";
  if (!data || data.length === 0) {
    countriesContainer.innerHTML = "<p>No countries found.</p>";
    return;
  }

  data.forEach((country) => {
    const countryCard = document.createElement("a");
    countryCard.classList.add("country-card");
    countryCard.href = `/country.html?name=${country.name.common}`;
    countryCard.innerHTML = `
      <img src="${country.flags.svg}" alt="${country.name.common} flag" />
      <div class="card-text">
        <h3 class="card-title">${country.name.common}</h3>
        <p><b>Population: </b>${country.population.toLocaleString("en-IN")}</p>
        <p><b>Region: </b>${country.region}</p>
        <p><b>Capital: </b>${country.capital?.[0] || "N/A"}</p>
      </div>
    `;
    countriesContainer.append(countryCard);
  });
}

// SEARCH FUNCTION
searchInput.addEventListener("input", (e) => {
  if (!allCountriesData) return;

  const query = e.target.value.toLowerCase();
  const filteredCountries = allCountriesData.filter((country) =>
    country.name.common.toLowerCase().includes(query)
  );
  renderCountries(filteredCountries);
});

// DARK/LIGHT MODE TOGGLE
themeChanger.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    themeChanger.innerHTML = '<i class="fa-regular fa-sun"></i>&nbsp;&nbsp;Light Mode';
    localStorage.setItem("darkMode", "enabled");
  } else {
    themeChanger.innerHTML = '<i class="fa-regular fa-moon"></i>&nbsp;&nbsp;Dark Mode';
    localStorage.setItem("darkMode", "disabled");
  }
});
