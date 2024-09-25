export const board_update_request = {
  // Valid update request
  validRequest: {
    id: 'api.board.update',
    ver: '1.0',
    ts: '2024-09-19T12:00:00Z',
    params: {
      msgid: 'unique-message-id',
    },
    request: {
      name: {
        en: 'Board Name',
        fr: 'Nom du Tableau',
      },
      class_ids: {
        ids: [3, 4],
        l1: [1, 2],
      },
      skill_taxonomy_ids: [1, 2],
      description: {
        en: 'This is the English description',
        es: 'Esta es la descripción en español',
      },
    },
  },

  // Invalid update request (missing required fields)
  invalidRequest: {
    id: 'api.board.update',
    ver: '1.0',
    ts: '2024-09-19T12:00:00Z',
    params: {
      msgid: 'unique-message-id',
    },
    request: {
      name: 'sample',
    },
  },
};
