const bcrypt = require("bcrypt");

const password = process.argv[2]; // Le mot de passe sera passé en argument

if (!password) {
  console.error("Veuillez fournir un mot de passe en argument");
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log("Mot de passe hashé :");
  console.log(hash);
});
