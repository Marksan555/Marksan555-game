import Matter from 'matter-js';
import $ from 'jquery';
var terrain;

const init = (world) => {
    terrain = Matter.Bodies.rectangle(400, 200, 300, 5);

    $.get(svg).done(function(data) {
    var vertexSets = [];

    $(data).find('path').each(function(i, path) {
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
};

import Config from './config';

const initLevel = (level, world) => {
    const levelConfig = Config.getLevelConfig(level);
    levelConfig.svgs.map((svg) => {
        getBodyFromConfig(svg.path, svg.x, svg.y, world);
    });
};

const getBodyFromConfig = (path, x, y, world) => {

    const svg = require('../assets/maps/' + path);
    $.get(svg).done((data) => {
        let vertexSets = [];

        $(data).find('path').each(function(i, path) {
            vertexSets.push(Matter.Svg.pathToVertices(path, 30));
        });

        const terrain = Matter.Bodies.fromVertices(x, y, vertexSets, {
            isStatic: true,
            label: 'map',
            render: {
                fillStyle: 'gray',
                strokeStyle: 'gray',
                lineWidth: 1
            }
        }, true);
        Matter.World.add(world, terrain);

        // terrain.position.x = terrain.bounds.min.x;
        // terrain.position.y = terrain.bounds.min.y;
        // terrain.positionPrev.x = terrain.bounds.min.x;
        // terrain.positionPrev.y = terrain.bounds.min.y;


    });
};


const add = (world) => {

};

export default {
    initLevel,
    init,
    add
};
