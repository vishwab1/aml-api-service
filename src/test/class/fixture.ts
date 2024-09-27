export const class_update_request = {
  // Valid update request
  validRequest: {
    id: 'api.class.update',
    ver: '1.0',
    ts: '2024-09-05T01:51:36Z',
    params: {
      msgid: 'c43785c4-d02a-411d-8466-466ad8ae6fba',
    },
    request: {
      name: { en: 'Class One1' },
      description: { en: 'Description for Class One' },
      prerequisites: ['Class Zero'],
    },
  },

  // Invalid update request (missing required fields)
  invalidRequest: {
    id: 'api.class.update',
    ver: '1.0',
    ts: '2024-09-05T01:51:36Z',
    params: {
      msgid: 'c43785c4-d02a-411d-8466-466ad8ae6fba',
    },
    request: {
      name: 'test',
    },
  },
};
