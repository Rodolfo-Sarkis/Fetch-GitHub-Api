document.getElementById('btn-search').addEventListener('click', () => {
    const userName = document.getElementById('input-search').value.trim();
    if (userName) {
        getUserProfile(userName);
    } else {
        alert('Por favor, insira um nome de usuário.');
    }

})

document.getElementById('input-search').addEventListener('keyup', (e) => {
    const userName = e.target.value
    const key = e.which || e.keyCode
    const isEnterKeyPressed = key === 13

    if (isEnterKeyPressed) {
        getUserProfile(userName);
    }
})

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

async function repos(userName) {
    const response = await fetch(`https://api.github.com/users/${userName}/repos`);
    return await response.json()
}

function getUserProfile(userName) {

    fetchUserProfile(userName).then(userData => {
        if (userData) {
            const userInfo = `<div class="info">
                                    <img src="${userData.avatar_url}" alt="Foto do perfil do usuário" />
                                    <div class="data">
                                    <h1>${userData.name ?? 'Não possui nome cadastrado 😥'}</h1>
                                    <p>${userData.bio ?? 'Não possui bio cadastrada 😥'}</p>
                                    </div>
                            </div>`;
            document.querySelector('.profile-data').innerHTML = userInfo;
        } else {
            document.querySelector('.profile-data').innerHTML = `
                <p>Erro: Não foi possível carregar os dados do usuário.</p>
            `;
        }

        getUserRepositories(userName)
    });
}

function getUserRepositories(userName) {
    repos(userName).then(reposData => {
        let repositoriesItens = ""
        console.log(reposData)
        reposData.forEach(repo => {
            repositoriesItens += `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>`
        })

        document.querySelector('.profile-data').innerHTML += `
         <div class="repositories section"
            <h2>Repositórios</h2>
            <ul>${repositoriesItens}</ul>
        </div>`


    })
}