const paper = document.getElementById("paper") as HTMLCanvasElement
const ctx = paper.getContext("2d")
ctx.fillStyle = "blue"
ctx.fillRect(20, 20, 10, 10)
ctx.stroke()
