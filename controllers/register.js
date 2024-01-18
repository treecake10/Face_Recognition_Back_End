const handleRegister = async (req, res, db, bcrypt) => {

	const { email, name, password } = req.body;

	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission');
	}
	
	const hash = bcrypt.hashSync(password);

	try {

      const user = await db.transaction(async (trx) => {

	      const loginEmail = await trx
	        .insert({
	          hash: hash,
	          email: email,
	        })
	        .into('login')
	        .returning('email');

	      const registeredUser = await trx('users')
	        .returning('*')
	        .insert({
	          email: loginEmail[0].email,
	          name: name,
	          joined: new Date(),
	        })
	        .then(usr => {
	           res.json(usr[0]);
	        })

      	  return registeredUser;

       });

    } catch (error) {
       console.error("Error:", error);
       res.status(400).json('Unable to register');
    }

}

module.exports = {
	handleRegister: handleRegister
}