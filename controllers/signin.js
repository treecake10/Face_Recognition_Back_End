const handleSignin = async (req, res, db, bcrypt) => {

  const { email, password } = req.body;
  
  try {

    if (!email || !password) {
      return res.status(400).json('incorrect form submission');
    }

    const data = await db.select('email', 'hash').from('login').where('email', '=', email);

    if (data.length > 0) {

    	const isValid = bcrypt.compareSync(password, data[0].hash);

	    if (isValid) {

	      return db.select('*').from('users').where('email', '=', email)
	      .then(user => {
	      	res.json(user[0]);
	      })
	      
	    } else {
	      res.status(400).json('wrong credentials');
	    }

    } else {
      res.status(400).json('user not found');
    }
    
  } catch (err) {
    res.status(500).json('Internal Server Error');
  }

};

module.exports = {
  handleSignin: handleSignin
};
