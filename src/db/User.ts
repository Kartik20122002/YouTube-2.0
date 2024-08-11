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
        required: true,
    },
    history: {
        type: String,
        defaultValue: JSON.stringify([]),
    },
    playlists:{
        type : String,
        defaultValue: JSON.stringify([]),
    }
});

const User = models?.user || model('user', UserScheme);

export default User;