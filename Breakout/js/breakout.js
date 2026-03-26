/*
 * Breakout Carlo — breakout.js
 *
 * Controles:
 *   Flecha ← / A  →  mover paleta izquierda
 *   Flecha → / D  →  mover paleta derecha
 *   ESPACIO       →  lanzar la pelota
 *   P             →  pausar / reanudar
 */

"use strict";

const canvasWidth  = 800;
const canvasHeight = 600;
const BLOCK_COLS = 10;   
const BLOCK_ROWS = 5;    

const BLOCK_W        = 64;
const BLOCK_H        = 22;
const BLOCK_PAD_X    = 8;
const BLOCK_PAD_Y    = 6;
const BLOCK_OFFSET_X = 16;
const BLOCK_OFFSET_Y = 55;

//  Velocidades 
const PADDLE_SPEED    = 0.55;
const BALL_SPEED_INIT = 0.38;
const BALL_SPEED_MAX  = 0.80;
const SPEED_UP_EVERY  = 5;
const LIVES_MAX       = 3;

const BACKGROUND_SRC = '../assets/sprites/fondo.png';
const BLOCK_SRCS = ['../assets/sprites/dog.png', '../assets/sprites/dog.png', '../assets/sprites/dog.png', '../assets/sprites/dog.png', '../assets/sprites/dog.png'];
const AUDIO_SRC = '../assets/audio/bombo.wav';

//  Colores de respaldo cuando no hay imagen 
const BLOCK_COLORS = ['#ff6bdc', '#ff9f43', '#ffd166', '#00e5c8', '#9b72cf'];
const BLOCK_POINTS = [50, 40, 30, 20, 10];

let ctx;
let game;
let oldTime = 0;

// Precarga del fondo
let bgImage = null;
if (BACKGROUND_SRC) {
    bgImage     = new Image();
    bgImage.src = BACKGROUND_SRC;
}
function rectOverlap(a, b) {
    return (
        Math.abs(a.position.x - b.position.x) < (a.halfSize.x + b.halfSize.x) &&
        Math.abs(a.position.y - b.position.y) < (a.halfSize.y + b.halfSize.y)
    );
}

//  Ball
class Ball extends GameObject {
    constructor(position) {
        super(position, 14, 14, 'red', 'ball');
        this.velocity = new Vector(0, 0);
        this.speed    = BALL_SPEED_INIT;
    }

    update(deltaTime) {
        this.velocity = this.velocity.normalize().times(this.speed);
        this.position = this.position.plus(this.velocity.times(deltaTime));
    }

    reset() {
        this.position = new Vector(canvasWidth / 2, canvasHeight - 120);
        this.velocity = new Vector(0, 0);
        this.speed    = BALL_SPEED_INIT;
    }

    serve() {
        const angle = (Math.random() * Math.PI / 3) - (Math.PI / 6);
        this.velocity.x = Math.cos(angle) * (Math.random() > 0.5 ? 1 : -1);
        this.velocity.y = -Math.abs(Math.sin(Math.PI / 2 - angle)) - 0.5;
    }
}


//  Paddle
class Paddle extends GameObject {
    constructor(position) {
        super(position, 110, 14, '#00e5c8', 'paddle');
        this.velocity = new Vector(0, 0);
        this.keys     = [];
    }

    update(deltaTime) {
        this.velocity.x = 0;
        if (this.keys.includes('left'))  this.velocity.x = -1;
        if (this.keys.includes('right')) this.velocity.x =  1;

        this.velocity = this.velocity.normalize().times(PADDLE_SPEED);
        this.position = this.position.plus(this.velocity.times(deltaTime));

        if (this.position.x - this.halfSize.x < 0)
            this.position.x = this.halfSize.x;
        if (this.position.x + this.halfSize.x > canvasWidth)
            this.position.x = canvasWidth - this.halfSize.x;
    }
}

//  Block
class Block extends GameObject {
    constructor(position, row) {
        super(position, BLOCK_W, BLOCK_H, BLOCK_COLORS[row % BLOCK_COLORS.length], 'block');
        this.points    = BLOCK_POINTS[row % BLOCK_POINTS.length];
        this.destroyed = false;

        const src = BLOCK_SRCS[row % BLOCK_SRCS.length];
        if (src) this.setSprite(src);
    }
}

//  Game
class Game {
    constructor() {
        this.lives           = LIVES_MAX;
        this.score           = 0;
        this.blocksDestroyed = 0;
        this.totalBlocks     = BLOCK_COLS * BLOCK_ROWS;
        this.level           = 1;
        this.paused          = false;
        this.state           = 'title';
        this._overlay        = null;
        this._overlayBtn     = null;

        // Audio
        this.ping = new Audio(AUDIO_SRC);

        // Objetos del juego
        this.paddle = new Paddle(new Vector(canvasWidth / 2, canvasHeight - 40));
        this.ball   = new Ball(new Vector(canvasWidth / 2, canvasHeight - 120));
        this.blocks = this.buildBlocks();

        this.createEventListeners();

        this.showOverlay('B R E A K O U T',
            ['Flechas  ←  →  (o A / D)  para mover',
             'ESPACIO para lanzar la pelota',
             'P para pausar'],
            'INICIAR');
    }

