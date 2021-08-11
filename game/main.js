import {Game} from "./Game.js";
import {Viewport} from "./Viewport.js";
import {Grid} from "./Grid.js";

export let images = {};
let imagesLoaded = 0;

let toLoad = [];
$("#toLoad li").each((i, e) =>
{
    toLoad.push($(e).text());
});

$("#toLoad").remove();

for (let file of toLoad)
{
    preloadImage(file);
}

function start()
{
    let game = new Game(new Viewport(document.getElementsByClassName("viewport")[0]), new Grid({x: 10, y: 10}));

    game.addHero();
    game.addHero();

    //game.drawFirstFrame();

    $(window).on("resize", () =>
    {
        game.viewport.resize();
    });
}

function preloadImage(file)
{
    let image = new Image();
    image.onload = () =>
    {
        imagesLoaded++;
        if (imagesLoaded === toLoad.length)
            start();
    }
    image.src = file;
    images[file.split("\\")[file.split("\\").length - 1].split(".")[0]] = image;
}