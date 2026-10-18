---
name: cronicas-balanceamento
description: Tabelas de progressão de ouro, custos de vida por estamento social, curvas de desgaste vital/envelhecimento e regras de balanceamento para eventos e ofícios em Crônicas de Cinza e Ferro.
---
# Diretrizes de Balanceamento: Crônicas de Cinza e Ferro

Este documento estabelece as tabelas de referência matemática e mecânica para garantir que o jogo mantenha seu teor de sobrevivência histórica e desafio sem gerar "fábricas de ouro infinito" ou quebra de estamentos.

## 1. Curva de Retornos Decrescentes em Atributos (Diminishing Returns)
O teto de qualquer atributo (`forca`, `destreza`, `saude`, `intelecto`, `carisma`, `beleza`, `fe`, `sorte`) é rigorosamente **100**.
- **Abaixo de 35:** Ganhos fáceis (+2 a +3 por atividade bem-sucedida).
- **Entre 35 e 54:** Ganhos regulares (+1 a +2; 70% de chance).
- **Entre 55 e 74:** Ganhos moderados (+1; 40% de chance).
- **Entre 75 e 89:** Treinamento árduo (+1; 18% de chance de foco).
- **90 ou mais:** Nível lendário (+1; apenas 6% de chance).
- **Fadiga Anual:** Repetir a mesma atividade no mesmo ciclo anual aplica penalidade crescente de sucesso e fadiga de vigor.

## 2. Custos de Sustento Infantil Anual por Estamento (`minorChildrenCount`)
Cada filho menor de 16 anos vivo e não-abandonado gera custos na virada anual:
- **Plebeu:** 4 Ouro/ano por filho.
- **Classe Média (Burguês / Patrício):** 15 Ouro/ano por filho.
- **Nobreza:** 45 Ouro/ano por filho.

## 3. Desgaste Vital e Curva de Envelhecimento
- **Infância (0–5 anos) e Juventude (6–15 anos):** Sem penalidades de idade.
- **Adulto (16–37 anos):** Pleno vigor.
- **Meia-Idade (38–47 anos):** 30% de chance anual de declínio (-1 em Força, Destreza ou Beleza).
- **Maturidade Avançada (48–59 anos):** 45% de chance anual de declínio (-1).
- **Idade Madura / Velhice (60–71 anos):** 65% de chance de declínio (-1 a -2 em Força, Destreza, Saúde ou Beleza).
- **Senilidade (72+ anos):** 85% de chance anual de declínio severo (-2 a -3).

## 4. Faixas de Fortuna e Estamentos (`STATE.socialClass`)
Calculado anualmente com base no Patrimônio Líquido (`STATE.gold + valorDosBens - STATE.debt`):
- **Miserável:** < 60 Ouro (mendicância e alta vulnerabilidade).
- **Plebeu:** 60 a 349 Ouro (subsistência e pequenos ofícios).
- **Burguês:** 350 a 1.199 Ouro (oficinas e pequenos comércios).
- **Patrício:** 1.200 a 2.999 Ouro (grandes mercadores e armadores).
- **Nobreza:** >= 3.000 Ouro + posse de bens territoriais autênticos (solares, terras, castelos ou naus armadas).

## 5. Recompensas e Penalidades em Eventos Narrativos
- **Ouro em Eventos Comuns:** Variação típica de ±5 a ±35 Ouro. Eventos lendários ou provações podem chegar a ±80~150 Ouro.
- **Honra e Reputação:** Nunca conceder mais de +8 de Honra ou +2 de Reputação em um único evento comum. Falhas graves, quebra de votos de castidade ou traições devem penalizar severamente (-10 a -25 Honra, -1 a -3 Reputação).
