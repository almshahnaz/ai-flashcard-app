const FLASHCARDS_DIR = "flashcardS";

export const flashcardStorage = {

    async init() {
        try{
            await puter.fs.mkdir(FLASHCARDS_DIR);
        } catch(error){
            console.log("Flashcards directory already exists");
        }
    },

    async saveSet(name, flashcards, filename) {
        await this.init();

        const setData = {
            id: Date.now(),
            name: name,
            filename: filename,
            flashcards: flashcards,
            created: new Date().toISOString(),
            lastStudied: null,
            progress: {
                easy: 0,
                medium: 0,
                hard: 0,
            }
        };

        const puterFilename = `${FLASHCARDS_DIR}/${setData.id}.json`;
        await puter.fs.write(puterFilename, JSON.stringify(setData, null, 2));

        return setData;

    },

    async getAllSets() {
        await this.init();

        try {
            const files = await puter.fs.readdir(FLASHCARDS_DIR);
            const sets = [];

            for (const file of files) {
                if (file.name.endsWith(".json")) {
                    try {
                        const content = await puter.fs.read(`${FLASHCARDS_DIR}/${file.name}`);
                        const text = await content.text();
                        const data = JSON.parse(text);
                        sets.push(data);
                    } catch (e) {
                        console.error(`Error reading ${file.name}:`, e);
                    }
                }
            }

            return sets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (e) {
            console.error("Error getting flashcard sets:", e);
            return [];
        }

    },

    async getSet(id) {
        try {
            const content = await puter.fs.read(`${FLASHCARDS_DIR}/${id}.json`);
            const text = await content.text();
            return JSON.parse(text);
        } catch (e) {
            console.error("Error reading flashcard set:", e);
            return null;
        }

    },

    async deleteSet(id) {
        try {
            await puter.fs.delete(`${FLASHCARDS_DIR}/${id}.json`);
            return true;
        } catch (e) {
            console.error("Error deleting flashcard set:", e);
            return false;
        }
    },

    async updateLastStudied(id) {
        const set = await this.getSet(id);
        if (set) {
            set.lastStudied = new Date().toISOString();
            await puter.fs.write(`${FLASHCARDS_DIR}/${id}.json`, JSON.stringify(set, null, 2));
        }
    }
}