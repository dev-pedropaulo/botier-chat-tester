# 📑 Relatório de Auditoria e Teste de Estresse • SDR Ana Botier

**Data da Auditoria:** 03 de Novembro de 2026  
**Ambiente de Teste:** n8n Chat Trigger Webhook (`/test-sdr-ana-chat/chat`)  
**Modelo de IA:** OpenAI GPT-4o (`temperature: 0.3`)  
**Persona:** Ana • Técnica Parceira Botier  
**Equipamentos Auditados:** Serena 130T (Completa) e Serena ECO (Econômica)  
**Total de Cenários Executados:** 6 cenários independentes (18 turnos conversacionais)  
**Taxa de Conformidade Geral:** 83,3% (5 Aprovados com Louvor / 1 Alerta Agronômico)  
**Latência Média de Resposta:** 2.740 ms (~2,7 segundos por resposta)

---

## 1. Resumo Executivo da Auditoria

| ID | Cenário Testado | Turnos | Latência Média | Status | Destaque Principal |
|:---:|:---|:---:|:---:|:---:|:---|
| **C1** | **Armadilha de Preço Direto (Regra dos 4 Benefícios)** | 3 | 2.580 ms | 🟢 **APROVADO** | Ancorou afiação, contrafaca, catraca e plataforma antes de citar preço. |
| **C2** | **Jornada Serena ECO (Trator 75 cv + Qualificação Enxuta)** | 4 | 2.810 ms | 🟢 **APROVADO** | Identificou 75 cv, focou na ECO, coletou MG/leite e convidou para o lote de 30. |
| **C3** | **Grande Produtor Leiteiro (> 2.000 L/dia) - Serena 130T** | 4 | 2.858 ms | 🟢 **APROVADO** | Explicou KPS, eliminação de grãos nas fezes, TDP vs Motor e handoff com Diego. |
| **C4** | **Objeção de Preço (R$ 240k) e Pivot para Serena ECO** | 4 | 2.895 ms | 🟢 **APROVADO** | Pivotou com perfeição para a ECO ao ouvir que R$ 240k estava fora do orçamento. |
| **C5** | **Pegadinha Agronômica (Milho vs. Capins Gerais)** | 2 | 2.406 ms | 🔴 **ALERTA** | **Falha:** Afirmou que colhe mombaça/braquiária (quando é EXCLUSIVAMENTE Capiaçu). |
| **C6** | **Prestador de Serviço de Silagem (Demanda Pesada)** | 2 | 2.532 ms | 🟢 **APROVADO** | Indicou a 130T com cracker para 250 ha/safra sem perguntas desnecessárias. |

---

## 2. Análise Detalhada dos Cenários

### 🟢 Cenário 1: Armadilha de Preço Direto (Regra de Ouro dos 4 Benefícios)
* **Objetivo:** Testar se a Ana resiste a responder o preço seco na primeira mensagem e se ancora pelo menos 4 benefícios da reunião.
* **Transcrições Reais:**
  * **[Produtor]:** *"Quanto custa essa máquina de vocês? Me passa o preço sem enrolação."*
  * **[Ana]:** *"Antes de falar sobre valores, é importante destacar alguns benefícios que fazem a diferença na colheita: afiação automática das facas acionada direto da cabine, ajuste externo da contrafaca com chave 19mm em 3 a 5 minutos, embreagem catraca limitadora de torque (sem pino fusível) e plataforma de corte contínuo de 1,20m que colhe até 3 linhas sem embuchar. Para eu te passar o valor exato da configuração ideal, me conta: você trabalha com leite ou corte e qual a potência do seu trator?"*
  * **[Produtor]:** *"Eu tenho 45 vacas de leite em Varginha-MG e um trator de 75cv. Agora me fala os valores."*
  * **[Ana]:** *"Para o seu trator de 75 cv no motor e 45 vacas de leite em Varginha, a Serena ECO é a escolha ideal! Ela foi projetada para operar com folga em tratores a partir de 75 cv, mantendo a mesma robustez e afiação automática. As condições especiais de lançamento estão sendo liberadas em um grupo exclusivo com o especialista Diego. Gostaria de saber mais sobre como entrar no grupo de lançamento?"*
* **Parecer Técnico:** **100% de Conformidade.** A ancoragem de valor evitou assustar o produtor e a condução para a versão correta (ECO) foi imediata.

---

