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
      class_ids: [
        {
          id: '9b50a7e7-fdec-4fd7-bf63-84b3e62e4248',
          sequence_no: 1,
          l1_skill_ids: ['9b50a7e7-fdec-4fd7-bf63-84b3e62e334f'],
        },
      ],
      skill_taxonomy_id: 'amltaxonomy',
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
