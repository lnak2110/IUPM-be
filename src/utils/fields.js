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

const order = Object.freeze({
  asc: 'asc',
  desc: 'desc',
});

const membersOrder = [
  {
    isUserProjectLeader: order.desc,
  },
  {
    assignedAt: order.asc,
  },
];

module.exports = {
  userWithoutPassword,
  userPublicFields,
  membersOrder,
};
