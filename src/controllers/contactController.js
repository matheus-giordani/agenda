const { async } = require("regenerator-runtime");
const {
  Contact,
  searchContactForId,
  deleteContact,
} = require("../models/ContactModel.js");

exports.index = (req, res) => {
  res.render("contact", {
    contact: {},
  });
};

exports.register = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.register();
    if (contact.errors.length) {
      req.flash("errors", contact.errors);
      return res.redirect("/contact/index");
    } else {
      req.flash("success", "Created contact");
      req.session.save(() => {
        return res.redirect(`/`);
      });
    }
  } catch (err) {
    console.log(err);
    return res.render("404");
  }
};

exports.editIndex = async (req, res) => {
  if (!req.params.id) return res.render("404");
  const contact = await searchContactForId(req.params.id);
  if (!contact) return res.render("404");
  res.render("contact", {
    contact,
  });
};

exports.edit = async (req, res) => {
  try {
    if (!req.params.id) return res.render("404");
    const contact = new Contact(req.body);
    await contact.edit(req.params.id);
    if (contact.errors.length) {
      req.flash("errors", contact.errors);
      return res.redirect("/contact/index");
    } else {
      req.flash("success", "Edit contact");
      req.session.save(() => {
        return res.redirect(`/`);
      });
    }
  } catch (err) {
    console.log(err);
    return res.render("404");
  }
};

exports.delete = async (req, res) => {
  if (!req.params.id) return res.render("404");

  const contact = await deleteContact(req.params.id);
  if (!contact) return res.render("404");
  req.flash("success", "Deleted contact");
  req.session.save(() => {
    return res.redirect(`/`);
  });
};
