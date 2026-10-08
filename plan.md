# Rattenna Tecnologia — plano de implementação

## Produto
Site institucional imersivo e gamificado para **Rattenna Tecnologia**, com assinatura **Engenheira e Arquiteta Rafaela Abreu**. A imagem fornecida de nuvens cósmicas hiper-realistas é a matéria-prima visual do site: ela vira uma cena viva, com movimento, profundidade e camadas de luz — não um vídeo hospedado.

## Direção de design
- **Design Movement:** sci-fi editorial / cinematic interface, misturando uma paisagem cósmica hiper-realista com uma camada de instrumentação técnica minimalista.
- **Core Principles:** (1) a imagem é o ambiente, não um banner; (2) transparência cria profundidade; (3) movimento responde ao visitante; (4) tecnologia aparece como precisão, não como ruído visual.
- **Color Philosophy:** carvão quase preto e azul profundo dão gravidade; ciano elétrico sinaliza tecnologia; magenta, coral e dourado capturam os veios luminosos da imagem e tornam a marca própria.
- **Layout Paradigm:** composição cinematográfica assimétrica, com headline ancorada no canto inferior esquerdo, painéis flutuantes e nave livre sobre a cena. Evitar grids centrais e blocos convencionais.
- **Signature Elements:** molduras quadradas translúcidas com cantos técnicos; fio de luz vertical que atravessa o hero; nave cromada com halo e rastro energético.
- **Interaction Philosophy:** o site reage ao toque como um objeto vivo. O ponteiro inclina a paisagem e arrastar a nave vira a brincadeira principal. Sem botão de jogar: a ação é descoberta pelo gesto.
- **Animation:** zoom respirado da imagem; deslocamento de camadas por parallax; linhas e painéis com brilho pulsante lento; cards entram com blur; nave deixa rastro e emite uma nota contínua durante o arrasto. Sem partículas em forma de estrela.
- **Typography System:** Space Grotesk para textos utilitários e títulos, com IBM Plex Mono para metadados e microcopy técnica. Títulos em caixa alta com tracking amplo; corpo curto e legível.
- **Brand Essence:** tecnologia que transforma complexidade em movimento claro para negócios e sistemas. Personalidade: precisa, visionária, humana.
- **Brand Voice:** direta, sofisticada e provocadora. Exemplos: “Tecnologia que sai do plano e entra em movimento.” / “Arraste a nave. Explore o próximo sistema.”
- **Wordmark & Logo:** wordmark Rattenna em Space Grotesk com um “R” recortado por uma linha orbital vertical; implementado como marca textual estilizada e monograma no favicon.
- **Signature Brand Color:** **Rattenna Cyan** `#65f3ee`, usado como pulso de interface e contraste sobre o carvão.

## Experiência e conteúdo
1. Hero em tela cheia com a imagem fornecida como fundo vivo, título “Rattenna Tecnologia”, assinatura de Rafaela e instrução para arrastar a nave.
2. Painel de proposta: automação, correção de bugs, programação e gestão de anúncios/publicidade.
3. Seção de serviços com cartões transparentes e microinterações.
4. Bloco de contato com telefone `61 99443-1648` e e-mail `Rattenna@gmail.com`.
5. Nave livre arrastável com mouse e toque, sem botão dedicado, com áudio sintetizado pelo Web Audio API ao ser pega.

## Estrutura
- `index.html`: shell semântico, navegação, cena, painéis, serviços e contato.
- `styles.css`: sistema visual, camadas da cena, responsividade, estados de interação e animações.
- `app.js`: parallax por ponteiro, arrasto com Pointer Events, rastro da nave, áudio sintetizado e navegação suave.
- `server.mjs`: servidor HTTP local sem dependências para Preview na porta 3000.
- `build.mjs`: cópia determinística dos arquivos para `dist/`.
- `public/manus-routes.json`: manifesto de rota da home.
- `public/IMG-20261008-WA0003_acd0fdab.jpg`: imagem fornecida, armazenada via WebDev Storage.

## Serving
A aplicação é uma SPA estática servida por `server.mjs` em `0.0.0.0:3000`. O build de publicação copia o site para `dist/`, cujo `index.html` é a entrada estática. Não há backend nem banco necessários para a primeira versão.