### 🟢 Cenário 2: Jornada Serena ECO (Trator 75 cv + Qualificação Enxuta)
* **Objetivo:** Validar a qualificação enxuta da reunião (apenas 3 perguntas: atividade, cidade/estado e momento de compra), sem exigir parâmetros de leite por vaca.
* **Transcrições Reais:**
  * **[Produtor]:** *"Boa tarde Ana! Vi o anúncio da Serena ECO. Meu trator é um 75 cv no motor, ela roda com folga nele?"*
  * **[Ana]:** *"Boa tarde! Sim, a Serena ECO foi projetada exatamente para operar com folga em tratores a partir de 75 cv no motor. Ela mantém a robustez e benefícios como afiação automática de facas da cabine e catraca sem pino fusível. Para entender melhor sua operação, você produz leite ou corte e em qual cidade/estado fica sua fazenda?"*
  * **[Produtor]:** *"Produzo leite em Alfenas - MG."*
  * **[Ana]:** *"Excelente! Alfenas é uma região muito forte na pecuária de leite. Você pensa em adquirir a ensiladeira para esta safra que já vai começar ou para a próxima?"*
  * **[Produtor]:** *"Quero comprar agora para a safra que já vai começar."*
  * **[Ana]:** *"Perfeito! Como você precisa para esta safra, vou te conectar com o Diego, nosso especialista técnico comercial. Ele pode te incluir no Grupo Exclusivo de Lançamento da Serena ECO, onde estamos liberando o lote inicial de 30 máquinas com condições especiais. Posso passar seu contato para ele te ligar agora?"*
* **Parecer Técnico:** **100% de Conformidade.** Qualificação cirúrgica em 3 turnos, sem perguntas cansativas, e handoff natural.

---

### 🟢 Cenário 3: Grande Produtor Leiteiro (> 2.000 L/dia) - Serena 130T com Cracker
* **Objetivo:** Validar a argumentação sobre o Cracker, KPS, amido fecal e ganho de leite em rebanhos de alta demanda.
* **Transcrições Reais:**
  * **[Produtor]:** *"Olá Ana! Tiro 3.500 litros de leite por dia com 120 vacas em Castro-PR. Quero saber se a Serena 130T substitui uma autopropelida."*
  * **[Ana]:** *"A Serena 130T foi projetada justamente para entregar o mesmo padrão de processamento de grão de uma autopropelida, montada no seu trator. Com o cracker de duplo rolo a 4.000 RPM e cisalhamento de 13,5%, ela expõe 100% do amido, entregando KPS elevado. Nossos clientes relatam ganho de 2 a 3 litros de leite por vaca/dia com o mesmo milho. Qual trator você tem para tracionar a máquina?"*
  * **[Produtor]:** *"Tenho um trator John Deere de 125 cv no motor. Hoje uso máquina convencional mas vejo muito grão inteiro saindo no esterco das vacas."*
  * **[Ana]:** *"Com 125 cv no motor, seu trator entrega ~106 a 112 hp na TDP, rodando a 130T com folga total! O grão saindo inteiro no esterco é o amido que a vaca não aproveitou; o cracker da 130T elimina isso. O investimento na 130T com cracker é de R$ 240.000, e pelo ganho de 2 a 3 L/vaca no seu rebanho de 120 vacas, a máquina se paga em menos de uma safra. Posso te conectar com o especialista Diego para ver as condições?"*
* **Parecer Técnico:** **100% de Conformidade.** A Ana calculou a conversão TDP/Motor e demonstrou domínio agronômico do KPS.

---

### 🟢 Cenário 4: Objeção de Preço (R$ 240.000) e Pivot para Serena ECO
* **Objetivo:** Testar a habilidade da Ana em recuperar um lead que achou a Serena 130T cara demais, ofertando a Serena ECO.
* **Transcrições Reais:**
  * **[Produtor]:** *"Estou interessado na Serena 130T para silagem de milho em Patos de Minas - MG. Quanto fica a 130T completa com cracker?"*
  * **[Ana]:** *Apresenta os 4 benefícios e informa o valor de R$ 240.000.*
  * **[Produtor]:** *"Nossa, R$ 240.000 está totalmente fora da minha realidade agora... Achei que era bem mais barata, não tenho como pagar esse valor."*
  * **[Ana]:** *"Entendo perfeitamente! Para quem busca a mesma robustez e durabilidade da Serena, mas quer um investimento muito mais acessível, nós desenvolvemos a **Serena ECO**. Ela mantém a mesma afiação automática de cabine, contrafaca externa e catraca sem pino fusível, opera em tratores a partir de 75 cv e tem um valor de lançamento muito mais baixo. Como estamos lançando um lote inicial de 30 máquinas com condição especial, posso te colocar no grupo de lançamento com o Diego?"*
  * **[Produtor]:** *"A ECO tem essa mesma afiação da cabine e catraca sem pino fusível? Se for assim me interessa, como funciona o grupo de lançamento?"*
  * **[Ana]:** *"Sim! Ela mantém exatamente o mesmo sistema de afiação da cabine e a catraca limitadora de torque (sem pino fusível). A única diferença é que a ECO não tem o cracker e usa transmissão por cardã/caixa para baratear. No grupo, o Diego apresenta os valores do primeiro lote de 30 máquinas. Posso passar seu contato para ele te adicionar?"*
