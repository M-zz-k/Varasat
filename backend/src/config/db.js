const { PrismaClient } = require('@prisma/client');

let prisma;
let isMock = false;

// In-Memory Database store for fallback
const mockDb = {
  users: [],
  familyMembers: [],
  deceasedRecords: [],
  assets: [],
  claims: [],
  documents: [],
  aiLogs: []
};

try {
  if (process.env.DATABASE_URL) {
    prisma = new PrismaClient();
  } else {
    console.warn('DATABASE_URL is not set. Falling back to Mock In-Memory Database.');
    isMock = true;
  }
} catch (e) {
  console.error('Failed to initialize Prisma Client, falling back to mock DB:', e);
  isMock = true;
}

// Helper methods to simulate DB operations when in mock mode
const db = {
  isMock,
  users: {
    create: async (args) => {
      if (isMock) {
        const newUser = { id: require('crypto').randomUUID(), ...args.data, created_at: new Date() };
        mockDb.users.push(newUser);
        return newUser;
      }
      return prisma.user.create(args);
    },
    findUnique: async (args) => {
      if (isMock) {
        const key = Object.keys(args.where)[0];
        const val = args.where[key];
        return mockDb.users.find(u => u[key] === val) || null;
      }
      return prisma.user.findUnique(args);
    },
    findFirst: async (args) => {
      if (isMock) {
        return mockDb.users[0] || null;
      }
      return prisma.user.findFirst(args);
    }
  },
  familyMembers: {
    createMany: async (args) => {
      if (isMock) {
        const created = args.data.map(item => {
          const fm = { id: require('crypto').randomUUID(), ...item };
          mockDb.familyMembers.push(fm);
          return fm;
        });
        return { count: created.length };
      }
      return prisma.familyMember.createMany(args);
    },
    findMany: async (args) => {
      if (isMock) {
        const userId = args.where?.user_id;
        return mockDb.familyMembers.filter(f => f.user_id === userId);
      }
      return prisma.familyMember.findMany(args);
    }
  },
  deceasedRecords: {
    create: async (args) => {
      if (isMock) {
        const record = { id: require('crypto').randomUUID(), ...args.data };
        mockDb.deceasedRecords.push(record);
        return record;
      }
      return prisma.deceasedRecord.create(args);
    },
    findUnique: async (args) => {
      if (isMock) {
        const key = Object.keys(args.where)[0];
        const val = args.where[key];
        return mockDb.deceasedRecords.find(d => d[key] === val) || null;
      }
      return prisma.deceasedRecord.findUnique(args);
    }
  },
  assets: {
    create: async (args) => {
      if (isMock) {
        const record = { id: require('crypto').randomUUID(), ...args.data };
        mockDb.assets.push(record);
        return record;
      }
      return prisma.asset.create(args);
    },
    findMany: async (args) => {
      if (isMock) {
        return mockDb.assets;
      }
      return prisma.asset.findMany(args);
    }
  },
  claims: {
    create: async (args) => {
      if (isMock) {
        const claim = { 
          id: require('crypto').randomUUID(), 
          ...args.data, 
          created_at: new Date(),
          asset: mockDb.assets.find(a => a.id === args.data.asset_id),
          claimant: mockDb.users.find(u => u.id === args.data.claimant_id),
          documents: []
        };
        mockDb.claims.push(claim);
        return claim;
      }
      return prisma.claim.create(args);
    },
    findMany: async (args) => {
      if (isMock) {
        // Resolve nested models for lists
        return mockDb.claims.map(c => ({
          ...c,
          asset: mockDb.assets.find(a => a.id === c.asset_id),
          claimant: mockDb.users.find(u => u.id === c.claimant_id),
          documents: mockDb.documents.filter(d => d.claim_id === c.id)
        }));
      }
      return prisma.claim.findMany(args);
    },
    findUnique: async (args) => {
      if (isMock) {
        const c = mockDb.claims.find(cl => cl.id === args.where.id);
        if (!c) return null;
        return {
          ...c,
          asset: mockDb.assets.find(a => a.id === c.asset_id),
          claimant: mockDb.users.find(u => u.id === c.claimant_id),
          documents: mockDb.documents.filter(d => d.claim_id === c.id)
        };
      }
      return prisma.claim.findUnique(args);
    },
    update: async (args) => {
      if (isMock) {
        const idx = mockDb.claims.findIndex(cl => cl.id === args.where.id);
        if (idx !== -1) {
          mockDb.claims[idx] = { ...mockDb.claims[idx], ...args.data };
          return mockDb.claims[idx];
        }
        return null;
      }
      return prisma.claim.update(args);
    }
  },
  documents: {
    create: async (args) => {
      if (isMock) {
        const doc = { id: require('crypto').randomUUID(), ...args.data, created_at: new Date() };
        mockDb.documents.push(doc);
        return doc;
      }
      return prisma.document.create(args);
    },
    findMany: async (args) => {
      if (isMock) {
        return mockDb.documents.filter(d => d.claim_id === args.where.claim_id);
      }
      return prisma.document.findMany(args);
    },
    update: async (args) => {
      if (isMock) {
        const idx = mockDb.documents.findIndex(d => d.id === args.where.id);
        if (idx !== -1) {
          mockDb.documents[idx] = { ...mockDb.documents[idx], ...args.data };
          return mockDb.documents[idx];
        }
        return null;
      }
      return prisma.document.update(args);
    }
  },
  aiLogs: {
    create: async (args) => {
      if (isMock) {
        const log = { id: require('crypto').randomUUID(), ...args.data, created_at: new Date() };
        mockDb.aiLogs.push(log);
        return log;
      }
      return prisma.aiLog.create(args);
    }
  }
};

module.exports = db;
