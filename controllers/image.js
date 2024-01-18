const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: process.env.API_KEY,
});

const handleApiCall = async (req, res) => {

  try {
    const data = await app.models.predict('face-detection', req.body.input);
    res.json(data);
  } catch (err) {
    res.status(400).json('unable to work with API');
  }

};

const handleImage = async (req, res, db) => {

  const { id } = req.body;

  try {
    const entries = await db('users')
      .where('id', '=', id)
      .increment('entries', 1)
      .returning('entries')
      .then(entries => {
        res.json(entries[0].entries);
      })
  } catch (err) {
    res.status(400).json('unable to get entries');
  }
  
};

module.exports = {
  handleImage,
  handleApiCall,
};
