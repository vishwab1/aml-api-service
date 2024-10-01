export const mediaUploadFixture = {
  validRequest: {
    id: 'api.media.upload',
    ver: '1.0',
    ts: '2024-09-28T12:00:00Z',
    params: {
      msgid: '12345',
    },
    request: [
      {
        fileName: 'media_file_1.mp4',
        category: 'content',
      },
      {
        fileName: 'question_set_1.zip',
        category: 'questionSet',
      },
      {
        fileName: 'question_1.jpg',
        category: 'question',
      },
    ],
  },

  invalidSchema: {
    id: 'api.media.invalid',
    ver: '1.0',
    ts: '2024-09-28T12:00:00Z',
    params: {
      msgid: '12345',
    },
    request: [
      {
        fileName: 'media_file_1.mp4',
        category: 'content',
      },
    ],
  },
  missingFields: {
    id: 'api.media.upload',
    ts: '2024-09-28T12:00:00Z',
    params: {
      msgid: '12345',
    },
    request: [
      {
        fileName: 'media_file_1.mp4',
        category: 'content',
      },
    ],
  },
  invalidCategory: {
    id: 'api.media.upload',
    ver: '1.0',
    ts: '2024-09-28T12:00:00Z',
    params: {
      msgid: '12345',
    },
    request: [
      {
        fileName: 'media_file_1.mp4',
        category: 'invalidCategory',
      },
    ],
  },
  emptyRequest: {
    id: 'api.media.upload',
    ver: '1.0',
    ts: '2024-09-28T12:00:00Z',
    params: {
      msgid: '12345',
    },
    request: [],
  },
};

export const mediaReadFixture = {
  validRequest: {
    id: 'api.media.read',
    ver: '1.0',
    ts: '2024-09-28T12:00:00Z',
    params: {
      msgid: '12345',
    },
    request: [
      {
        fileName: 'media_file_1.mp4',
        mimeType: 'video/mp4',
        mediaType: 'video',
        src: 'media/content/1727688106697',
      },
      {
        fileName: 'question_set_1.zip',
        mimeType: 'application/zip',
        mediaType: 'archive',
        src: 'media/questionSet',
      },
      {
        fileName: 'question_1.jpg',
        mimeType: 'image/jpeg',
        mediaType: 'image',
        src: 'media/question/1727688106701',
      },
    ],
  },

  invalidSchema: {
    id: 'api.media.invalid',
    ver: '1.0',
    ts: '2024-09-28T12:00:00Z',
    params: {
      msgid: '12345',
    },
    request: [
      {
        fileName: 'media_file_1.mp4',
        mimeType: 'video/mp4',
        mediaType: 'video',
        src: 'media/content',
      },
    ],
  },

  missingFields: {
    id: 'api.media.read',
    ver: '1.0',
    ts: '2024-09-28T12:00:00Z',
    params: {
      msgid: '12345',
    },
    request: [
      {
        fileName: 'media_file_1.mp4',
        mimeType: 'video/mp4',
        mediaType: 'video',
      },
    ],
  },

  invalidCategory: {
    id: 'api.media.read',
    ver: '1.0',
    ts: '2024-09-28T12:00:00Z',
    params: {
      msgid: '12345',
    },
    request: [
      {
        fileName: 'media_file_1.mp4',
        mimeType: 'video/mp4',
        mediaType: 'video',
        src: 'invalidCategory',
      },
    ],
  },

  emptyRequest: {
    id: 'api.media.read',
    ver: '1.0',
    ts: '2024-09-28T12:00:00Z',
    params: {
      msgid: '12345',
    },
    request: [],
  },
};