    //  Construir bloques
    buildBlocks() {
        const list = [];
        for (let row = 0; row < BLOCK_ROWS; row++) {
            for (let col = 0; col < BLOCK_COLS; col++) {
                const cx = BLOCK_OFFSET_X + col * (BLOCK_W + BLOCK_PAD_X) + BLOCK_W / 2;
                const cy = BLOCK_OFFSET_Y + row * (BLOCK_H + BLOCK_PAD_Y) + BLOCK_H / 2;
                list.push(new Block(new Vector(cx, cy), row));
            }
        }
        return list;
    }

    //  Update 
    update(deltaTime) {
        if (this.paused || this.state !== 'playing') return;
        this.paddle.update(deltaTime);
        this.ball.update(deltaTime);
        this.checkWalls();
        this.checkPaddle();
        this.checkBlocks();
        this.checkBottom();
    }

    checkWalls() {
        const b = this.ball;
        if (b.position.x - b.halfSize.x < 0) {
            b.position.x = b.halfSize.x;
            b.velocity.x = Math.abs(b.velocity.x);
            this.playSound();
        }
        if (b.position.x + b.halfSize.x > canvasWidth) {
            b.position.x = canvasWidth - b.halfSize.x;
            b.velocity.x = -Math.abs(b.velocity.x);
            this.playSound();
        }
        if (b.position.y - b.halfSize.y < 0) {
            b.position.y = b.halfSize.y;
            b.velocity.y = Math.abs(b.velocity.y);
            this.playSound();
        }
    }

    checkPaddle() {
        const b = this.ball, p = this.paddle;
        if (rectOverlap(b, p) && b.velocity.y > 0) {
            const hit   = (b.position.x - p.position.x) / p.halfSize.x;
            const angle = hit * (Math.PI / 3);
            b.velocity.x = Math.sin(angle);
            b.velocity.y = -Math.cos(angle);
            b.position.y = p.position.y - p.halfSize.y - b.halfSize.y - 1;
            this.playSound();
        }
    }

    checkBlocks() {
        const b = this.ball;
        for (const block of this.blocks) {
            if (block.destroyed || !rectOverlap(b, block)) continue;

            const ox = (b.halfSize.x + block.halfSize.x) - Math.abs(b.position.x - block.position.x);
            const oy = (b.halfSize.y + block.halfSize.y) - Math.abs(b.position.y - block.position.y);
            if (ox < oy) b.velocity.x *= -1;
            else         b.velocity.y *= -1;

            block.destroyed = true;
            this.blocksDestroyed++;
            this.score += block.points * this.level;
            this.playSound();

            if (this.blocksDestroyed % SPEED_UP_EVERY === 0)
                b.speed = Math.min(b.speed * 1.08, BALL_SPEED_MAX);

            if (this.blocksDestroyed >= this.totalBlocks) { this.winLevel(); return; }
            break;
        }
    }

    checkBottom() {
        if (this.ball.position.y - this.ball.halfSize.y > canvasHeight)
            this.loseLife();
    }

    //  Estados del juego 
    loseLife() {
        this.lives--;
        this.ball.reset();
        if (this.lives <= 0) {
            this.state = 'gameover';
            this.showOverlay('GAME OVER',
                [`Puntuación: ${this.score}`,
                 `Bloques destruidos: ${this.blocksDestroyed}`],
                'REINTENTAR', '#ff6bdc');
        } else {
            this.state = 'lost_life';
            this.showOverlay(`VIDAS: ${this.lives}`,
                ['Presiona ESPACIO para continuar'],
                'CONTINUAR');
        }
    }

    winLevel() {
        this.state = 'win';
        this.level++;
        this.showOverlay('¡ V I C T O R I A !',
            [`Puntuación: ${this.score}`, `Siguiente nivel: ${this.level}`],
            'CONTINUAR', '#ffd166');
    }

    nextLevel() {
        this.blocks          = this.buildBlocks();
        this.blocksDestroyed = 0;
        this.ball.reset();
        this.state           = 'playing';
    }

    restart() {
        this.lives           = LIVES_MAX;
        this.score           = 0;
        this.blocksDestroyed = 0;
        this.level           = 1;
        this.blocks          = this.buildBlocks();
        this.ball.reset();
        this.paddle.position = new Vector(canvasWidth / 2, canvasHeight - 40);
        this.state           = 'playing';
    }

    //  Audio 
    playSound() {
        try {
            this.ping.currentTime = 0;
            this.ping.play();
        } catch (_) {}
    }

    //  Draw 
    draw(ctx) {
        // Fondo
        if (bgImage && bgImage.complete && bgImage.naturalWidth > 0) {
            ctx.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);
        } else {
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }

        // Bloques, pelota, paleta
        for (const block of this.blocks)
            if (!block.destroyed) block.draw(ctx);

        this.ball.draw(ctx);
        this.paddle.draw(ctx);

