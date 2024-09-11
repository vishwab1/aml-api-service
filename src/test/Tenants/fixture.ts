export const tenant_request = {
  tenantCreate: {
    id: 'api.tenant.create',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      name: 'mumbai',
      type: 'Government',
      board_id: [1],
    },
  },

  invalidTenantRequest: {
    id: 'api.tenant.create',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      type: 'Government',
      board_id: [1],
    }, // Missing the `name` field
  },

  invalidTenantSchema: {
    id: 'api.tenant.create',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      name: 123, // Invalid type for `name`, should be a string
      type: 'Government',
      board_id: [1, 2, 3],
    },
  },
};

export const updateTenatTenantBoard = {
  // Valid update request
  validTenantUpdateRequest: {
    id: 'api.tenant.update',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      name: 'Mumbai',
      board_id: [1],
    },
  },

  // Invalid update request
  invalidTenantUpdateRequest: {
    id: 'api.tenant.update',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      // Missing required fields
      updated_by: 'some_user_id',
      // Missing 'name' and 'type' which are required
    },
  },

  // Tenant does not exist
  tenantNotExistsRequest: {
    id: 'api.tenant.update',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      name: 'name',
      type: 'updated_type',
      // Ensure this field is excluded if not in the model
      // board_id: [1, 2, 3],
    },
  },
};

export const tenantSearch = {
  validTenantSearchrequest: {
    id: 'api.tenant.search',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      filters: { name: ['kerala'] },
      limit: 10,
      offset: 0,
    },
  },

  invalidSchemaSearchRequest: {
    id: 'api.tenant.search',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    request: {
      filters: { name: [1] },
      limit: 10,
      offset: 0,
    },
  },

  invalidfilterSearchRequest: {
    id: 'api.tenant.search',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    request: {
      filters: { live: [1] },
      limit: 10,
      offset: 0,
    },
  },
};
