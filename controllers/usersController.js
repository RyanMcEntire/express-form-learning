const asyncHandler = require("express-async-handler");
const UsersStorage = require("../storages/UsersStorage");
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const emailErr = "must be a valid email";
const rangeErr = "must be between 18 and 120";
const emptyErr = "must not be empty";

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email ${emptyErr}`)
    .isEmail()
    .withMessage(`Email ${emailErr}`),
  body("age").trim().isInt({ min: 18, max: 20 }).withMessage(`Age ${rangeErr}`),
  body("bio").trim().isLength({ max: 200 }),
  body()
    .trim()
    .custom(async (value, { req }) => {
      console.log("Custom validator triggered");
      console.log("Request body:", req.body);

      const user = UsersStorage.findUserByName({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });

      if (user) {
        throw new Error("User already exists");
      }
      return true;
    }),
];

const validateSearch = [
  body("name")
    .trim()
    .isAlpha()
    .withMessage(`Name ${alphaErr}`)
    .isLength({ min: 3, max: 21 })
    .withMessage("needs to be right length"),
];

exports.usersCreatePost = [
  validateUser,
  asyncHandler(async (req, res) => {
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
  }),
];

exports.usersListGet = asyncHandler(async (req, res) => {
  res.render("index", {
    title: "User list",
    users: UsersStorage.getUsers(),
  });
});

exports.usersCreateGet = asyncHandler(async (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
});

exports.usersCreatePost = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, age, bio } = req.body;
  UsersStorage.addUser({ firstName, lastName, email, age, bio });
  res.redirect("/");
});

exports.usersUpdateGet = asyncHandler(async (req, res) => {
  const user = UsersStorage.getUser(req.params.id);
  res.render("updateUser", {
    title: "Update user",
    user: user,
  });
});

exports.usersUpdatePost = [
  validateUser,
  asyncHandler(async (req, res) => {
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
  }),
];

exports.usersSearchGet = [
  asyncHandler(async (req, res) => {
    const searchData = req.flash("user");
    const user = UsersStorage.getUserBySearch(searchData);
    // console.log("name: ", name, "email ", email);
    res.render("search", {
      title: "Search",
      user,
    });
  }),
];

exports.usersSearchPost = [
  validateSearch,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const { name, email } = req.body;
    const user = { name, email };
    req.flash("user", user);
    res.redirect("search");
  }),
];

exports.usersDeletePost = asyncHandler(async (req, res) => {
  UsersStorage.deleteUser(req.params.id);
  res.redirect("/");
});

// TODO: search post