        // HUD y overlay
        this.drawHUD(ctx);
        if (this._overlay) this.drawOverlay(ctx);
    }

    // HUD dibujado directo en el canvas (sin TextLabel)
    drawHUD(ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, canvasWidth, 36);

        ctx.font      = '16px monospace';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ff6bdc';
        ctx.fillText(`❤ ${this.lives} / ${LIVES_MAX}`, 12, 24);

        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(`PUNTOS: ${this.score}`, canvasWidth / 2, 24);

        ctx.fillStyle = '#ffd166';
        ctx.textAlign = 'right';
        ctx.fillText(`BLOQUES: ${this.blocksDestroyed}/${this.totalBlocks}  NVL ${this.level}`,
                     canvasWidth - 12, 24);

        ctx.textAlign = 'left';
    }

    //  Overlay 
    showOverlay(title, lines, btnText, color = '#00e5c8') {
        this._overlay    = { title, lines, btnText, color, btnHover: false };
        this._overlayBtn = null;
    }

    hideOverlay() {
        this._overlay    = null;
        this._overlayBtn = null;
    }

    drawOverlay(ctx) {
        const { title, lines, btnText, color } = this._overlay;

        // Fondo oscuro
        ctx.fillStyle = 'rgba(0,0,0,0.78)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Caja
        const bw = 440, bh = 200 + lines.length * 30;
        const bx = (canvasWidth  - bw) / 2;
        const by = (canvasHeight - bh) / 2;

        ctx.fillStyle   = 'rgba(10,10,30,0.96)';
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = color;
        ctx.lineWidth   = 2;
        ctx.strokeRect(bx, by, bw, bh);

        // Título
        ctx.font        = 'bold 32px monospace';
        ctx.fillStyle   = color;
        ctx.textAlign   = 'center';
        ctx.fillText(title, canvasWidth / 2, by + 62);

        // Líneas de texto
        ctx.font      = '15px monospace';
        ctx.fillStyle = 'white';
        for (let i = 0; i < lines.length; i++)
            ctx.fillText(lines[i], canvasWidth / 2, by + 105 + i * 30);

        // Botón
        const btnW = 210, btnH = 46;
        const btnX = (canvasWidth - btnW) / 2;
        const btnY = by + bh - 70;

        ctx.fillStyle = this._overlay.btnHover ? 'white' : color;
        ctx.fillRect(btnX, btnY, btnW, btnH);

        ctx.font      = 'bold 14px monospace';
        ctx.fillStyle = '#07070f';
        ctx.fillText(btnText, canvasWidth / 2, btnY + 30);

        ctx.textAlign    = 'left';
        this._overlayBtn = { x: btnX, y: btnY, w: btnW, h: btnH };
    }

    //  Event listeners 
    createEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') this.addKey('left');
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.addKey('right');

            if (e.code === 'Space') {
                e.preventDefault();
                if (this.state === 'playing')   this.ball.serve();
                if (this.state === 'lost_life') { this.hideOverlay(); this.state = 'playing'; }
            }

            if ((e.key === 'p' || e.key === 'P') && this.state === 'playing') {
                this.paused = !this.paused;
                if (this.paused) this.showOverlay('P A U S A', ['Presiona P para continuar'], 'REANUDAR');
                else             this.hideOverlay();
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') this.delKey('left');
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.delKey('right');
        });

        document.getElementById('canvas').addEventListener('click', (e) => {
            if (!this._overlayBtn) return;
            const rect = e.target.getBoundingClientRect();
            const mx = e.clientX - rect.left, my = e.clientY - rect.top;
            const b  = this._overlayBtn;
            if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h)
                this.onBtn();
        });

        document.getElementById('canvas').addEventListener('mousemove', (e) => {
            if (!this._overlay || !this._overlayBtn) return;
            const rect = e.target.getBoundingClientRect();
            const mx = e.clientX - rect.left, my = e.clientY - rect.top;
            const b  = this._overlayBtn;
            this._overlay.btnHover =
                mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h;
        });
    }

    onBtn() {
        if      (this.state === 'title' || this.state === 'lost_life')
            { this.hideOverlay(); this.state = 'playing'; }
        else if (this.state === 'gameover')
            { this.hideOverlay(); this.restart(); }
        else if (this.state === 'win')
            { this.hideOverlay(); this.nextLevel(); }
        else if (this.paused)
            { this.paused = false; this.hideOverlay(); }
    }

    addKey(dir) { if (!this.paddle.keys.includes(dir)) this.paddle.keys.push(dir); }
    delKey(dir) { const i = this.paddle.keys.indexOf(dir); if (i !== -1) this.paddle.keys.splice(i, 1); }
}

//  Loop principal
function drawScene(newTime) {
    const deltaTime = newTime - oldTime;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    game.update(deltaTime);
    game.draw(ctx);
    oldTime = newTime;
    requestAnimationFrame(drawScene);
}

function main() {
    const canvas  = document.getElementById('canvas');
    canvas.width  = canvasWidth;
    canvas.height = canvasHeight;
    ctx           = canvas.getContext('2d');
    game          = new Game();
    drawScene(0);
}

document.addEventListener('DOMContentLoaded', main);