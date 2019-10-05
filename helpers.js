const getUserByEmail = function(email, database) {
  let keys = Object.keys(database);
  for (let item in keys) {
    if (email === database[item].email) {
      return database[item];
    }
  } return false;
};


module.exports = { getUserByEmail };