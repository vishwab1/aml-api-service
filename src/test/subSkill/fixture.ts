export const subskill_update_request = {
  // Valid update request
  validRequest: {
    id: 'api.subskill.update',
    ver: '1.0',
    ts: '2024-09-05T01:51:36Z',
    params: {
      msgid: 'c43785c4-d02a-411d-8466-466ad8ae6fba',
    },
    request: {
      name: {
        en: 'x+0',
      },
      description: {
        en: 'Description for X+0',
      },
    },
  },

  // Invalid update request
  invalidRequest: {
    id: 'api.subskill.update',
    ver: '1.0',
    ts: '2024-09-05T01:51:36Z',
    params: {
      msgid: 'c43785c4-d02a-411d-8466-466ad8ae6fba',
    },
    request: {
      invalidField: 'This is not valid',
    },
  },
};
