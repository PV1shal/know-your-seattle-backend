import BlocksDAO from "../dao/blocks.dao.js";

export default class BlocksController {
    static async apiGetBlocks(req, res, next) {
        try {
            let blocks = await BlocksDAO.getBlocks();
            res.json(blocks);
        }
        catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }
    static async apiStoreBlock(req, res, next) {
        try {
            const response = await fetch("https://data.seattle.gov/resource/tazs-3rd5.json");
            const data = await response.json();

            const addressCounts = data.reduce((counts, item) => {
                const address = item._100_block_address;
                counts[address] = (counts[address] || 0) + 1;
                return counts;
            }, {});

            const block = { counts: addressCounts };
            const result = await BlocksDAO.storeBlock(block);
            res.json(result);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }
}