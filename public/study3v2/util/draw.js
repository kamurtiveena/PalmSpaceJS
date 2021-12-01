
function drawFillCircle(ctx, centerX, centerY, radius, color, alpha) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#666666";
    ctx.stroke();
}


function drawFillRect(ctx, topleftX, topleftY, width, height, color, alpha) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(topleftX, topleftY, width, height);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#666666";
    ctx.stroke();
}


function drawStrokeRect(ctx, topleftX, topleftY, width, height, color, alpha) {
    ctx.globalAlpha = alpha;
    // ctx.fillStyle = color;
    ctx.strokeRect(topleftX, topleftY, width, height);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#666666";
    ctx.stroke();
}

function drawFillShape(ctx, points, color, alpha) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i ++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#666666";
    ctx.stroke();
}



export {drawFillCircle, drawFillRect, drawFillShape, drawStrokeRect};