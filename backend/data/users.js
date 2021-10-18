import bcrypt from 'bcryptjs';
const users = [
  {
    name: 'Admin',
    email: 'admin@mail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Andrea Allin',
    email: 'andrea@mail.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Mats Allin',
    email: 'nats@mail.com',
    password: bcrypt.hashSync('123456', 10),
  },
];
export default users;
