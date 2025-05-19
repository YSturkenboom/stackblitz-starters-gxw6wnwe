interface Document {
  _id: string;
  [key: string]: any;
}

interface Database {
  [key: string]: Document[];
}

const STORAGE_KEY = 'simulated_db';

function loadDatabase(): Database {
  if (typeof window === 'undefined') return {};
  const stored = sessionStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

function saveDatabase(db: Database): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

const db: Database = loadDatabase();

export const getCollection = (name: string) => {
  if (!db[name]) db[name] = [];

  return {
    find: (filter: Partial<Document> = {}) => {
      console.log('1 Find', filter);
      const results = db[name].filter((doc) => matchFilter(doc, filter));
      return {
        toArray: async () => results.sort((a, b) => (a.order || 0) - (b.order || 0))
      };
    },

    findOne: async (filter: Partial<Document> = {}) => {
      console.log('2 FindOne');
      return db[name].find((doc) => matchFilter(doc, filter)) || null;
    },

    insertOne: async (doc: Omit<Document, '_id'>) => {
      console.log('3 InsertOne', doc);
      const maxOrder = Math.max(0, ...db[name].map(d => d.order || 0));
      const newDoc = { ...doc, _id: generateId(), order: maxOrder + 1 };
      db[name].push(newDoc);
      saveDatabase(db);
      return { acknowledged: true, insertedId: newDoc._id, data: newDoc };
    },

    updateOne: async (filter: Partial<Document>, update: { $set: Partial<Document> }) => {
      console.log('4 UpdateOne', filter, update);
      const doc = db[name].find((doc) => matchFilter(doc, filter));
      if (doc) {
        applyUpdate(doc, update);
        saveDatabase(db);
        return {
          acknowledged: true,
          matchedCount: 1,
          modifiedCount: 1,
          data: doc,
        };
      }
      return { acknowledged: true, matchedCount: 0, modifiedCount: 0 };
    },

    updateMany: async (filter: Partial<Document>, update: { $set: Partial<Document> }) => {
      console.log('4 UpdateMany', filter, update);
      const docs = db[name].filter((doc) => matchFilter(doc, filter));
      docs.forEach(doc => applyUpdate(doc, update));
      saveDatabase(db);
      return {
        acknowledged: true,
        matchedCount: docs.length,
        modifiedCount: docs.length,
      };
    },

    deleteOne: async (filter: Partial<Document>) => {
      console.log('5 DeleteOne', filter);
      const index = db[name].findIndex((doc) => matchFilter(doc, filter));
      if (index !== -1) {
        const deleted = db[name][index];
        db[name].splice(index, 1);
        saveDatabase(db);
        return { acknowledged: true, deletedCount: 1, data: deleted };
      }
      return { acknowledged: true, deletedCount: 0 };
    },
  };
};

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

function matchFilter(doc: Document, filter: Partial<Document>): boolean {
  return Object.keys(filter).every((key) => doc[key] === filter[key]);
}

function applyUpdate(doc: Document, update: { $set: Partial<Document> }): void {
  if (update.$set) {
    Object.keys(update.$set).forEach((key) => {
      doc[key] = update.$set[key];
    });
  }
}
