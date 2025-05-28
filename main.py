import pygame
import random
import sys

# Inicializar o pygame
pygame.init()

# Definir as dimensões da tela
LARGURA = 400
ALTURA = 600
TELA = pygame.display.set_mode((LARGURA, ALTURA))
pygame.display.set_caption('Flappy Bird Clone')

# Definir as cores
BRANCO = (255, 255, 255)
AZUL = (135, 206, 250)
VERDE = (0, 200, 0)

# Configurações do pássaro
p_x = 50
p_y = 300
p_largura = 30
p_altura = 30
gravidade = 0.5
velocidade = 0

# Configurações do cano
cano_largura = 70
cano_espaco = 200
velocidade_cano = 3

# Gerar primeiro cano
cano_x = LARGURA
cano_altura = random.randint(100, 400)

# Fonte
fonte = pygame.font.SysFont('Arial', 32)

# Pontuação
pontos = 0

# Loop principal
clock = pygame.time.Clock()

while True:
    clock.tick(60)  # 60 FPS

    # Eventos
    for evento in pygame.event.get():
        if evento.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        if evento.type == pygame.KEYDOWN:
            if evento.key == pygame.K_SPACE:
                velocidade = -8  # pulo

    # Física do pássaro
    velocidade += gravidade
    p_y += velocidade

    # Movimento do cano
    cano_x -= velocidade_cano

    # Verificar se o cano saiu da tela
    if cano_x < -cano_largura:
        cano_x = LARGURA
        cano_altura = random.randint(100, 400)
        pontos += 1

    # Colisão
    if (
        p_y <= 0 or p_y + p_altura >= ALTURA or
        (p_x + p_largura > cano_x and p_x < cano_x + cano_largura and
         (p_y < cano_altura or p_y + p_altura > cano_altura + cano_espaco))
    ):
        pygame.quit()
        sys.exit()

    # Desenhar elementos
    TELA.fill(AZUL)  # Fundo

    # Pássaro
    pygame.draw.rect(TELA, BRANCO, (p_x, p_y, p_largura, p_altura))

    # Cano superior
    pygame.draw.rect(TELA, VERDE, (cano_x, 0, cano_largura, cano_altura))

    # Cano inferior
    pygame.draw.rect(TELA, VERDE, (cano_x, cano_altura + cano_espaco, cano_largura, ALTURA))

    # Pontuação
    texto = fonte.render(f"Pontos: {pontos}", True, BRANCO)
    TELA.blit(texto, (10, 10))

    pygame.display.update()
    