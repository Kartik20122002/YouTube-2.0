import { Schema, model, models } from "mongoose"

const UserScheme = new Schema({
    id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    rToken: {
        type: String,
        required: true
    },
    tokenTime: {
        type: Number,
        returns: true,
    }
});

const User = models.user || model('user', UserScheme);

export default User;