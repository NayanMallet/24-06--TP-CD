<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

interface ApiResponse {
  message: string;
  status: string;
  containerId: string;
}

const data = ref<ApiResponse | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Historique des conteneurs contactés pour démontrer le Load Balancing
interface HistoryEntry {
  id: string;
  time: string;
  theme: string;
}
const contactHistory = ref<HistoryEntry[]>([]);

// Algorithme de hachage simple pour associer un conteneur à un thème Y2K spécifique
const activeTheme = computed(() => {
  if (!data.value?.containerId) return 'y2k-default';
  const id = data.value.containerId;
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % 3;
  const themes = ['y2k-pink', 'y2k-green', 'y2k-blue'];
  return themes[index];
});

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch('/api/hello');
    if (!res.ok) {
      throw new Error(`Erreur HTTP: ${res.status}`);
    }
    const json: ApiResponse = await res.json();
    data.value = json;

    // Calcul temporaire du thème pour l'ajouter à l'historique
    const id = json.containerId;
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % 3;
    const itemTheme = ['y2k-pink', 'y2k-green', 'y2k-blue'][index];

    // Ajout à l'historique de répartition du trafic (au début de la liste)
    contactHistory.value.unshift({
      id: json.containerId,
      time: new Date().toLocaleTimeString(),
      theme: itemTheme
    });

    // Limiter l'affichage de l'historique aux 5 derniers appels
    if (contactHistory.value.length > 5) {
      contactHistory.value.pop();
    }
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
  <div class="app-wrapper" :class="activeTheme">
    <!-- Overlay nostalgique avec effet de lignes CRT (Scanlines) -->
    <div class="scanlines"></div>

    <div class="app-container">
      <div class="card">
        <header class="card-header">
          <div class="logo-container">
            <span class="logo">👾</span>
          </div>
          <h1>SWARM LOAD BALANCER</h1>
          <p class="subtitle">Visualizer Cluster • Y2K Edition</p>
        </header>

        <main class="card-body">
          <div v-if="loading" class="status-container loading">
            <div class="spinner"></div>
            <p class="blink">ACQUISITION DU FLUX CANAL...</p>
          </div>

          <div v-else-if="error" class="status-container error">
            <div class="icon">☠️</div>
            <p class="error-text">ERREUR DE LIAISON BACKEND</p>
            <p class="error-detail">{{ error }}</p>
            <button @click="fetchData" class="btn btn-retry">RE-TENTER LA LIAISON</button>
          </div>

          <div v-else-if="data" class="status-container success">
            <!-- Capsule mettant en évidence l'instance de backend active -->
            <div class="instance-capsule">
              <span class="capsule-label">SERVI PAR L'INSTANCE</span>
              <span class="capsule-value">{{ data.containerId }}</span>
            </div>

            <div class="response-box">
              <span class="label">Contenu de la Réponse JSON :</span>
              <pre>{{ JSON.stringify(data, null, 2) }}</pre>
            </div>

            <button @click="fetchData" class="btn btn-refresh">OBTENIR NOUVELLE ROUTE</button>
          </div>
        </main>

        <!-- Liste d'historique montrant les différents réplicas Swarm contactés -->
        <section v-if="contactHistory.length > 0" class="history-section">
          <h3>RÉPARTITION DU TRAFIC (LOAD BALANCING)</h3>
          <div class="history-list">
            <div
              v-for="(item, idx) in contactHistory"
              :key="idx"
              class="history-item"
              :class="item.theme"
            >
              <span class="time">{{ item.time }}</span>
              <span class="arrow">➔</span>
              <span class="host">{{ item.id }}</span>
            </div>
          </div>
        </section>

        <footer class="card-footer">
          <span class="badge">SWARM REPLICAS: 3</span>
          <span class="badge">UI: VUE 3</span>
        </footer>
      </div>
    </div>
  </div>
</template>

<style>
/* Variables de thèmes Y2K */
.y2k-default {
  --y2k-accent: #818cf8;
  --y2k-accent-glow: rgba(129, 140, 248, 0.4);
  --y2k-bg-grad: linear-gradient(135deg, #0b0f19 0%, #1e1b4b 100%);
  --y2k-text-glow: 0 0 8px rgba(129, 140, 248, 0.6);
}

/* Thème 1 : Rose Néon Cyber */
.y2k-pink {
  --y2k-accent: #ff0055;
  --y2k-accent-glow: rgba(255, 0, 85, 0.45);
  --y2k-bg-grad: linear-gradient(135deg, #1a000d 0%, #3d0022 100%);
  --y2k-text-glow: 0 0 10px #ff0055, 0 0 20px rgba(255, 0, 85, 0.3);
}

/* Thème 2 : Vert Cyber Matrix */
.y2k-green {
  --y2k-accent: #39ff14;
  --y2k-accent-glow: rgba(57, 255, 20, 0.45);
  --y2k-bg-grad: linear-gradient(135deg, #051400 0%, #0d3300 100%);
  --y2k-text-glow: 0 0 10px #39ff14, 0 0 20px rgba(57, 255, 20, 0.3);
}

/* Thème 3 : Bleu Givré Métallique */
.y2k-blue {
  --y2k-accent: #00f0ff;
  --y2k-accent-glow: rgba(0, 240, 255, 0.45);
  --y2k-bg-grad: linear-gradient(135deg, #000c1a 0%, #002d5c 100%);
  --y2k-text-glow: 0 0 10px #00f0ff, 0 0 20px rgba(0, 240, 255, 0.3);
}

/* Reset & Base */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--y2k-bg-grad);
  color: #e2e8f0;
  font-family: 'Courier New', Courier, monospace;
  overflow-x: hidden;
  transition: background 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Effet lignes de balayage CRT */
.scanlines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 0, 0, 0.25) 50%
  );
  background-size: 100% 4px;
  z-index: 10;
  pointer-events: none;
}

