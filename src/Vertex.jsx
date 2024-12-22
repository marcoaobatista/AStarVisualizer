/** Class for a vertex data structure */
export class Vertex
{
    /**
     * Constructor
     * @param {String} id The ID of the Vertex
     */
    constructor(id)
    {
        /**
         * ID of the vertex
         * @type {String}
         */
        this.id = id;

        /**
         * Dictionary of outgoing edges (id: weight)
         * @type {Map<String, number>}
         */
        this.adj = new Map();

        /**
         * Character of this vertex
         * @type {String}
         */
        this.char = ' ';

        /**
         * Is the node active?
         * @type {Boolean}
         */
        this.active = true;

        /**
         * Is the node part of the frame?
         * @type {Boolean}
         */
        this.isFrame = false;
    }

    /**
     * Sets the character
     * @param {String} char New character
     */
    setChar(char)
    {
        this.char = char;
    }

    /**
     * Gets the character of this vertex
     * @returns {string}
     */
    getChar()
    {
        return this.char;
    }

    /**
     * Sets the node as active or inactive
     * @param {Boolean} active
     */
    setActive(active)
    {
        this.active = active;
    }

    /**
     * Set whether this node is part of the frame
     * @param isFrame
     */
    setIsFrame(isFrame){
        this.isFrame = isFrame;
    }

    /**
     * Gets whether the node is part of the frame
     * @returns {boolean}
     */
    getIsFrame(){
        return this.isFrame;
    }
}