export const insert_repository_request = {
  validRequest: {
    id: 'api.repository.create',
    ver: '1.0',
    ts: '2024-09-13T12:00:00Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      name: {
        en: 'Content Repository',
      },
      description: {
        en: 'This repository contains various content types.',
        ta: 'இந்த நூலகம் பல்வேறு உள்ளடக்க வகைகளை கொண்டுள்ளது.',
        te: 'ఈ రిపోజిటరీలో వివిధ కంటెంట్ రకాలున్నాయి.',
      },
      tenant: {
        name: { en: 'Karnataka' },
      },
      sub_skills: [
        {
          name: {
            en: 'Geometry Basics',
          },
        },
      ],
    },
  },

  invalidRequest: {
    id: 'api.repository.create',
    ver: '1.0',
    ts: '2024-09-13T12:00:00Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      name: {
        en: 'Content Repository',
      },
      description: {
        en: 'This repository contains various content types.',
        ta: 'இந்த நூலகம் பல்வேறு உள்ளடக்க வகைகளை கொண்டுள்ளது.',
        te: 'ఈ రిపోజిటరీలో వివిధ కంటెంట్ రకాలున్నాయి.',
      },
      tenant: {
        name: 'karnataka',
      },
      sub_skills: [
        {
          name: {
            en: 'Geometry Basics',
          },
        },
      ],
    },
  },
  invalidSchemaRequest: {
    id: 'api.repository.create',
    ver: '1.0',
    ts: '2024-09-13T12:00:00Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      content_id: 'c001',
      name: {
        en: 'content 1',
        ta: 'உள்ளடக்கம் 1',
        te: 'సమగ్రత 1',
      },
      description: {
        en: 'This is the description for the content',
        ta: 'இது உள்ளடக்கத்திற்கான விளக்கம்',
        te: 'ఈ కంటెంట్ కోసం వివరణ',
      },
      tenant: {
        name: {
          en: 'Karnataka',
        },
      },
    },
  },
};

export const update_repository_request = {
  // Valid update request
  validRequest: {
    id: 'api.repository.update',
    ver: '1.0',
    ts: '2024-09-13T12:00:00Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      name: {
        en: 'Content Repository',
      },
      description: {
        en: 'This repository contains various content types.',
        ta: 'இந்த நூலகம் பல்வேறு உள்ளடக்க வகைகளை கொண்டுள்ளது.',
        te: 'ఈ రిపోజిటరీలో వివిధ కంటెంట్ రకాలున్నాయి.',
      },
      tenant: {
        name: { en: 'Karnataka' },
      },
      sub_skills: [
        {
          name: {
            en: 'Geometry Basics',
          },
        },
      ],
    },
  },
  // Invalid update request
  invalidRequest: {
    id: 'api.content.update',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      updated_by: 'some_user_id',
    },
  },
};

export const search_repository_request = {
  validRequest: {
    id: 'api.repository.search',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      filters: {
        name: [{ en: 'Content Repository' }],
      },
      limit: 10,
      offset: 0,
    },
  },

  invalidRequest: {
    id: 'api.repository.search',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    request: {
      filters: {
        question_set_id: ['q1'],
      },
      limit: 10,
      offset: 0,
    },
  },
};
