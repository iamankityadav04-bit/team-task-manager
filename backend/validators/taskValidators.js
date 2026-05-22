export const taskRules = {
  title: { required: true, min: 3 },
  description: { required: true },
  priority: { required: true, enum: ['LOW', 'MEDIUM', 'HIGH'] },
  dueDate: { required: true, date: true },
  assignedTo: { required: true, objectId: true },
  project: { required: true, objectId: true },
  status: { enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'] }
};

export const taskStatusRules = {
  status: { required: true, enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'] }
};
