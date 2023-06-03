import BlocksDAO from "../dao/blocks.dao.js";

export default class BlocksController {
    static async apiGetBlocks(req, res, next) {
        try {
            let blocks = await BlocksDAO.getBlocks();
            res.json(blocks[0].clusters);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiStoreBlock(req, res, next) {
        try {
            const response = await fetch("https://data.seattle.gov/resource/tazs-3rd5.json");
            const data = await response.json();

            const locations = data.map(item => ({
                lat: parseFloat(item.latitude),
                long: parseFloat(item.longitude)
            }));

            const clusters = createClusters(locations, 2);

            const result = await BlocksDAO.storeBlock({ clusters }); // Wrap clusters in an object
            res.json(result);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }
}

function createClusters(locations, maxDistance) {
    const clusters = [];
    const visited = new Set();

    for (let i = 0; i < locations.length; i++) {
        if (visited.has(i)) continue;

        const currentLocation = locations[i];
        const cluster = {
            centroid: [currentLocation.lat, currentLocation.long],
            radius: 0
        };
        const clusterLocations = [currentLocation];
        visited.add(i);

        for (let j = i + 1; j < locations.length; j++) {
            if (visited.has(j)) continue;

            const nextLocation = locations[j];
            const distance = calculateDistance(currentLocation, nextLocation);

            if (distance <= maxDistance) {
                clusterLocations.push(nextLocation);
                visited.add(j);
            }
        }

        cluster.radius = calculateRadius(clusterLocations, cluster.centroid);
        clusters.push(cluster);
    }

    return clusters;
}

function calculateDistance(location1, location2) {
    const earthRadius = 6371; // Earth's radius in kilometers
    const latDiff = degreesToRadians(location2.lat - location1.lat);
    const longDiff = degreesToRadians(location2.long - location1.long);
    const a =
        Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
        Math.cos(degreesToRadians(location1.lat)) *
        Math.cos(degreesToRadians(location2.lat)) *
        Math.sin(longDiff / 2) *
        Math.sin(longDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance;
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function calculateRadius(locations, centroid) {
    let maxDistance = 0;
    for (let i = 0; i < locations.length; i++) {
        const location = locations[i];
        const distance = calculateDistance(centroid, location);
        maxDistance = Math.max(maxDistance, distance);
    }
    return maxDistance;
}
