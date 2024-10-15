const userModel = require("../models/userModel.js");
const mongoose = require("mongoose");
const process = require("process");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// create a new user
const createUser = async (req, res) => {
  const { email, password } = req.body;

  let emptyFields = [];

  if (!email) {
    emptyFields.push("email");
  }
  if (!password) {
    emptyFields.push("password");
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  try {
    // Instanciation du modèle UserModel avec l'email fourni.
    const user = new userModel({ email, password });

    await user.valid(email, password);

    // Hachage du mot de passe à l'aide de la méthode createHash et stockage du résultat dans user.password.
    user.password = await user.createHash(password);

    //create a token
    const token = createToken(user._id);

    // Sauvegarde de l'instance de l'utilisateur dans la base de données.
    // La méthode save est asynchrone, nécessitant l'utilisation de await pour assurer que
    // l'opération se complète avant de continuer.
    await user.save();

    // Réponse avec le statut 200 et l'objet utilisateur en JSON si la sauvegarde est réussie.
    res.status(200).json({ email: email, token: token });
  } catch (error) {
    // En cas d'erreur lors de la création ou la sauvegarde de l'utilisateur,
    // renvoie une réponse avec le statut 400 et le message d'erreur.
    res.status(400).json({ error: error.message });
  }
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  let emptyFields = [];

  if (!email) {
    emptyFields.push("email");
  }
  if (!password) {
    emptyFields.push("password");
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    try {
      const passwordIsValid = await user.verifyPassword(password);
      if (!passwordIsValid) {
        return res.status(401).json({ error: "Invalid password" });
      }
    } catch (error) {
      return res.status(401).json({ error: "Invalid password" });
    }

    //create a token
    const token = createToken(user._id);
    res.status(200).json({
      message: "Logged in successfully",
      id: user._id,
      email: user.email,
      user: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all users
const getUsers = async (req, res) => {
  const users = await userModel.find({}).sort({ createdAt: -1 });

  res.status(200).json(users);
};

// get a single user
const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const user = await userModel.findById(id);

  if (!user) {
    return res.status(400).json({ error: "No such user" });
  }

  res.status(200).json({ error: "User found" });
};

// delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const user = await userModel.findOneAndDelete({ _id: id });

  if (!user) {
    return res.status(400).json({ error: "No such user" });
  }

  res.status(200).json(user);
};

// update a user
const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!user) {
    return res.status(400).json({ error: "No such wouserrkout" });
  }

  res.status(200).json(user);
};

module.exports = { loginUser, createUser, getUsers, getUser, deleteUser, updateUser };