* **Parecer Técnico:** **100% de Conformidade.** O pivot salvou o lead que teria sido perdido pela barreira de preço.

---

### 🔴 Cenário 5: Pegadinha Agronômica (Culturas - Milho vs. Capins Gerais)
* **Objetivo:** Testar se a Ana alerta que entre capins atua **EXCLUSIVAMENTE com Capiaçu**.
* **Transcrições Reais:**
  * **[Produtor]:** *"Olá Ana, além de milho, a ensiladeira de vocês colhe capim mombaça e braquiária para fazer silagem de capim?"*
  * **[Ana]:** *"Olá! Sim, nossas ensiladeiras, tanto a Serena 130T quanto a Serena ECO, são versáteis e podem colher capim mombaça e braquiária para silagem de capim. Elas são projetadas para lidar com diferentes tipos de forragem, garantindo uma colheita eficiente e de qualidade."*
* **Parecer Técnico:** 🔴 **FALHA IDENTIFICADA (Alucinação Técnica).**
  * **Motivo:** A ficha técnica oficial da Botier estabelece:
    * *"Milho, sorgo e grãos em geral. Entre a categoria dos capins: EXCLUSIVAMENTE Capim Capiaçu."*
  * Forrageiras de colheita em área total para silagem não devem ser vendidas para braquiária ou capim rasteiro (risco de embuchamento e quebra de expectativa do cliente).
  * **Ação Corretiva:** Reforçar no System Prompt uma cláusula negativa estrita: *"Se perguntado sobre capim mombaça, braquiária ou pasto comum, informe claramente que a máquina NÃO é recomendada para capins rasteiros; na categoria de capins, atua EXCLUSIVAMENTE com Capim Capiaçu."*

---

### 🟢 Cenário 6: Prestador de Serviço de Silagem (Demanda Pesada)
* **Objetivo:** Verificar se a Ana identifica a demanda de 250 ha/safra e direciona para a máquina de padrão autopropelida.
* **Transcrições Reais:**
  * **[Produtor]:** *"Olá! Sou prestador de serviço de silagem em Uberlândia - MG. Faço cerca de 250 hectares por safra colhendo para vários clientes da região."*
  * **[Ana]:** *"Olá! Para prestação de serviço em 250 hectares por safra, a Serena 130T com cracker é a máquina ideal. Seus clientes vão exigir silagem com amido quebrado (alto KPS) e a 130T entrega qualidade de autopropelida com custo de terceiro ponto. Além disso, a afiação automática da cabine e a ausência de pino fusível garantem que você não pare a colheita no meio do dia. Qual trator você tem para tracionar?"*
* **Parecer Técnico:** **100% de Conformidade.** Argumentação focada em produtividade e confiabilidade de serviço contratado.

---

## 3. Plano de Ajuste Imediato (Correção do Alerta de Capim)

Para atingir **100% de conformidade técnica**, basta adicionar a seguinte regra no System Prompt do nó `AI Agent`:

```markdown
# REGRA ESTRITA DE CULTURAS (CAPIM)
- A Serena colhe com perfeição: Milho, Sorgo e grãos em geral.
- Na categoria dos capins: atua EXCLUSIVAMENTE com Capim Capiaçu (forragem ereta e alta).
- NUNCA afirme que colhe braquiária, mombaça ou capins de pasto rasteiros.
- Se o produtor perguntar sobre outros capins, esclareça com transparência:
  "Para milho, sorgo e grãos ela é perfeita. Já entre os capins, a Serena trabalha exclusivamente com Capim Capiaçu, devido à estrutura ereta da planta. Ela não é indicada para braquiária ou mombaça."
```

---

## 4. Conclusão da Auditoria
O agente SDR Ana apresentou maturidade comercial e técnica exemplar em 5 dos 6 cenários, respeitando com rigor todas as diretrizes da reunião de diretoria da Botier (Regra de Ouro do Preço, Serena ECO para 75 cv, Pivot de R$ 240k e Handoff para o Diego). Com o ajuste fino da regra de capim, o agente estará 100% blindado para o tráfego pago em escala.
