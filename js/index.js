document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("github-form");
  form.addEventListener("submit", handleSearch);
});

function handleSearch(e) {
  e.preventDefault();
  const input = document.getElementById("search").value;
  fetchUsers(input);
}

function fetchUsers(query) {
  fetch(`https://api.github.com/search/users?q=${query}`, {
    headers: {
      "Accept": "application/vnd.github.v3+json"
    }
  })
    .then(res => res.json())
    .then(data => {
      const userList = document.getElementById("user-list");
      userList.innerHTML = ""; // Clear old results
      const repoList = document.getElementById("repos-list");
      repoList.innerHTML = ""; // Clear repos list too

      data.items.forEach(user => {
        const li = document.createElement("li");
        li.innerHTML = `
          <img src="${user.avatar_url}" width="50" />
          <a href="${user.html_url}" target="_blank">${user.login}</a>
        `;
        li.style.cursor = "pointer";
        li.addEventListener("click", () => fetchRepos(user.login));
        userList.appendChild(li);
      });
    })
    .catch(err => console.error("Error fetching users:", err));
}

function fetchRepos(username) {
  fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      "Accept": "application/vnd.github.v3+json"
    }
  })
    .then(res => res.json())
    .then(repos => {
      const repoList = document.getElementById("repos-list");
      repoList.innerHTML = "";

      repos.forEach(repo => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
        repoList.appendChild(li);
      });
    })
    .catch(err => console.error("Error fetching repos:", err));
}
