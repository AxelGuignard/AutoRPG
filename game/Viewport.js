export class Viewport
{
    #viewport = null;
    #ctx = null;
    #height = 0;
    #width = 0;

    constructor(viewport)
    {
        this.#viewport = viewport;
        this.#ctx = viewport.getContext("2d");
        this.resize();
    }

    resize()
    {
        if ($(window).width() >= $(window).height() && $(window).height() >= 375) {
            this.#height = $(window).height() - 1;
            this.#width = this.#height;
        }
        else if ($(window).width() < $(window).height() && $(window).width() >= 375) {
            this.#width = $(window).width() - 1;
            this.#height = this.#width;
        }

        $(this.#viewport).height(this.#height).width(this.#width);
        this.#ctx.canvas.height = this.#height;
        this.#ctx.canvas.width = this.#width;
    }

    getHeight()
    {
        return this.#height;
    }

    getWidth()
    {
        return this.#width;
    }

    /** @returns {CanvasRenderingContext2D} */
    getCtx()
    {
        return this.#ctx;
    }
}