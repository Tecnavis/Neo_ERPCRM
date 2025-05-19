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
  role: {
    type: 'hidden',
    defaultValue: 'branch_manager', // This will automatically set the value
    noForm: true // This prevents it from appearing in the form
  },


};