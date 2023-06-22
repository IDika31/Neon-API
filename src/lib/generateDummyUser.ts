import connectDB from '../../app/database/mongo.db'
import user from '../../app/models/UserModel';

(async () => {
    await connectDB();
    const dummyUser = new user({
        username: 'IDika',
        password: 'AndikaP317@#',
        email: 'idikanugraha@gmail.com'
    });

    await dummyUser.save();
})()