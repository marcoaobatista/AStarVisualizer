import { Vertex } from "./Vertex.jsx";

/** Class for a grid Graph data structure */
export class Graph {
    /**
     * Constructor
     * @param width Width of the grid graph
     * @param height Height of the grid graph
     */
    constructor(width, height) {
        this.vertices = new Map();

        // Create regex patterns with dynamic width and height
        const topLeftCorner = new RegExp(`^0,0$`);
        const topRightCorner = new RegExp(`^${width - 1},0$`);
        const bottomLeftCorner = new RegExp(`^0,${height - 1}$`);
        const bottomRightCorner = new RegExp(`^${width - 1},${height - 1}$`);
        const topRow = new RegExp(`^.*,0$`);
        const bottomRow = new RegExp(`^.*,${height - 1}$`);
        const leftColumn = new RegExp(`^0,.*$`);
        const rightColumn = new RegExp(`^${width - 1},.*$`);

        // Populate graph
        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                const vertexId = `${i},${j}`;
                let vertex = new Vertex(vertexId);

                const isBorder =
                    topLeftCorner.test(vertex.id) ||
                    topRightCorner.test(vertex.id) ||
                    bottomLeftCorner.test(vertex.id) ||
                    bottomRightCorner.test(vertex.id) ||
                    topRow.test(vertex.id) ||
                    bottomRow.test(vertex.id) ||
                    leftColumn.test(vertex.id) ||
                    rightColumn.test(vertex.id);

                if(isBorder){
                    vertex.setActive(false);
                    vertex.setIsFrame(true)
                }

                this.vertices.set(vertexId, vertex);

                // Add neighbors if within bounds
                const neighbors = [
                    [i - 1, j], // Up
                    [i + 1, j], // Down
                    [i, j - 1], // Left
                    [i, j + 1],  // Right
                    [i - 1, j + 1], // Up-right
                    [i + 1, j + 1], // Down-right
                    [i - 1, j - 1], // Up-right
                    [i + 1, j - 1], // Down-right
                ];
                for (let [ni, nj] of neighbors) {
                    if (ni >= 0 && ni < width && nj >= 0 && nj < height) {
                        const neighborId = `${ni},${nj}`;
                        let dist = Math.sqrt(Math.pow(i - ni, 2) + Math.pow(j - nj, 2));
                        vertex.adj.set(neighborId, dist);
                    }
                }
            }
        }
    }

    /**
     * Calculates the heuristic used in this graph.
     * Uses taxi cab distance
     * @param aId The id of the first vertex
     * @param bId The id of the second vertex
     * @returns {number} Taxi cab distance
     */
    heuristic(aId, bId) {
        const [x1, y1] = aId.split(',').map(Number);
        const [x2, y2] = bId.split(',').map(Number);
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    /**
     * Gets the vertex with the lowest F-score in the open set (instead of using min heap)
     * @param openSet
     * @returns {Vertex} The node with the lowest F-score
     */
    getLowestFScore(openSet) {
        let lowest = null;
        for (const [node, score] of openSet) {
            if (lowest === null || score < openSet.get(lowest)) {
                lowest = node;
            }
        }
        return lowest;
    }

    /**
     * Reconstructs the path from the end node to the beginning node
     * @param cameFrom Starting node ID
     * @param current Ending node ID
     * @returns {*[]} A list of ID's tracing back to the starting node
     */
    reconstructPath(cameFrom, current) {
        const path = [];
        while (current !== null) {
            path.unshift(current);
            current = cameFrom.get(current) || null; // Move backward through `cameFrom`
        }
        return path;
    }

    /**
     * Calculates the shortest path from one node to another using the A Star algorithm
     * @param startId Starting node ID
     * @param endId Ending node ID
     * @returns {null|*[]} Reconstructed path from start to finish
     */
    aStar(startId, endId) {
        if (!this.vertices.has(startId) || !this.vertices.has(endId)) {
            throw new Error("Start or end vertex not found in the graph");
        }

        const openSet = new Map(); // Open set as a Map with F-scores
        const closedSet = new Set();
        const gScore = new Map(); // Actual distances from start
        const fScore = new Map(); // G-score + heuristic
        const cameFrom = new Map(); // To reconstruct the path

        // Initialization
        gScore.set(startId, 0);
        fScore.set(startId, this.heuristic(startId, endId));
        openSet.set(startId, fScore.get(startId));

        while (openSet.size > 0) {
            // Find vertex with lowest F-score in openSet
            const current = this.getLowestFScore(openSet);

            if (current === endId) {
                return this.reconstructPath(cameFrom, current);
            }

            openSet.delete(current);
            closedSet.add(current);

            for (let [neighborId, weight] of this.vertices.get(current).adj) {
                if (closedSet.has(neighborId)) continue;

                const tentativeGScore = gScore.get(current) + weight;

                if (!gScore.has(neighborId) || tentativeGScore < gScore.get(neighborId)) {
                    if (!this.vertices.get(neighborId).active) continue;
                    cameFrom.set(neighborId, current);
                    gScore.set(neighborId, tentativeGScore);
                    fScore.set(neighborId, tentativeGScore + this.heuristic(neighborId, endId));

                    if (!openSet.has(neighborId)) {
                        openSet.set(neighborId, fScore.get(neighborId));
                        if (neighborId !== startId && neighborId !== endId)
                        {
                            this.vertices.get(neighborId).setChar(";");
                        }
                    }
                }
            }
        }
        return null;
    }

    /**
     * Returns a map with the vertex id and the Vertex object
     * @returns {Map<any, any>}
     */
    getVertices() {
        return this.vertices;
    }

    /**
     * Clears the path drawn
     */
    clear()
    {
        for (let vertex of this.vertices.values()) {
            if (vertex.char === '$' || vertex.char === ';')
            {
                vertex.setChar(' ')
            }
        }
    }
}