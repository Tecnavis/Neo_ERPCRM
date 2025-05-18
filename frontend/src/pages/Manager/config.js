// frontend config
export const fields = {
  name: {
    type: 'string',
    required: true,
  },
  branch: {
    type: 'asyncSelect',
    entity: 'branch',
    required: true,
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: '_id'
  },
  services: {
    type: 'asyncMultiSelect',
    entity: 'service',
    required: true,
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: '_id'
  }
};