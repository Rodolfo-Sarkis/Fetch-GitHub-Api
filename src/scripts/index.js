document.getElementById('btn-search').addEventListener('click', () => {
    const userName = document.getElementById('input-search').value.trim();
    if (userName) {
        getUserProfile(userName);
    } else {
        alert('Por favor, insira um nome de usuário.');
    }
});

document.getElementById('input-search').addEventListener('keyup', (e) => {
    const userName = e.target.value;
    const key = e.which || e.keyCode;
    const isEnterKeyPressed = key === 13;

    if (isEnterKeyPressed) {
        getUserProfile(userName);
    }
});

// Função para buscar os dados do perfil do usuário
async function fetchUserProfile(userName) {
    try {
        const response = await fetch(`https://api.github.com/users/${userName}`);
        if (!response.ok) {
            throw new Error(`Usuário não encontrado: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar o perfil do usuário:', error);
        return null;
    }
}

// Função para buscar os repositórios do usuário
async function repos(userName) {
    try {
        const response = await fetch(`https://api.github.com/users/${userName}/repos`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar repositórios: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar os repositórios:', error);
        return null;
    }
}

// Função para buscar os eventos do usuário
async function fetchUserEvents(userName) {
    try {
        const response = await fetch(`https://api.github.com/users/${userName}/events`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar eventos: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar os eventos do usuário:', error);
        return null;
    }
}

// Função para exibir os dados do perfil do usuário
function getUserProfile(userName) {
    fetchUserProfile(userName).then(userData => {
        if (userData) {
            const userInfo = `
                <div class="info">
                    <img src="${userData.avatar_url}" alt="Foto do perfil do usuário" />
                    <div class="data">
                        <h1>${userData.name ?? 'Não possui nome cadastrado 😥'}</h1>
                        <p>${userData.bio ?? 'Não possui bio cadastrada 😥'}</p>
                        <p><strong>Login:</strong> ${userData.login}</p>
                        <p><strong>Seguidores:</strong> ${userData.followers}</p>
                        <p><strong>Seguindo:</strong> ${userData.following}</p>
                    </div>
                </div>`;
            document.querySelector('.profile-data').innerHTML = userInfo;
        } else {
            document.querySelector('.profile-data').innerHTML = `
                <p>Erro: Não foi possível carregar os dados do usuário.</p>`;
        }

        getUserRepositories(userName); // Busca e exibe os repositórios
        getUserEvents(userName);      // Busca e exibe os eventos
    });
}

// Função para exibir os repositórios do usuário
function getUserRepositories(userName) {
    repos(userName).then(reposData => {
        if (reposData) {
            let repositoriesItens = '';
            reposData.forEach(repo => {
                repositoriesItens += `
                    <li>
                        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                        <p><strong>Forks:</strong> ${repo.forks_count}</p>
                        <p><strong>Estrelas:</strong> ${repo.stargazers_count}</p>
                        <p><strong>Watchers:</strong> ${repo.watchers_count}</p>
                        <p><strong>Linguagem:</strong> ${repo.language ?? 'Não especificada'}</p>
                    </li>`;
            });

            document.querySelector('.profile-data').innerHTML += `
                <div class="repositories section">
                    <h2>Repositórios</h2>
                    <ul>${repositoriesItens}</ul>
                </div>`;
        } else {
            document.querySelector('.profile-data').innerHTML += `
                <p>Erro: Não foi possível carregar os repositórios do usuário.</p>`;
        }
    });
}

// Função para exibir os eventos do usuário
function getUserEvents(userName) {
    fetchUserEvents(userName).then(events => {
        if (events) {
            const filteredEvents = events.filter(event => event.type === 'PushEvent' || event.type === 'CreateEvent');
            const limitedEvents = filteredEvents.slice(0, 10); // Pegar os 10 primeiros eventos

            let eventsList = '';
            limitedEvents.forEach(event => {
                if (event.type === 'PushEvent') {
                    const repoName = event.repo.name;
                    const commitMessage = event.payload.commits[0]?.message ?? 'Sem mensagem de commit';
                    eventsList += `<li><strong>Repositório:</strong> ${repoName} | <strong>Commit:</strong> ${commitMessage}</li>`;
                } else if (event.type === 'CreateEvent') {
                    eventsList += `<li>Sem mensagem de commit (CreateEvent)</li>`;
                }
            });

            document.querySelector('.profile-data').innerHTML += `
                <div class="events section">
                    <h2>Últimos Eventos</h2>
                    <br>
                    <ul>${eventsList}</ul>
                </div>`;
        } else {
            document.querySelector('.profile-data').innerHTML += `
                <p>Erro: Não foi possível carregar os eventos do usuário.</p>`;
        }
    });
}
