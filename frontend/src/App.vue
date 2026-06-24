<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface ApiResponse {
  message: string;
  status: string;
}

const data = ref<ApiResponse | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch('/api/hello');
    if (!res.ok) {
      throw new Error(`Erreur HTTP: ${res.status}`);
    }
    data.value = await res.json();
  } catch (err: any) {
    error.value = err.message || "Une erreur est survenue lors de la communication avec le backend.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="app-container">
    <div class="card">
      <header class="card-header">
        <div class="logo">🚀</div>
        <h1>Docker Swarm CI/CD Demo</h1>
        <p class="subtitle">Master 1 TP - Déploiement Automatisé</p>
      </header>

      <main class="card-body">
        <div v-if="loading" class="status-container loading">
          <div class="spinner"></div>
          <p>Récupération des données du backend...</p>
        </div>

        <div v-else-if="error" class="status-container error">
          <div class="icon">⚠️</div>
          <p class="error-text">Impossible de contacter le backend</p>
          <p class="error-detail">{{ error }}</p>
          <button @click="fetchData" class="btn btn-retry">Réessayer</button>
        </div>

        <div v-else-if="data" class="status-container success">
          <div class="icon">✅</div>
          <p class="success-text">Connexion backend réussie !</p>
          <div class="response-box">
            <span class="label">Réponse API :</span>
            <pre>{{ JSON.stringify(data, null, 2) }}</pre>
          </div>
          <button @click="fetchData" class="btn btn-refresh">Rafraîchir</button>
        </div>
      </main>

      <footer class="card-footer">
        <span class="badge">Frontend: Vue.js + Vite</span>
        <span class="badge">Backend: Node.js (TS)</span>
      </footer>
    </div>
  </div>
</template>

<style>
/* Reset & Styles de Base */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  color: #f8fafc;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

/* Container & Design de la Carte */
.app-container {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  perspective: 1000px;
}

.card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), 0 0 20px rgba(99, 102, 241, 0.2);
}

/* En-tête */
.card-header .logo {
  font-size: 3rem;
  margin-bottom: 15px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.card-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(to right, #818cf8, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 5px;
}

.card-header .subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 30px;
}

/* Corps de la carte */
.card-body {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.status-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.status-container .icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

/* Spinner de chargement */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading p {
  color: #94a3b8;
  font-size: 0.95rem;
}

/* Affichage du succès */
.success-text {
  font-size: 1.1rem;
  color: #4ade80;
  font-weight: 600;
  margin-bottom: 15px;
}

.response-box {
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  padding: 15px;
  text-align: left;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 20px;
}

.response-box .label {
  display: block;
  font-size: 0.8rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 5px;
}

.response-box pre {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  color: #38bdf8;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Affichage de l'erreur */
.error-text {
  font-size: 1.1rem;
  color: #f87171;
  font-weight: 600;
  margin-bottom: 5px;
}

.error-detail {
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 20px;
}

/* Boutons */
.btn {
  border: none;
  border-radius: 12px;
  padding: 10px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn-refresh {
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-refresh:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.btn-retry {
  background: rgba(248, 113, 113, 0.2);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.4);
}

.btn-retry:hover {
  background: rgba(248, 113, 113, 0.3);
}

/* Pied de carte */
.card-footer {
  margin-top: 35px;
  display: flex;
  justify-content: center;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 20px;
}

.badge {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 0.75rem;
  color: #94a3b8;
}
</style>
