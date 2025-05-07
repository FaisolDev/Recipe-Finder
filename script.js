const apiKey = 'c6a11dc3c46c4af7a35aea87739f0f80'; 
async function searchRecipes() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;

  const response = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=12&apiKey=${apiKey}`
  );
  const data = await response.json();

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (!data.results.length) {
    resultsDiv.innerHTML = '<p>No recipes found.</p>';
    return;
  }

  data.results.forEach(recipe => {
    const div = document.createElement('div');
    div.classList.add('recipe');
    div.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}" />
      <h3>${recipe.title}</h3>
      <a href="https://spoonacular.com/recipes/${recipe.title.toLowerCase().replace(/ /g, '-')}-${recipe.id}" target="_blank">
        View Recipe
      </a>
    `;
    resultsDiv.appendChild(div);
  });
}

// Event listeners
document.getElementById('searchBtn').addEventListener('click', searchRecipes);

document.getElementById('searchInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    searchRecipes();
  }
});

document.getElementById('toggleMode').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

window.onload = () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
};

// Voice Search
document.getElementById('voiceSearch').addEventListener('click', () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Your browser does not support voice recognition.');
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function (event) {
    const voiceQuery = event.results[0][0].transcript;
    document.getElementById('searchInput').value = voiceQuery;
    searchRecipes();
  };

  recognition.onerror = function () {
    alert('Voice search error. Try again.');
  };
});
