const userWithoutPassword = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  isAdmin: true,
  joinedAt: true,
};

const userPublicFields = {
  id: true,
  name: true,
  email: true,
  avatar: true,
};

const membersOrder = [
  {
    assignedAt: 'asc',
  },
  {
    isUserProjectLeader: 'asc',
  },
];

module.exports = {
  userWithoutPassword,
  userPublicFields,
  membersOrder,
};
