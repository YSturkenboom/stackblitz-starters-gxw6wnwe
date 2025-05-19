const db = {};

export const getCollection = (name) => {
  if (!db[name]) db[name] = [];

  return {
    find: (filter = {}) => ({
      toArray: async () => db[name].filter((doc) => matchFilter(doc, filter)),
    }),

    findOne: async (filter = {}) => {
      return db[name].find((doc) => matchFilter(doc, filter)) || null;
    },

    insertOne: async (doc) => {
      const newDoc = { ...doc, _id: generateId() };
      db[name].push(newDoc);
      return { acknowledged: true, insertedId: newDoc._id, data: newDoc };
    },

    updateOne: async (filter, update) => {
      const doc = db[name].find((doc) => matchFilter(doc, filter));
      if (doc) {
        applyUpdate(doc, update);
        return {
          acknowledged: true,
          matchedCount: 1,
          modifiedCount: 1,
          data: doc,
        };
      }
      return { acknowledged: true, matchedCount: 0, modifiedCount: 0 };
    },

    deleteOne: async (filter) => {
      const index = db[name].findIndex((doc) => matchFilter(doc, filter));
      if (index !== -1) {
        const deleted = db[name][index];
        db[name].splice(index, 1);
        return { acknowledged: true, deletedCount: 1, data: deleted };
      }
      return { acknowledged: true, deletedCount: 0 };
    },
  };
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

function matchFilter(doc, filter) {
  return Object.keys(filter).every((key) => doc[key] === filter[key]);
}

function applyUpdate(doc, update) {
  if (update.$set) {
    Object.keys(update.$set).forEach((key) => {
      doc[key] = update.$set[key];
    });
  }
}
