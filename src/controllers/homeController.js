
const {searchContacts} = require('../models/ContactModel')
exports.index = async (req, res) => {
  const contacts = await searchContacts()
  res.render("index",{contacts});
  
};

