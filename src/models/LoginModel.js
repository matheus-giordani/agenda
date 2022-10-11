const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async register() {
    this._valida();
    if (this.errors.length > 0) return;

    await this.userExists();

    if (this.errors.length) {
      console.log("teste");
    } else {
      const salt = bcrypt.genSaltSync();
      this.body.password = bcrypt.hashSync(this.body.password, salt);
      

      this.user = await LoginModel.create(this.body);
    }
    return;

    
  }
  async userExists() {
    this.user = await this.getEmail();
    console.log(this.user)
    if (this.user) {
      this.errors.push("user already created");
      return "error";
    }
    return "funfou";
  }

  _valida() {
    this._cleanUp();

    if (!validator.isEmail(this.body.email)) {
      this.errors.push("E-mail is invalid");
    }

    if (this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push("Password must be between 3 to 50 characters");
    }
  }

  _cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }
    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }

  async getEmail(){
    return LoginModel.findOne({ email: this.body.email });
  }

 async login(){
  this._valida()
  if(this.errors.length)return;
  this.user = await this.getEmail();
  // avaliação de curto circuito
  if(!this.user){
    this.errors.push('User or password invalid')
    return
  }
  if(!bcrypt.compareSync(this.body.password,this.user.password)){
    this.errors.push('User or password invalid')
    this.user = null
    return
  }

  }
}

module.exports = Login;
