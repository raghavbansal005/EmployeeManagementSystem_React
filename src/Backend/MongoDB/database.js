const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/EmployeeData', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
}); 

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    tel: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const createnewUser = async (username, tel, email, password)=>{
    const newUser = new User({username, tel, email, password});
    try{
        await newUser.save();
        console.log("User created");
    }
    catch (error){
        console.log("Error", error);
    }
}

module.exports = {User, createnewUser}