document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/live');
        if (!response.ok) throw new Error('Falha ao carregar o formulário.');
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const formHtml = doc.querySelector('#form-relatorio');
        const scriptContent = doc.querySelector('script').textContent;
        
        const container = document.getElementById('form-container');
        if (container) {
            container.appendChild(formHtml);
        } else {
            // Se estiver na página /live, o formulário já existe, não precisa injetar.
        }

        const scriptTag = document.createElement('script');
        scriptTag.textContent = scriptContent;
        document.body.appendChild(scriptTag);

    } catch (error) {
        console.error('Erro no form-loader:', error);
        const container = document.getElementById('form-container');
        if(container) container.innerHTML = '<p class="alert alert-danger">Não foi possível carregar o formulário. Tente recarregar a página.</p>';
    }
});