import Matter from 'matter-js';
import $ from 'jquery';
import svg from './../assets/svg/drawing.svg'
var terrain;

const init = (world) => {
    terrain = Matter.Bodies.rectangle(400, 200, 300, 5);
    
    $.get(svg).done(function(data) {
    var vertexSets = [];
    
    $(data).find('path').each(function(i, path) {
        console.log(path);
        vertexSets.push(Matter.Svg.pathToVertices(path, 30));
    });
    
    terrain = Matter.Bodies.fromVertices(400, 600, vertexSets, {
        isStatic: true,
        label: 'map',
        render: {
            fillStyle: '#fff',
            strokeStyle: '#fff',
            lineWidth: 1
        }
    }, true);
    Matter.World.add(world, terrain);
    })
}

const add = (world) => {
    
}

export default {
    init,
    add
};
