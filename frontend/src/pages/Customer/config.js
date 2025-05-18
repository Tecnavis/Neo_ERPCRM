// frontend config
export const fields = {
  name: {
    type: 'string',
    required: true,
  },
  email: {
    type: 'email',
    required: true,
  },
  password: {
    type: 'password',
    required: true,
    minLength: 6,
  },

};