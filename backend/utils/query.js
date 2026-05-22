export const buildTaskQuery = (req) => {
  const query = {};
  const { search, status, priority, project } = req.query;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (project) query.project = project;

  return query;
};
