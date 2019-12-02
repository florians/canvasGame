function collisionDebug(el) {
    ctx.fillStyle = "rgb(0,255,0)";
    // left
    if (el.offsetLeft && !el.offsetRight && !el.offsetTop && !el.offsetBottom) {
        ctx.fillRect(
            el.x + el.offsetLeft,
            el.y,
            el.w - el.offsetLeft,
            el.h
        );
    }
    // right
    if (!el.offsetLeft && el.offsetRight && !el.offsetTop && !el.offsetBottom) {
        ctx.fillRect(
            el.x,
            el.y,
            el.w - el.offsetRight,
            el.h
        );
    }
    // top
    if (!el.offsetLeft && !el.offsetRight && el.offsetTop && !el.offsetBottom) {
        ctx.fillRect(
            el.x,
            el.y + el.offsetTop,
            el.w,
            el.h - el.offsetTop
        );
    }
    // bottom
    if (!el.offsetLeft && !el.offsetRight && !el.offsetTop && el.offsetBottom) {
        ctx.fillRect(
            el.x,
            el.y,
            el.w,
            el.h - el.offsetBottom
        );
    }

    // 2 sides

    // lr
    if (el.offsetLeft && el.offsetRight && !el.offsetTop && !el.offsetBottom) {
        ctx.fillRect(
            el.x + el.offsetLeft,
            el.y,
            el.w - el.offsetRight - el.offsetLeft,
            el.h
        );
    }
    // lt
    if (el.offsetLeft && !el.offsetRight && el.offsetTop && !el.offsetBottom) {
        ctx.fillRect(
            el.x + el.offsetLeft,
            el.y + el.offsetTop,
            el.w - el.offsetLeft,
            el.h - el.offsetTop
        );
    }
    // lb
    if (el.offsetLeft && !el.offsetRight && !el.offsetTop && el.offsetBottom) {
        ctx.fillRect(
            el.x + el.offsetLeft,
            el.y,
            el.w - el.offsetLeft,
            el.h - el.offsetBottom
        );
    }
    // rt
    if (!el.offsetLeft && el.offsetRight && el.offsetTop && !el.offsetBottom) {
        ctx.fillRect(
            el.x,
            el.y + el.offsetTop,
            el.w - el.offsetRight,
            el.h - el.offsetTop
        );
    }
    // rb
    if (!el.offsetLeft && el.offsetRight && !el.offsetTop && el.offsetBottom) {
        ctx.fillRect(
            el.x,
            el.y,
            el.w - el.offsetRight,
            el.h - el.offsetBottom
        );
    }
    // tb
    if (!el.offsetLeft && !el.offsetRight && el.offsetTop && el.offsetBottom) {
        ctx.fillRect(
            el.x,
            el.y + el.offsetTop,
            el.w,
            el.h - el.offsetBottom - el.offsetTop
        );
    }

    // 3 sides
    //  lrt
    if (el.offsetLeft && el.offsetRight && el.offsetTop && !el.offsetBottom) {
        ctx.fillRect(
            el.x + el.offsetLeft,
            el.y + el.offsetTop,
            el.w - el.offsetRight - el.offsetLeft,
            el.h - el.offsetTop
        );
    }
    //  lrb
    if (el.offsetLeft && el.offsetRight && !el.offsetTop && el.offsetBottom) {
        ctx.fillRect(
            el.x + el.offsetLeft,
            el.y,
            el.w - el.offsetRight - el.offsetLeft,
            el.h - el.offsetBottom
        );
    }

    // 4 sides
    if (el.offsetLeft && el.offsetRight && el.offsetTop && el.offsetBottom) {
        ctx.fillRect(
            el.x + el.offsetLeft,
            el.y + el.offsetTop,
            el.w - el.offsetRight - el.offsetLeft,
            el.h - el.offsetBottom - el.offsetTop
        );
    }
}
