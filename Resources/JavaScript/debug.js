function collisionDebug(el) {
    ctx.fillStyle = "rgb(0,255,0)";
    if (el.collision) {
        ctx.fillRect(
            el.x,
            el.y,
            el.w,
            el.h
        );
    }
}
