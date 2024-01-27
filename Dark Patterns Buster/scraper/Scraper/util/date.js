const { format } = require('date-fns');

const formatDate = (date, formatStr = 'yyyy-MM-dd') => {
  return format(date, formatStr);
};

module.exports = { formatDate };
