const bcrypt = require('bcrypt');

bcrypt.hash('chrif1206', 10).then(hash => {
    const hashedPassword = hash;
    console.log(hashedPassword);
});
