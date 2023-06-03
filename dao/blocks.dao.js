import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;

let blocks;

export default class BlocksDAO {
    static async injectDB(conn) {
        if (blocks) {
            return;
        }
        try {
            blocks = await conn.db(process.env.CRIME_NS).collection("crimes");
        } catch (e) {
            console.error(`Unable to establish collection handles in BlocksDAO: ${e}`);
        }
    }

    static async getBlocks() {
        try {
            return await blocks.find().toArray();
        } catch (e) {
            console.log(`getBlocks, ${e}`);
            return { error: e };
        }
    }

    static async storeBlock(block) {
        try {
            const result = await blocks.insertOne(block);
            return result;
        } catch (e) {
            console.log(`storeBlock, ${e}`);
            return { error: e };
        }
    }
}
