export const skill_update_request = {
  // Valid update request
  validRequest: {
    id: 'api.skill.update',
    ver: '1.0',
    ts: '2024-09-05T01:51:36Z',
    params: {
      msgid: 'c43785c4-d02a-411d-8466-466ad8ae6fba',
    },
    request: {
      name: { en: 'Substraction1' },
      description: 'This is Addition',
      type: 'l1_skill',
    },
  },

  // Invalid update request (missing required fields)
  invalidRequest: {
    id: 'api.skill.update',
    ver: '1.0',
    ts: '2024-09-05T01:51:36Z',
    params: {
      msgid: 'c43785c4-d02a-411d-8466-466ad8ae6fba',
    },
    request: {
      name: 'sample',
    },
  },
};
