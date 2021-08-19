<html lang="en">
    <head>
        <title>Auto RPG</title>
        <link rel="stylesheet" href="main.css">
    </head>
    <body>
        <canvas class="viewport"></canvas>
        <input type="range" min="0" max="1990" step="10" value="1000" id="speed">
        <label for="speed">Speed</label>

        <div id="toLoad" hidden>
            <ul>
                <?php
                scanDirRecursively("game\img");
                ?>
            </ul>
        </div>
    </body>
    <footer>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script type="module" src="game/main.js"></script>
    </footer>
</html>

<?php
function scanDirRecursively($target) {

    if(is_dir($target) && $target !== "." && $target !== ".."){

        $files = glob( $target . '*', GLOB_MARK ); //GLOB_MARK adds a slash to directories returned

        foreach( $files as $file )
        {
            scanDirRecursively( $file );
        }
    }
    else
    {
        echo "<li>{$target}</li>";
    }
}