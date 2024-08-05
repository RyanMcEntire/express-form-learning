// const asyncHandler = require("express-async-handler");
const UsersStorage = require("../storages/UsersStorage");
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const emailErr = "must be a valid email";
const rangeErr = "must be between 18 and 20";
const emptyErr = "must not be empty";

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`)
    .toLowerCase(),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`)
    .toLowerCase()
    .custom((value, { req }) => {
      const user = UsersStorage.findUserByName({
        firstName: req.body.firstName,
        lastName: value,
      });

      if (user) {
        throw new Error("User already exists");
      }
      return true;
    }),
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email ${emptyErr}`)
    .isEmail()
    .withMessage(`Email ${emailErr}`),
  body("age")
    .trim()
    .isInt({ min: 18, max: 120 })
    .withMessage(`Age ${rangeErr}`),
  body("bio").trim().isLength({ max: 200 }),
];

const validateSearch = [
  body("name")
    .trim()
    .isAlpha()
    .withMessage(`Name ${alphaErr}`)
    .isLength({ min: 3, max: 21 })
    .withMessage("needs to be right length")
    .toLowerCase(),
];

exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    UsersStorage.addUser({ firstName, lastName, email, age, bio });
    res.redirect("/");
  },
];

exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: UsersStorage.getUsers(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};

// exports.usersCreatePost = (req, res) => {
//   const { firstName, lastName, email, age, bio } = req.body;
//   UsersStorage.addUser({ firstName, lastName, email, age, bio });
//   res.redirect("/");
// };

exports.usersUpdateGet = (req, res) => {
  const user = UsersStorage.getUser(req.params.id);
  res.render("updateUser", {
    title: "Update user",
    user: user,
  });
};

exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = UsersStorage.getUser(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: "Update user",
        user: user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    UsersStorage.updateUser(req.params.id, {
      firstName,
      lastName,
      email,
      age,
      bio,
    });
    res.redirect("/");
  },
];

exports.usersSearchGet = (req, res) => {
  const searchData = req.flash("user");
  const user = UsersStorage.getUserBySearch(searchData);
  // console.log("name: ", name, "email ", email);
  res.render("search", {
    title: "Search",
    user,
  });
};

exports.usersSearchPost = [
  validateSearch,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("index", {
        title: "User List",
        users: UsersStorage.getUsers(),
        errors: errors.array(),
      });
    }
    const { name, email } = req.body;
    const user = { name, email };
    req.flash("user", user);
    res.redirect("search");
  },
];

exports.usersDeletePost = (req, res) => {
  UsersStorage.deleteUser(req.params.id);
  res.redirect("/");
};

// TODO: search post
