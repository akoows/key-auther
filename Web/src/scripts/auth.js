(async function verificarAutenticacao() {
  const apiUrl = "http://localhost:3000/api";
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.warn("Nenhum usuário logado. Redirecionando...");
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/users/${userId}`);
    if (!response.ok) throw new Error("Usuário não encontrado.");

    const user = await response.json();
    if (!user || !user.id) {
      throw new Error("Usuário inválido.");
    }

  } catch (error) {
    console.error("Falha na autenticação:", error.message);
    localStorage.clear();
    window.location.href = "index.html";
  }
})();

function logout() {
  localStorage.clear();
  if (typeof notify === "function") {
    notify("info", "Sessão encerrada");
  }
  setTimeout(() => {
    window.location.href = "index.html";
  }, 800);
}

