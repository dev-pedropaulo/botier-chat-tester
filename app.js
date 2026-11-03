/**
 * BOTIER • VALIDADOR & PLAYGROUND SDR ANA
 * Plataforma de testes, homologação e apontamento de falhas para a equipe comercial Botier.
 */

// Webhook ativo no n8n (Chat Trigger)
const WEBHOOK_URL = 'https://agentesn8n-n8n.cqc86v.easypanel.host/webhook/test-sdr-ana-chat/chat';

// Chaves locais do navegador
const STORAGE_KEYS = {
  SESSION_ID: 'botier_sdr_session_id',
  FEEDBACKS: 'botier_sdr_feedbacks',
  TESTER_NAME: 'botier_sdr_tester_name'
};

// Estado global da aplicação
const state = {
  sessionId: '',
  feedbacks: [],
  isSending: false,
  lastUserMessage: '',
  activeFlagTarget: null,
  telemetry: {
    produtoFoco: 'Serena ECO',
    score: 0,
    temperatura: 'FRIO',
    dadosCompletos: false,
    acionarEspecialista: false
  }
};

// Mapeamento dos elementos DOM
const dom = {
  chatMessages: document.getElementById('chatMessages'),
  chatEmptyState: document.getElementById('chatEmptyState'),
  messageInput: document.getElementById('messageInput'),
  sendBtn: document.getElementById('sendBtn'),
  typingIndicatorRow: document.getElementById('typingIndicatorRow'),
  sessionDisplay: document.getElementById('sessionDisplay'),
  latencyDisplay: document.getElementById('latencyDisplay'),
  
  // Header Telemetria
  valProdutoFoco: document.getElementById('valProdutoFoco'),
  valScoreTemp: document.getElementById('valScoreTemp'),
  valDiego: document.getElementById('valDiego'),
  
  // Botões de Topo e Chat
  newChatTopBtn: document.getElementById('newChatTopBtn'),
  clearChatBtn: document.getElementById('clearChatBtn'),
  exportChatBtn: document.getElementById('exportChatBtn'),
  
  // Mobile Sidebar Drawer
  sidebarContainer: document.getElementById('sidebarContainer'),
  sidebarBackdrop: document.getElementById('sidebarBackdrop'),
  toggleScenariosMobileBtn: document.getElementById('toggleScenariosMobileBtn'),
  closeSidebarMobileBtn: document.getElementById('closeSidebarMobileBtn'),

  // Modal de Feedback
  feedbackModal: document.getElementById('feedbackModal'),
  closeFeedbackModalBtn: document.getElementById('closeFeedbackModalBtn'),
  cancelFeedbackBtn: document.getElementById('cancelFeedbackBtn'),
  saveFeedbackBtn: document.getElementById('saveFeedbackBtn'),
  modalFlaggedQuote: document.getElementById('modalFlaggedQuote'),
  feedbackCommentInput: document.getElementById('feedbackCommentInput'),
  feedbackTesterInput: document.getElementById('feedbackTesterInput'),
  
  // Drawer de Feedback
  feedbackDrawer: document.getElementById('feedbackDrawer'),
  feedbackDrawerBackdrop: document.getElementById('feedbackDrawerBackdrop'),
  openFeedbackDrawerBtn: document.getElementById('openFeedbackDrawerBtn'),
  closeFeedbackDrawerBtn: document.getElementById('closeFeedbackDrawerBtn'),
  feedbackBadgeCount: document.getElementById('feedbackBadgeCount'),
  drawerFeedbackCount: document.getElementById('drawerFeedbackCount'),
  feedbackListContainer: document.getElementById('feedbackListContainer'),
  exportJsonBtn: document.getElementById('exportJsonBtn'),
  exportCsvBtn: document.getElementById('exportCsvBtn'),
  clearFeedbacksBtn: document.getElementById('clearFeedbacksBtn')
};

// ==========================================================================
// INICIALIZAÇÃO
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initSession();
  loadFeedbacks();
  setupEventListeners();
  autoResizeTextarea();

  const savedTester = localStorage.getItem(STORAGE_KEYS.TESTER_NAME);
  if (savedTester && dom.feedbackTesterInput) {
    dom.feedbackTesterInput.value = savedTester;
  }
});

