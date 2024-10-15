const mongoose = require("mongoose");
const argon2 = require("argon2");
const validator = require("validator");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an Email!"],
      unique: [true, "Email Exist"],
    },

    password: {
      type: String,
      required: [true, "Please provide a password!"],
      unique: false,
    },
  },
  { timestamps: true }
);

// Méthode createHash : hache le mot de passe fourni en utilisant l'algorithme argon2d.
// @param password - Le mot de passe en clair à hacher.
// @returns - Le mot de passe haché ou null en cas d'erreur.
UserSchema.methods.createHash = async function (password) {
  try {
    const hash = await argon2.hash(password, { type: argon2.argon2d });
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
  }
};

UserSchema.methods.verifyPassword = async function (password) {
  const isCorrect = await argon2.verify(this.password, password);
  if (!isCorrect) {
    throw Error("error verifying password : ");
  }
  return isCorrect;
};

// La méthode valid ne contient pas de bloc try...catch car nous souhaitons que les erreurs se propagent.
// Cela permet de bloquer l'exécution dans le contrôleur si une erreur est levée ici.
UserSchema.methods.valid = async function (email, password) {
  if (!email || !password) {
    throw Error("All field must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw Error("Password not strong enough");
  }
};

module.exports = mongoose.model("User", UserSchema);
