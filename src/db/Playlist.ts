import { Schema, model, models } from "mongoose"

const PlaylistScheme = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    thumbnail:{
        type : String,
        defaultValue : 'https://i.ytimg.com/img/no_thumbnail.jpg'
    },
    updatedAt: {
        type: String,
        defaultValue : Date.now()
    },
    items : {
        type : String,
        defaultValue : JSON.stringify([]),
    }
});

const Playlist = models?.playlist || model('playlist', PlaylistScheme);

export default Playlist;