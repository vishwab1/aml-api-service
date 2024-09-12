export const insert_master_request = {
  masterCreate: {
    id: 'api.master.create',
    ver: '1.0',
    ts: '2024-09-05T01:51:36Z',
    params: {
      msgid: 'c43785c4-d02a-411d-8466-466ad8ae6fba',
    },
    request: {
      boardData: [
        {
          name: {
            en: 'Board 8',
          },
          description: 'Description for Board 8',
          class_id: [1, 2],
        },
      ],
      classData: [
        {
          name: {
            en: 'Class 1',
          },
          prerequisites: ['Some prerequisites for Class 1'],
          description: 'Description for Class 1',
        },
      ],
      subskillData: [
        {
          name: {
            en: 'x+0',
          },
          description: 'Description for SubSkill 1',
        },
      ],
      roleData: [
        {
          name: 'Role 1',
          description: 'Description for Role 1',
        },
      ],
    },
  },

  invalidMasterSchema: {
    id: 'api.master.create',
    ver: '1.0',
    ts: '2024-09-05T01:51:36Z',
    params: {
      msgid: 'test-msg-id',
    },
    request: {
      board: [
        {
          name: '',
          description: 'Description for Board 1',
          class_id: [],
        },
      ],
      class: [],
    },
  },
};

export const masterSearch = {
  validSearchRequest: {
    id: 'api.master.search',
    ver: '1.0',
    ts: new Date().toISOString(),
    params: { msgid: 'test-msg-id' },
    request: {
      entityType: 'subSkill',
      filters: {
        name: { en: 'x+0' },
      },
      limit: 10,
      offset: 0,
    },
  },

  invalidSchemaSearchRequest: {
    id: 'api.master.search',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',

    request: {
      filters: {},
      limit: 10,
      offset: 0,
    },
  },
};
