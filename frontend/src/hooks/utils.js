export const calculateTaskStatus = (dueDate) => {
    const now = new Date();
    const dueDateTime = new Date(dueDate);
    return dueDateTime < now ? 'Past Due' : 'In Progress';
  };
  