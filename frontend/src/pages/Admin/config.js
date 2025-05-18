// frontend config
export const fields = {
  name: {
    type: 'string',
    required: true,
  },
  country: {
    type: 'country',
    // color: 'red',
  },
  // address: {
  //   type: 'string',
  //    required: true,
  // },
  // phone: {
  //   type: 'phone',
  
  // },
  
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
    type: 'select',
    options: [
      { label: 'Owner', value: 'owner' },
      { label: 'Admin', value: 'admin' },
      { label: 'Branch Manager', value: 'branch_manager' },
      { label: 'Employee', value: 'employee' },
    ],
    required: true,
  },
};