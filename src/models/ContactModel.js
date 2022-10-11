const mongoose = require('mongoose');
const validator = require('validator')


const ContactSchema = new mongoose.Schema({
    name:{ type: String , required: true},
    surname:{ type: String , required: false, default: ''},
    email:{ type: String , required: true, default: ''},
    phone:{ type: String , required: true, default: ''},
    createIn:{ type: Date, default: Date.now}
    
}); 

const ContactModel = mongoose.model('Contact', ContactSchema)

searchContactForId = async (id) => {
  if(typeof id !== 'string') return;
  const contact = await ContactModel.findById(id)
  return contact

}
searchContacts = async () => {
  const contacts = await ContactModel.find().sort({createIn: -1 })
  return contacts

}
deleteContact = async (id) => {
  if(typeof id !== 'string') return;
  const contact = await ContactModel.findOneAndDelete(id)
  return contact

}
class Contact {
    constructor(body){
        this.body = body 
        this.errors = []
        this.contact = null
    }

    async register(){
        this._valida()
        if(!this.errors.length){
         this.contact = await ContactModel.create(this.body)
        }
        else{
            this.contact = null
        }
    }

    _valida() {
        this._cleanUp();
        console.log(this.body)
    
        if (this.body.email && !validator.isEmail(this.body.email)) {
          this.errors.push("E-mail is invalid");
        }
        if(!this.body.email && !this.body.phone){
            this.errors.push("At least one contact must be sent. email or phone");
            
        }
        
    
        
    }

    _cleanUp() {
        for (const key in this.body) {
          if (typeof this.body[key] !== "string") {
            this.body[key] = "";
          }
        }
        this.body = {
          name: this.body.name,
          surname: this.body.surname,
          phone: this.body.phone,
          email: this.body.email,
        };
      }

     async edit(id){
      if(typeof id !== 'string')return 
      this._valida()
      if(this.errors.length)return
      this.contact = await ContactModel.findByIdAndUpdate(id, this.body, {new:true})
      }

      
}

module.exports.Contact = Contact
module.exports.searchContactForId = searchContactForId
module.exports.deleteContact = deleteContact
module.exports.searchContacts = searchContacts