# SFL Companion 🌻

Painel pessoal, leve e responsivo para acompanhar progresso e tomar decisões no **Sunflower Land** sem precisar cruzar várias tabelas.

## O que já existe na V1

- **Flores:** checklist persistente, progresso por coleção, agrupamento por semente, level mínimo e destaque da família sazonal.
- **Pesca:** checklist, filtro por estação, tipo, isca, chum e prioridade para o que ainda falta pegar agora.
- **Crafting:** ferramentas e collectibles importantes com custos, ingredientes, estoque e checklist.
- **Cozinha:** calculadora de preço de ingredientes em SFL, custo por receita, XP/SFL, XP/dia, filtros e modificadores para simular boosts.
- **Entregas:** mapa dos NPCs por tipo de recompensa e calculadora de custo/lucro para pedidos de FLOWER/SFL.
- **Tema claro/escuro**, layout responsivo e dados salvos em `localStorage`.
- Animações leves com **GSAP**, **Motion** e background WebGL opcional com **Three.js**.

## Fontes de dados

A mecânica principal foi conferida no repositório público oficial do Sunflower Land (`sunflower-land/sunflower-land`). Os links do SFL.World continuam disponíveis como referência rápida dentro do painel.

Os preços P2P não ficam hardcoded porque variam continuamente: o usuário cadastra o preço atual em SFL e o navegador salva localmente.

### Observação sobre deliveries

O frontend público atual do jogo informa quais NPCs são de Coins, FLOWER/SFL ou tickets, níveis e multiplicadores, mas os **pedidos exatos são gerados pelo backend**. Por isso a V1 evita inventar uma lista fixa potencialmente desatualizada e oferece uma calculadora para o pedido que apareceu no jogo.

## Publicar no GitHub Pages

O repositório já contém `.github/workflows/deploy-pages.yml`.

No GitHub, faça uma única configuração:

1. **Settings → Pages**
2. Em **Build and deployment → Source**, escolha **GitHub Actions**
3. O workflow de Pages fará o deploy automaticamente a cada push em `main`.

## Estrutura

```text
index.html      interface e módulos
styles.css      design system responsivo
app.js          estado, filtros, cálculos e animações
data.js         dataset da V1
.nojekyll       site estático sem processamento Jekyll
.github/workflows/deploy-pages.yml
```

## Próximas evoluções possíveis

- Importar automaticamente inventário/progresso por Farm ID, caso exista endpoint público estável e permitido.
- Sincronizar preços P2P automaticamente com uma fonte confiável.
- Expandir crafting para todo o catálogo do jogo.
- Adicionar árvores de habilidades, expansões e planejamento Level → Desert/Volcano.
- Transformar em PWA instalável.

> Projeto independente, não oficial e sem vínculo com a equipe do Sunflower Land ou com o SFL.World.
