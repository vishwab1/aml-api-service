export const insert_skillTaxonomy_request = {
  validRequest: {
    id: 'api.skillTaxonomy.create',
    ver: '1.0',
    ts: '2024-09-05T15:00:00Z',
    params: {
      msgid: '770e8600-g49b-43e6-c818-667877660003',
    },
    request: [
      {
        l1_identifier: '11_addition',
        l1_sequence: 1,
        l1_skill: {
          en: 'Substraction',
        },
        l1_skill_description: {
          en: 'Addition',
        },
        children: [
          {
            l2_identifier: '1digit_addition',
            l2_sequence: 1,
            l2_skill: {
              en: '1D without carry',
            },
            l2_skill_description: {
              en: 'Addition of single-digit numbers',
            },
          },
        ],
      },
    ],
  },

  invalidRequest: {
    id: 'api.skillTaxonomy.create',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: [
      {
        type: 'Government',
      },
    ],
  },
};
export const search_skillTaxonomy_request = {
  validRequest: {
    id: 'api.skillTaxonomy.search',
    ver: '1.0',
    ts: new Date().toISOString(),
    params: { msgid: 'test-msg-id' },
    request: {
      filters: {
        l1_skill: [{ en: 'Addition' }],
      },
      limit: 10,
      offset: 0,
    },
  },

  invalidRequest: {
    id: 'api.skillTaxonomy.search',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    request: {
      filters: {},
      limit: 10,
      offset: 0,
    },
  },
};
