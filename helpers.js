const getUsersByEmail = function (email, database) {
  let keys = Object.keys(database);
  for (let item in database) {
    if (email === database[item].email) {
      return database[item];
    }
  } return false
};


module.exports = { getUsersByEmail }