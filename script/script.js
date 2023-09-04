const canvas = document.querySelector("canvas");
const cts = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const audio = new Audio('../assets/assets_audio.mp3')

const size = 30;

const initialPosition = { x: 270, y: 240 }

let snake = [initialPosition];

const incrementScore = () => {
    score.innerHTML = +score.innerText + 10
}

const randowNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + 5)
}

const randowPosition = () => {
    const number = randowNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30;
}

const randowColor = () => {
    const red = randowNumber(0, 255)
    const green = randowNumber(0, 255)
    const blue = randowNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`

} 


const food = {
    x: randowPosition(),
    y: randowPosition(),
    color: randowColor()
}

let direction, loopId

const drawFood = () => {

    const { x, y, color } = food

    cts.shadowColor = color
    cts.shadowBlur = 10
    cts.fillStyle = color
    cts.fillRect(food.x, food.y, size, size )
    cts.shadowBlur = 0
}

const drawsnake = () => {
    cts.fillStyle = "#ddd";

    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            cts.fillStyle = "red"
        }
        cts.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () => {
    if (!direction) { return}

    const head = snake[snake.length - 1]

    if (direction == "right") {
        snake.push({x: head.x + size, y: head.y})
    }

    if (direction == "left") {
        snake.push({x: head.x - size, y: head.y })
    }

    if (direction == "down") {
        snake.push({x: head.x, y: head.y + size })
    }

    if (direction == "up") {
        snake.push({x: head.x, y: head.y - size })
    }

    snake.shift()

}

const drawGrid = () => {
    cts.lineWidth = 1
    cts.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i += 30) {
        cts.beginPath()
        cts.lineTo(i, 0)
        cts.lineTo(i, 600)
        cts.stroke()

        cts.beginPath()
        cts.lineTo(0, i)
        cts.lineTo(600, i)
        cts.stroke()
    }
    

}

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) { 
        incrementScore()
        snake.push(head);
        audio.play()

        let x = randowPosition()
        let y = randowPosition()

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randowPosition()
            y = randowPosition()
        }

        food.x = x
        food.y = y
        food.color = randowColor()
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const nekIndex = snake.length - 2

    const wallCollision = 
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < nekIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollision) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(2px)"
}


const gameLoop = () => {
    clearInterval(loopId)

    cts.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawsnake()
    checkEat()
    checkCollision()
 
    loopId = setTimeout(() => {
        gameLoop()
    }, 300)
}

gameLoop()


document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direction !== "left") {
        direction = "right"
    }

    if (key == "ArrowLeft" && direction !== "right") {
        direction = "left"
    }

    if (key == "ArrowDown" && direction !== "up") {
        direction = "down"
    }

    if (key == "ArrowUp" && direction !== "down") {
        direction = "up"
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]

})