import Matter from "matter-js";

const setCameraView = (render, world, body) => {

    let boundsScaleTarget = 1;
    let boundsScale = {
        x: 1,
        y: 1
    };

    // smoothly tween scale factor
    let scaleFactor = (boundsScaleTarget - boundsScale.x) * 0.2;
    boundsScale.x += scaleFactor;
    boundsScale.y += scaleFactor;

    // scale the render bounds
    render.bounds.max.x = render.bounds.min.x + render.options.width * boundsScale.x;
    render.bounds.max.y = render.bounds.min.y + render.options.height * boundsScale.y;

    // translate so zoom is from centre of view
    let translate = {
        x: render.options.width * scaleFactor * -0.5,
        y: render.options.height * scaleFactor * -0.5
    };

    Matter.Bounds.translate(render.bounds, translate);

    let deltaCentre = Matter.Vector.sub(body.position, {
        x: render.bounds.min.x + 400,
        y: render.bounds.min.y + 300
    });
    let centreDist = Matter.Vector.magnitude(deltaCentre);

    if (centreDist > 50 || centreDist < -50) {
        // create a vector to translate the view, allowing the user to control view speed
        var direction = Matter.Vector.normalise(deltaCentre),
            speed = Math.min(10, Math.pow(centreDist - 50, 2) * 0.0002);

        translate = Matter.Vector.mult(direction, speed);

        // prevent the view moving outside the world bounds
        if (render.bounds.min.x + translate.x < world.bounds.min.x)
            translate.x = world.bounds.min.x - render.bounds.min.x;

        if (render.bounds.max.x + translate.x > world.bounds.max.x)
            translate.x = world.bounds.max.x - render.bounds.max.x;

        if (render.bounds.min.y + translate.y < world.bounds.min.y)
            translate.y = world.bounds.min.y - render.bounds.min.y;

        if (render.bounds.max.y + translate.y > world.bounds.max.y)
            translate.y = world.bounds.max.y - render.bounds.max.y;

        // move the view
        Matter.Bounds.translate(render.bounds, translate);

    }
};

export default {
    setCameraView
}