.app-container {
  width: 100%;
  max-width: 520px;
  padding: 20px;
  z-index: 20;
}

/* Style de la carte */
.card {
  background: rgba(10, 10, 15, 0.85);
  border: 2px solid var(--y2k-accent);
  box-shadow: 0 0 25px var(--y2k-accent-glow), inset 0 0 15px rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 30px;
  transition: border-color 0.6s, box-shadow 0.6s;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

/* Header */
.logo-container {
  font-size: 3.5rem;
  margin-bottom: 10px;
  filter: drop-shadow(0 0 8px var(--y2k-accent));
  animation: float 2.5s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-8px) scale(1.05); }
}

.card-header h1 {
  font-size: 1.7rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: #fff;
  text-shadow: var(--y2k-text-glow);
  margin-bottom: 5px;
}

.card-header .subtitle {
  color: #a0aec0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 25px;
}

/* Spinner de chargement */
.spinner {
  width: 50px;
  height: 50px;
  border: 4px dashed var(--y2k-accent);
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.blink {
  animation: blink-anim 1s steps(2, start) infinite;
  color: var(--y2k-accent);
  font-weight: bold;
}

@keyframes blink-anim {
  to { visibility: hidden; }
}

/* Capsule de l'Instance Active */
.instance-capsule {
  width: 100%;
  border: 2px solid var(--y2k-accent);
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: inset 0 0 10px var(--y2k-accent-glow);
  display: flex;
  flex-direction: column;
  gap: 5px;
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.capsule-label {
  font-size: 0.75rem;
  color: #a0aec0;
  letter-spacing: 0.15em;
  font-weight: bold;
}

.capsule-value {
  font-size: 1.6rem;
  color: #fff;
  font-weight: 900;
  letter-spacing: 0.05em;
  text-shadow: var(--y2k-text-glow);
}

/* Zone de code réponse */
.response-box {
  width: 100%;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 12px;
  text-align: left;
  margin-bottom: 20px;
}

.response-box .label {
  display: block;
  font-size: 0.7rem;
  color: #718096;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.response-box pre {
  font-size: 0.8rem;
  color: var(--y2k-accent);
  text-shadow: var(--y2k-text-glow);
  white-space: pre-wrap;
}

/* Boutons */
.btn {
  font-family: 'Courier New', Courier, monospace;
  font-weight: 900;
  text-transform: uppercase;
  border: 2px solid var(--y2k-accent);
  border-radius: 8px;
  padding: 12px 28px;
  cursor: pointer;
  background: transparent;
  color: #fff;
  transition: all 0.2s ease;
  box-shadow: 0 0 10px var(--y2k-accent-glow);
}

.btn-refresh {
  background: var(--y2k-accent);
  color: #000;
  border: 2px solid var(--y2k-accent);
}

.btn-refresh:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px var(--y2k-accent);
  color: #fff;
}

.btn-retry {
  border-color: #ff0055;
  color: #ff0055;
}

.btn-retry:hover {
  background: #ff0055;
  color: #000;
}

/* Section Historique */
.history-section {
  margin-top: 25px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  text-align: left;
}

.history-section h3 {
  font-size: 0.75rem;
  color: #718096;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  border-left: 3px solid #718096;
}

.history-item.y2k-pink {
  border-left-color: #ff0055;
  color: #ff0055;
}

.history-item.y2k-green {
  border-left-color: #39ff14;
  color: #39ff14;
}

.history-item.y2k-blue {
  border-left-color: #00f0ff;
  color: #00f0ff;
}

.history-item .time {
  color: #718096;
}

.history-item .arrow {
  margin: 0 10px;
}

.history-item .host {
  font-weight: bold;
}

/* Pied de carte */
.card-footer {
  margin-top: 25px;
  display: flex;
  justify-content: center;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 15px;
}

.badge {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 0.7rem;
  color: #718096;
}
</style>
