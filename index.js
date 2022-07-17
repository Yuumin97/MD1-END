let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d')
canvas.width = innerWidth * 0.8;
canvas.height = innerHeight * 0.97;

//------- nhan vat --------------
class Player {
    constructor({x, y, radius, clor, velocity = {x: 0, y: 0}}) {
        this.x = x
        this.y = y
        this.radius = radius
        this.clor = clor
        this.velocity = velocity
        this.live = 3
        this.opacity = 1
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.globalAlpha= this.opacity
        c.fillStyle = this.clor
        c.fill();
    }

    update() {
        this.draw()

        this.x += this.velocity.x
        this.y += this.velocity.y
    }

}

//------------------------------------------
let isEnd = true

// ----- ham goi dan ban -------------------
class Projectile {
    constructor(x, y, radius, clor, veloctiry) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.clor = clor;
        this.veloctiry = veloctiry;

    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.clor;
        c.fill()
    }

    update() {
        this.draw();
        this.x = this.x + this.veloctiry.x;
        this.y = this.y + this.veloctiry.y;
    }
}

//----------------------------

//------- dan ban -------
class Enemy {
    constructor(x, y, radius, clor, veloctiry) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.clor = clor;
        this.veloctiry = veloctiry;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.clor;
        c.fill()
    }

    update() {
        this.draw();
        this.x = this.x + this.veloctiry.x;
        this.y = this.y + this.veloctiry.y;

    }
}

// -----------------------
let x = canvas.width / 2;
let y = canvas.height / 2;
let player = new Player({
    x: x,
    y: y,
    radius: 10,
    clor: 'white',
});
let projectiles = [];
let enemies = []

// ------------ bong " vat can" ---------------
function spawnEnemy() {
    setInterval(() => {
        let radius = Math.random() * (30 - 4) + 4
        let x
        let y
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        let color = `hsl(${Math.random() * 360},50%,50%)`
        let angle = Math.atan2(canvas.height / 2 - y,
            canvas.width / 2 - x)
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 400)
}

//---------------------------------------------
// ----di chuyen ban phim ---------------
let keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    }, s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}
window.addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'w':
            keys.w.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break
        case 's':
            keys.s.pressed = true
            break
        case 'd':
            console.log('s', 'd')
            keys.d.pressed = true
            break
    }
})

window.addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})
// ------------------


let animationId
let score = 0
let scoreArr = [];

//---- check va cham va vong lap ------------------
function animate() {
    animationId = requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0,0,0,0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update();

    projectiles.forEach((projectile, index) => {
        projectile.update()
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        }
    })
    let live = 'Live: '
    for (let i = 0; i < player.live; i++) {
        live += '* '
    }
    document.getElementById('livePlayer').innerHTML = live;
    console.log(document.getElementById('livePlayer').innerHTML)
    enemies.forEach((enemy, index) => {
        enemy.update()
        let dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if (dist - enemy.radius - player.radius < 1) {
            console.log(player.live)

            if (player.live > 0) {
                player.live--;
                starGame()
            } else {
                let audio1 = new Audio('endgame.mp3')
                audio1.play()
                isEnd = true
                scoreArr.push(score)
                scoreArr.sort(function (a, b) {
                    return b - a
                })
                if (player.live == 0) {
                    document.getElementById('scoreI').innerHTML = score
                    document.getElementById('scoreId').innerHTML = '0'
                    // score = 0
                    enemies = []
                    player.live = 3
                }
                console.log(scoreArr)
                document.getElementById('top1').innerHTML = "Top 1 " + scoreArr[0]
                document.getElementById('top2').innerHTML = "Top 2 " + scoreArr[1]
                document.getElementById('top3').innerHTML = "Top 3 " + scoreArr[2]
                document.getElementById('top4').innerHTML = "Top 4 " + scoreArr[3]
                document.getElementById('top5').innerHTML = "Top 5 " + scoreArr[4]
                document.getElementById('clickAn').style.display = 'flex'
                document.getElementById('endGameDiv').style.display = 'flex'
                cancelAnimationFrame(animationId)
            }
            //// ------ tí cho thêm cái hiệu ứng nhấp nháy nuawxlaf đc
        }
        // ----- check score và check va cham dan vs enemy-----
        projectiles.forEach((projectile, projectileIndex) => {
            let dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            if (dist - enemy.radius - projectile.radius < 1) {
                if (enemy.radius - 10 > 5) {
                    score += 100;
                    scoreId.innerHTML = score
                    scoreI.innerHTML = score
                    enemy.radius -= 10
                    setTimeout(() => {
                        let audio2 = new Audio('boom1.mp3')
                        audio2.play()
                        projectiles.splice(projectileIndex, 1)

                    }, 0)
                } else {
                    score += 250
                    scoreId.innerHTML = score
                    scoreI.innerHTML = score
                    setTimeout(() => {
                        enemies.splice(index, 1)
                        let audio3 = new Audio('boom2.mp3')
                        audio3.play()
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                }
            }
        })
    })
//------ check di chuyen

    player.velocity.x = 0
    player.velocity.y = 0


    if (keys.w.pressed) {
        player.velocity.y = -5
    }
    if (keys.a.pressed) {
        player.velocity.x = -5
    }
    if (keys.s.pressed) {
        player.velocity.y = 5
    }
    if (keys.d.pressed) {
        player.velocity.x = 5
    }


    if (player.x + player.velocity.x * 2 < player.radius || player.y + player.velocity.y * 2 < player.radius || player.x + player.velocity.x * 2 > canvas.width || player.y + player.velocity.y * 2 > canvas.height) {

        player.velocity.x = 0
        player.velocity.y = 0
    }


}

//---------------------------------


// event click-------------

addEventListener('click', (event) => {
    console.log(isEnd)
    if (event.srcElement.type === 'button') {
        event.srcElement.blur()
    }
    if (event.clientX > canvas.width || event.clientY > canvas.height) {
        return
    }
    let angle = Math.atan2(event.clientY - player.y,
        event.clientX - player.x)

    const velocity = {
        x: Math.cos(angle) * 6,
        y: Math.sin(angle) * 6
    }
    projectiles.push(
        new Projectile(player.x, player.y, 5, 'white', velocity)
    )
    if (isEnd) return;
    let audio = new Audio('shutgun.mp3');
    audio.play()
    console.log(audio)
})
//-----------------------------
//---- khoi tao nut button va start game
function starGame() {

    cancelAnimationFrame(animationId)
    document.getElementById('endGameDiv').style.display = 'none'
    document.getElementById('clickAn').style.display = 'none'
    console.log(enemies)
    player.x = x
    player.y = y
    isEnd = false
    document.getElementById('myImage').style.display = 'none'
    document.getElementById('livePlayer').style.display = 'block'
    animate();

}




spawnEnemy();
