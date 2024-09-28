export const processRequest = {
  validRequest: {
    id: 'api.bulk.url',
    ver: '1.0',
    ts: '2024-09-24T11:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      fileName: 'bulk_upload.zip',
    },
  },

  invalidSchema: {
    id: 'api.upload.invalid',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      folderName: 'upload',
      fileName: 'grid.zip',
      expiryTime: 10,
      description: 'uploading grid question',
    },
  },

  missingFields: {
    id: 'api.bulk.url',
    ver: '1.0',
    ts: '2024-09-24T11:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {},
  },
};
