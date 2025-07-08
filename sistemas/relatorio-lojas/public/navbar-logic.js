document.addEventListener('DOMContentLoaded', async () => {
    const navAdmin = document.getElementById('nav-admin');
    const navGerenciar = document.getElementById('nav-gerenciar');
    const navDemandas = document.getElementById('nav-demandas');
    const userInfo = document.getElementById('user-info');
    
    try {
        const response = await fetch('/api/session-info');
        if (!response.ok) {
            window.location.href = '/login';
            return;
        }
        const session = await response.json();

        if (userInfo) {
            userInfo.innerHTML = `
                <span class="navbar-text me-2 d-none d-lg-inline">
                    Olá, ${session.username}
                </span>
                <a href="/logout" class="btn btn-sm btn-outline-secondary" title="Sair">
                    <i class="bi bi-box-arrow-right"></i>
                </a>`;
        }
        
        if (session.role === 'admin') {
            if (navAdmin) navAdmin.classList.remove('d-none');
            if (navGerenciar) navGerenciar.classList.remove('d-none');
        }
        
        if (navDemandas) navDemandas.classList.remove('d-none');

    } catch (e) {
        console.error("Erro ao buscar informações da sessão", e);
    }
});