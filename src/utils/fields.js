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
  { user: { name: order.asc } },
];

const projectsByUserOrder = [
  { isUserProjectLeader: order.desc },
  { project: { name: order.asc } },
];

module.exports = {
  userWithoutPassword,
  userPublicFields,
  membersOrder,
  projectsByUserOrder,
};