function initSession(forceNew = false) {
  if (forceNew || !localStorage.getItem(STORAGE_KEYS.SESSION_ID)) {
    const newId = 'botier-sdr-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, newId);
    state.sessionId = newId;
  } else {
    state.sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
  }

  if (dom.sessionDisplay) {
    dom.sessionDisplay.textContent = state.sessionId;
  }
}

// ==========================================================================
// CONTROLE DE MENSAGENS & WEBHOOK
// ==========================================================================
async function handleSendMessage() {
  const text = dom.messageInput.value.trim();
  if (!text || state.isSending) return;

  state.isSending = true;
  state.lastUserMessage = text;
  dom.sendBtn.disabled = true;

  // Esconde o empty state assim que o usuário manda a primeira mensagem
  if (dom.chatEmptyState) {
    dom.chatEmptyState.style.display = 'none';
  }

  // 1. Renderiza a mensagem do produtor na tela
  appendUserMessage(text);
  dom.messageInput.value = '';
  dom.messageInput.style.height = 'auto';

  // 2. Exibe o indicador "Ana está digitando..."
  showTypingIndicator();

  const startTime = performance.now();

  try {
    const payload = {
      action: 'sendMessage',
      chatInput: text,
      sessionId: state.sessionId
    };

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const elapsedMs = Math.round(performance.now() - startTime);
    if (dom.latencyDisplay) {
      dom.latencyDisplay.textContent = `${elapsedMs} ms`;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    hideTypingIndicator();

    // Extrai o texto limpo da mensagem (priorizando 'mensagem' sobre 'output' de debug)
    const botText = data.mensagem || (data.output ? data.output.split('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')[0].trim() : 'Sem resposta da Ana.');
    
    // Atualiza a telemetria global
    updateTelemetry(data);

    // Renderiza a resposta da Ana com o card retrátil de dados
    appendBotMessage(botText, elapsedMs, data);

  } catch (err) {
    console.error('Falha no envio da mensagem:', err);
    hideTypingIndicator();
    appendErrorMessage('⚠️ A Ana não conseguiu responder no momento. Verifique a conexão com o n8n e tente novamente.');
  } finally {
    state.isSending = false;
    dom.sendBtn.disabled = false;
    dom.messageInput.focus();
  }
}

function updateTelemetry(data) {
  if (!data) return;

  const foco = data.produto_foco || state.telemetry.produtoFoco;
  const score = data.pontuacao !== undefined ? data.pontuacao : state.telemetry.score;
  const temp = data.temperatura || state.telemetry.temperatura;
  const diego = data.acionar_especialista === true;

  state.telemetry = {
    produtoFoco: foco,
    score: score,
    temperatura: temp,
    dadosCompletos: Boolean(data.dados_completos),
    acionarEspecialista: diego
  };

  if (dom.valProdutoFoco) dom.valProdutoFoco.textContent = foco;
  if (dom.valScoreTemp) dom.valScoreTemp.textContent = `${score} pts • ${temp}`;
  
  if (dom.valDiego) {
    dom.valDiego.textContent = diego ? '🚨 Conectado' : 'Aguardando';
    dom.valDiego.style.color = diego ? '#f87171' : '#ffffff';
  }
}

// ==========================================================================
// RENDERIZAÇÃO DE BALÕES NO CHAT
// ==========================================================================
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function appendUserMessage(text) {
  const row = document.createElement('div');
  row.className = 'msg-row user';
  
  row.innerHTML = `
    <div class="msg-bubble">
      <div class="msg-sender">Produtor (Testador)</div>
      <div class="msg-text">${escapeHtml(text)}</div>
      <div class="msg-meta">
        <span>${getCurrentTime()}</span>
        <span style="color: var(--wa-check-blue);">✔✔</span>
      </div>
    </div>
  `;

  insertMessageBeforeTyping(row);
  scrollToBottom();
}

function appendBotMessage(text, latencyMs, rawData = null) {
  const row = document.createElement('div');
  row.className = 'msg-row bot';
  
  const timeLabel = getCurrentTime();

  // Prepara card de telemetria RETRÁTIL (Details/Summary) para não poluir
  let telemetryHtml = '';
  if (rawData) {
    const foco = rawData.produto_foco || 'Serena ECO';
    const score = rawData.pontuacao !== undefined ? rawData.pontuacao : 0;
    const temp = rawData.temperatura || 'FRIO';
    const completo = rawData.dados_completos ? '✅ Completa' : '⏳ Em andamento';
    const diego = rawData.acionar_especialista ? '🚨 Acionado' : 'Não';
    const novos = rawData.novos_dados ? JSON.stringify(rawData.novos_dados) : '{}';

    telemetryHtml = `
      <details class="msg-telemetry-details">
        <summary class="msg-telemetry-summary">
          <span>🛠️ Telemetria SDR (${latencyMs}ms)</span>
          <span class="telemetry-badge-mini">${foco} • ${score} pts</span>
        </summary>
        <div class="msg-telemetry-content">
          <div>• Foco: <span>${foco}</span> | Score: <span>${score} pts</span> (${temp})</div>
          <div>• Qualificação: <span>${completo}</span> | Diego: <span>${diego}</span></div>
          <div>• Novos dados: <code style="color: #4ade80;">${escapeHtml(novos)}</code></div>
        </div>
      </details>
    `;
  }

  row.innerHTML = `
    <div class="msg-bubble">
      <div class="msg-sender">Ana • Técnica Parceira Botier</div>
      <div class="msg-text">${formatMessageText(text)}</div>
      ${telemetryHtml}
      <div class="msg-meta">
        <span>${timeLabel}</span>
      </div>
      <div class="msg-feedback-bar">
        <span style="font-size: 10px; color: var(--slate-400);">Resposta da Ana</span>
        <button class="btn-flag" onclick="openFeedbackForMessage(this)" data-msg="${encodeURIComponent(text)}">
          🚩 Apontar Erro
        </button>
      </div>
    </div>
  `;

  insertMessageBeforeTyping(row);
  scrollToBottom();
}

function appendErrorMessage(text) {
  const row = document.createElement('div');
  row.className = 'msg-row bot';
  row.innerHTML = `
    <div class="msg-bubble" style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #fca5a5;">
      <div class="msg-text">${escapeHtml(text)}</div>
    </div>
  `;
  insertMessageBeforeTyping(row);
  scrollToBottom();
}

function insertMessageBeforeTyping(element) {
  if (dom.typingIndicatorRow) {
    dom.chatMessages.insertBefore(element, dom.typingIndicatorRow);
  } else {
    dom.chatMessages.appendChild(element);
  }
}

function showTypingIndicator() {
  if (dom.typingIndicatorRow) {
    dom.typingIndicatorRow.style.display = 'flex';
    scrollToBottom();
  }
}

function hideTypingIndicator() {
  if (dom.typingIndicatorRow) {
    dom.typingIndicatorRow.style.display = 'none';
  }
}

function scrollToBottom() {
  setTimeout(() => {
    dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
  }, 50);
}

// ==========================================================================
// CONTROLE DE NOVA CONVERSA & LIMPEZA (TELA 100% LIMPA)
// ==========================================================================
function startNewConversation() {
  initSession(true);
  updateTelemetry({
    produto_foco: 'Serena ECO',
    pontuacao: 0,
    temperatura: 'FRIO',
    dados_completos: false,
    acionar_especialista: false
  });

  const allRows = dom.chatMessages.querySelectorAll('.msg-row');
  allRows.forEach(row => {
    if (row.id !== 'typingIndicatorRow') row.remove();
  });

  const dividers = dom.chatMessages.querySelectorAll('.chat-date-divider');
  dividers.forEach(d => d.remove());

  // Restaura o Empty State limpo
  if (dom.chatEmptyState) {
    dom.chatEmptyState.style.display = 'flex';
  }

  dom.messageInput.value = '';
  dom.messageInput.style.height = 'auto';
  dom.messageInput.focus();
}

// ==========================================================================
// SISTEMA DE FEEDBACK & APONTAMENTO DE ERROS
// ==========================================================================
window.openFeedbackForMessage = function(buttonEl) {
  const encodedText = buttonEl.getAttribute('data-msg');
  const messageText = decodeURIComponent(encodedText || '');

  state.activeFlagTarget = {
    botResponse: messageText,
    userPrompt: state.lastUserMessage,
    sessionId: state.sessionId,
    telemetrySnapshot: Object.assign({}, state.telemetry),
    timestamp: new Date().toISOString()
  };

  dom.modalFlaggedQuote.textContent = `"${messageText.substring(0, 180)}${messageText.length > 180 ? '...' : ''}"`;
  dom.feedbackCommentInput.value = '';
  dom.feedbackModal.style.display = 'flex';
  dom.feedbackCommentInput.focus();
};

function closeFeedbackModal() {
  dom.feedbackModal.style.display = 'none';
  state.activeFlagTarget = null;
}

function handleSaveFeedback() {
  if (!state.activeFlagTarget) return;

  const severityEl = document.querySelector('.severity-pill.selected');
  const categoryEl = document.querySelector('.category-option.selected');
  
  const severity = severityEl ? severityEl.getAttribute('data-severity') : 'Média';
  const category = categoryEl ? categoryEl.getAttribute('data-cat') : 'Outro motivo';
  const comment = dom.feedbackCommentInput.value.trim();
  const tester = dom.feedbackTesterInput ? dom.feedbackTesterInput.value.trim() : 'Tester';

  localStorage.setItem(STORAGE_KEYS.TESTER_NAME, tester);

  const newFeedback = {
    id: 'err-' + Date.now().toString(36),
    formattedTime: new Date().toLocaleString('pt-BR'),
    sessionId: state.activeFlagTarget.sessionId,
    userPrompt: state.activeFlagTarget.userPrompt,
    botResponse: state.activeFlagTarget.botResponse,
    category: category,
    severity: severity,
    comment: comment,
    tester: tester,
    telemetry: state.activeFlagTarget.telemetrySnapshot
  };

  state.feedbacks.unshift(newFeedback);
  saveFeedbacks();
  closeFeedbackModal();
  renderFeedbackList();

  // Envio assíncrono para a nuvem (Data Table do n8n)
  sendFeedbackToCloud(newFeedback);
}

async function sendFeedbackToCloud(fb) {
  try {
    const payload = {
      action: 'salvar_feedback',
      feedback: {
        id: fb.id,
        data_hora: fb.formattedTime,
        sessao: fb.sessionId,
        testador: fb.tester,
        categoria: fb.category,
        gravidade: fb.severity,
        mensagem_usuario: fb.userPrompt,
        resposta_ana: fb.botResponse,
        comentario_correcao: fb.comment,
        score: fb.telemetry?.score || 0,
        temperatura: fb.telemetry?.temperatura || 'INDEFINIDO',
        produto_foco: fb.telemetry?.produtoFoco || 'Indefinido'
      }
    };

    const resp = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (resp.ok) {
      fb.syncedToCloud = true;
      saveFeedbacks();
      renderFeedbackList();
      showToast('☁️ Falha salva na Data Table em nuvem!');
    } else {
      console.warn('Erro ao salvar na nuvem (HTTP ' + resp.status + ')');
      showToast('⚠️ Falha salva localmente (aguardando sync na nuvem)');
    }
  } catch (err) {
    console.warn('Erro de rede ao salvar feedback na nuvem:', err);
    showToast('⚠️ Salvo localmente no navegador');
  }
}

function showToast(msg) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #0f172a; color: #ffffff; padding: 10px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 9999; border-left: 4px solid #10b981; transition: opacity 0.3s ease;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.display = 'block';
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => { toast.style.display = 'none'; }, 300);
  }, 3500);
}

