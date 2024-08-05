class UsersStorage {
  constructor() {
    this.storage = {};
    this.id = 0;
  }

  addUser({ firstName, lastName, email, age, bio }) {
    const id = this.id;
    this.storage[id] = { id, firstName, lastName, email, age, bio };
    this.id++;
  }

  getUsers() {
    return Object.values(this.storage);
  }

  getUser(id) {
    return this.storage[id];
  }

  updateUser(id, { firstName, lastName, email, age, bio }) {
    this.storage[id] = { id, firstName, lastName, email, age, bio };
  }

  deleteUser(id) {
    delete this.storage[id];
  }

  findUserByName(userName) {
    for (const userId in this.storage) {
      const user = this.storage[userId];
      console.log(
        "(from findUserByName) ",
        "user.firstName: ",
        user.firstName,
        "userName.firstName: ",
        userName.firstName,
        "user.lastName: ",
        user.lastName,
        "userName.lastName: ",
        userName.lastName,
      );
      if (
        user.firstName === userName.firstName &&
        user.lastName === userName.lastName
      ) {
        return user;
      }
    }
    return null;
  }

  getUserBySearch(params) {
    console.log('using "getUserBySearch"');
    const { name, email } = params[0];
    // console.log("user search name and email", name, " ", email);
    const users = this.getUsers();
    let userID;

    if (name || email) {
      if (name) {
        const first = name.split(" ")[0];
        const last = name.split(" ")[1];
        users.map((user) => {
          console.log(
            "user.firstName: ",
            user.firstName,
            "user.lastName: ",
            user.lastName,
          );
          if (user.firstName === first && user.lastName === last) {
            userID = user.id;
          } else {
            console.log("name didn't match");
          }
        });
      } else {
        users.map((user) => {
          if (user.email === email) {
            userID = user.id;
          }
        });
      }
      return this.getUser(userID);
    }
  }
  // TODO: get user by email
}
// Rather than exporting the class, we can export an instance of the class by instantiating it.
// This ensures only one instance of this class can exist, also known as the "singleton" pattern.
module.exports = new UsersStorage();
