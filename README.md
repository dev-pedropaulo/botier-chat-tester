# Botier • Validador & Playground SDR Ana (QA Studio)

Aplicação web desenvolvida para a equipe da **Botier** testar, homologar e estressar o agente comercial inteligente **Ana (SDR WhatsApp)**, validando os fluxos das ensiladeiras **Serena 130T** e **Serena ECO**.

---

## 🎯 Principais Funcionalidades

1. **Simulador WhatsApp Web Fiel:**
   - Interface visual moderna e responsiva idêntica ao WhatsApp comercial da Botier.
   - Indicador de digitação dinâmico (*"Ana está digitando..."*).
   - Medição de latência real de cada resposta (tempo de processamento no n8n).

2. **Telemetria SDR em Tempo Real (Debug Integrado):**
   - Header dinâmico com:
     - **Produto Foco:** `Serena ECO` ou `Serena 130T`
     - **Score & Temperatura:** `0 a 100 pts • FRIO / MORNO / QUENTE`
     - **Status do Especialista Diego:** `Aguardando` ou `🚨 Conectado`
   - Em cada resposta da Ana, um card técnico exibe os dados recém-coletados no turno e o status da qualificação.

3. **Cenários Rápidos de Estresse (1 Clique na Sidebar):**
   - **Regra dos 4 Benefícios:** Testa se a Ana ancora os 4 benefícios antes de soltar o preço quando o cliente pergunta *"Quanto custa?"*.
   - **Perfil Ideal Serena ECO:** Testa se a Ana identifica trator de 75 cv no motor e aplica a qualificação enxuta para leite em Minas Gerais.
   - **Comparativo Técnico:** Testa se a Ana explica claramente a ausência do cracker na ECO e a presença do cracker na 130T.
   - **Objeção de Preço (Pivot para ECO):** Simula um cliente que achou a 130T de R$ 240k cara e valida se a Ana oferece a versão econômica.
   - **Regra Exclusiva do Capim Capiaçu:** Testa se a Ana avisa que para capim o equipamento atua exclusivamente com Capiaçu.
   - **Potência (TDP vs Motor):** Testa se a Ana diferencia cv no motor de hp na TDP.
   - **Handoff & Grupo de Lançamento:** Valida a passagem de bastão para o Diego e o convite para o lote inicial de 30 máquinas da Serena ECO.

4. **Sistema de Marcação de Falhas ("🚩 Apontar Erro"):**
   - Cada resposta da Ana conta com o botão **🚩 Apontar Erro**.
   - Categorias mapeadas com base nas diretrizes comerciais e técnicas da Botier:
     - *Soltou preço seco sem os 4 benefícios*
     - *Ofereceu 130T para trator de 75cv em vez da ECO*
     - *Pergunta em bloco ou qualificação repetida*
     - *Erro técnico (TDP vs Motor / KPS / Facas)*
     - *Erro sobre culturas (não alertou sobre Capiaçu exclusivo)*
     - *Não convidou para o grupo de lançamento da ECO*
     - *Não acionou especialista Diego no momento certo*
     - *Tom robótico ou jargão interno de CRM*
     - *Outro motivo*
   - Níveis de severidade: **Baixa**, **Média** ou **Crítica**.
   - Campo para o testador detalhar como a Ana deveria ter respondido.

5. **Painel Geral de Auditoria & Exportação:**
   - Gaveta lateral (*Drawer*) que lista todos os feedbacks apontados pelos testadores.
   - **📥 Exportar JSON:** Arquivo completo para ajustes no prompt e nós do n8n.
   - **📊 Exportar CSV (Excel):** Planilha formatada com codificação UTF-8 BOM para análise em reuniões de produto.
   - **💾 Baixar Transcrição:** Exporta o diálogo completo em `.txt`.

---

## 🔗 Conexão com o n8n

A aplicação está configurada para enviar as mensagens para o webhook ativo no n8n:
```text
https://agentesn8n-n8n.cqc86v.easypanel.host/webhook/test-sdr-ana-chat/chat
```

Payload enviado:
```json
{
  "action": "sendMessage",
  "chatInput": "mensagem do testador",
  "sessionId": "botier-sdr-..."
}
```

---

## 💻 Como Rodar Localmente

Basta abrir o arquivo `index.html` diretamente em qualquer navegador, ou iniciar um servidor local:

```bash
# Com Python
python -m http.server 3000 --directory "c:\Users\devpe\OneDrive\Documentos\Imagens\agente-botier\botier-chat-tester"

# Ou com npx serve
npx serve "c:\Users\devpe\OneDrive\Documentos\Imagens\agente-botier\botier-chat-tester"
```

Acesse no navegador: `http://localhost:3000`

---

## 🚀 Como Subir na Vercel

A aplicação é 100% estática (HTML, CSS e JS puro) e já possui o arquivo `vercel.json` configurado.

### Pelo Terminal (Vercel CLI):
```bash
cd "c:\Users\devpe\OneDrive\Documentos\Imagens\agente-botier\botier-chat-tester"
npx vercel --prod
```

### Pelo Dashboard da Vercel:
1. Suba esta pasta para um repositório no GitHub (ex: `dev-pedropaulo/botier-chat-tester`).
2. Acesse [vercel.com](https://vercel.com) e importe o repositório.
3. Clique em **Deploy**.