function loadFeedbacks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
    state.feedbacks = raw ? JSON.parse(raw) : [];
  } catch (e) {
    state.feedbacks = [];
  }
  updateFeedbackBadges();
  renderFeedbackList();
}

function saveFeedbacks() {
  localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(state.feedbacks));
  updateFeedbackBadges();
}

function updateFeedbackBadges() {
  const count = state.feedbacks.length;
  if (dom.feedbackBadgeCount) dom.feedbackBadgeCount.textContent = count;
  if (dom.drawerFeedbackCount) dom.drawerFeedbackCount.textContent = count;
}

function renderFeedbackList() {
  if (!dom.feedbackListContainer) return;

  if (state.feedbacks.length === 0) {
    dom.feedbackListContainer.innerHTML = '<div class="empty-feedbacks">Nenhum erro apontado ainda. Teste a Ana pelo chat e marque 🚩 caso encontre falhas!</div>';
    return;
  }

  dom.feedbackListContainer.innerHTML = state.feedbacks.map(fb => `
    <div class="feedback-card">
      <div class="card-top">
        <span class="card-cat">${escapeHtml(fb.category)}</span>
        <span class="card-sev ${fb.severity}">${fb.severity}</span>
      </div>
      <div class="card-quote">"${escapeHtml(fb.botResponse ? fb.botResponse.substring(0, 140) + (fb.botResponse.length > 140 ? '...' : '') : '')}"</div>
      ${fb.comment ? `<div class="card-comment"><strong>Correção:</strong> ${escapeHtml(fb.comment)}</div>` : ''}
      <div class="card-meta">
        <span>Por: ${escapeHtml(fb.tester || 'Testador')}</span>
        <span>${escapeHtml(fb.formattedTime)}</span>
        ${fb.syncedToCloud ? '<span style="color: #10b981; font-weight: 700; font-size: 10px;">☁️ Data Table OK</span>' : '<span style="color: #94a3b8; font-size: 10px;">💾 Local</span>'}
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// EXPORTAÇÕES (JSON, CSV, TXT)
// ==========================================================================
function exportFeedbacksJson() {
  if (state.feedbacks.length === 0) {
    alert('Nenhum erro registrado para exportar.');
    return;
  }
  const blob = new Blob([JSON.stringify(state.feedbacks, null, 2)], { type: 'application/json' });
  downloadFile(blob, `botier-sdr-erros-${Date.now()}.json`);
}

function exportFeedbacksCsv() {
  if (state.feedbacks.length === 0) {
    alert('Nenhum erro registrado para exportar.');
    return;
  }

  const headers = ['DataHora', 'Sessao', 'Testador', 'Gravidade', 'Categoria', 'MensagemUsuario', 'RespostaAna', 'ComentarioCorrecao'];
  const rows = state.feedbacks.map(fb => [
    `"${(fb.formattedTime || '').replace(/"/g, '""')}"`,
    `"${(fb.sessionId || '').replace(/"/g, '""')}"`,
    `"${(fb.tester || '').replace(/"/g, '""')}"`,
    `"${(fb.severity || '').replace(/"/g, '""')}"`,
    `"${(fb.category || '').replace(/"/g, '""')}"`,
    `"${(fb.userPrompt || '').replace(/"/g, '""')}"`,
    `"${(fb.botResponse || '').replace(/"/g, '""')}"`,
    `"${(fb.comment || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, `botier-sdr-erros-${Date.now()}.csv`);
}

function exportChatTranscript() {
  const rows = dom.chatMessages.querySelectorAll('.msg-row');
  const lines = [`=== TRANSCRIÇÃO DE TESTE SDR BOTIER ===`, `Data: ${new Date().toLocaleString('pt-BR')}`, `Sessão: ${state.sessionId}`, `----------------------------------------\n`];

  rows.forEach(r => {
    const sender = r.querySelector('.msg-sender')?.textContent || '';
    const text = r.querySelector('.msg-text')?.textContent || '';
    if (sender && text) {
      lines.push(`[${sender}]:\n${text}\n`);
    }
  });

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  downloadFile(blob, `conversa-ana-botier-${Date.now()}.txt`);
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==========================================================================
// CONFIGURAÇÃO DE EVENTOS
// ==========================================================================
function setupEventListeners() {
  dom.sendBtn.addEventListener('click', handleSendMessage);
  
  dom.messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  if (dom.newChatTopBtn) dom.newChatTopBtn.addEventListener('click', () => { if (confirm('Deseja iniciar uma nova conversa com a Ana do zero?')) startNewConversation(); });

  if (dom.clearChatBtn) {
    dom.clearChatBtn.addEventListener('click', () => {
      if (confirm('Deseja limpar as mensagens da tela? (Os erros salvos não serão apagados)')) {
        const rows = dom.chatMessages.querySelectorAll('.msg-row');
        rows.forEach((r) => { if (r.id !== 'typingIndicatorRow') r.remove(); });
        if (dom.chatEmptyState) dom.chatEmptyState.style.display = 'flex';
      }
    });
  }

  if (dom.exportChatBtn) dom.exportChatBtn.addEventListener('click', exportChatTranscript);

  // Cenários rápidos da sidebar
  document.querySelectorAll('.scenario-card').forEach(card => {
    card.addEventListener('click', () => {
      const prompt = card.getAttribute('data-prompt');
      if (prompt) {
        // Se estiver no mobile, fecha a gaveta de cenários ao selecionar
        closeMobileSidebar();

        dom.messageInput.value = prompt;
        dom.messageInput.focus();
        handleSendMessage();
      }
    });
  });

  // Mobile Sidebar Drawer
  if (dom.toggleScenariosMobileBtn) {
    dom.toggleScenariosMobileBtn.addEventListener('click', openMobileSidebar);
  }
  if (dom.closeSidebarMobileBtn) {
    dom.closeSidebarMobileBtn.addEventListener('click', closeMobileSidebar);
  }
  if (dom.sidebarBackdrop) {
    dom.sidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }

  // Modal de Feedback
  dom.closeFeedbackModalBtn.addEventListener('click', closeFeedbackModal);
  dom.cancelFeedbackBtn.addEventListener('click', closeFeedbackModal);
  dom.saveFeedbackBtn.addEventListener('click', handleSaveFeedback);

  // Seleção de severidade
  document.querySelectorAll('.severity-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.severity-pill').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
    });
  });

  // Seleção de categoria
  document.querySelectorAll('.category-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.category-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
    });
  });

  // Drawer de Feedbacks
  dom.openFeedbackDrawerBtn.addEventListener('click', () => {
    dom.feedbackDrawer.classList.add('active');
    dom.feedbackDrawerBackdrop.style.display = 'block';
  });

  const closeDrawer = () => {
    dom.feedbackDrawer.classList.remove('active');
    dom.feedbackDrawerBackdrop.style.display = 'none';
  };

  dom.closeFeedbackDrawerBtn.addEventListener('click', closeDrawer);
  dom.feedbackDrawerBackdrop.addEventListener('click', closeDrawer);

  dom.exportJsonBtn.addEventListener('click', exportFeedbacksJson);
  dom.exportCsvBtn.addEventListener('click', exportFeedbacksCsv);

  dom.clearFeedbacksBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja apagar todos os registros de erros salvos localmente?')) {
      state.feedbacks = [];
      saveFeedbacks();
      renderFeedbackList();
    }
  });
}

function openMobileSidebar() {
  if (dom.sidebarContainer) dom.sidebarContainer.classList.add('active');
  if (dom.sidebarBackdrop) dom.sidebarBackdrop.style.display = 'block';
}

function closeMobileSidebar() {
  if (dom.sidebarContainer) dom.sidebarContainer.classList.remove('active');
  if (dom.sidebarBackdrop) dom.sidebarBackdrop.style.display = 'none';
}

function autoResizeTextarea() {
  dom.messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 100) + 'px';
  });
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

function formatMessageText(text) {
  let safe = escapeHtml(text);
  safe = safe.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
  safe = safe.replace(/_([^_]+)_/g, '<em>$1</em>');
  safe = safe.replace(/~([^~]+)~/g, '<del>$1</del>');
  return safe;
}
