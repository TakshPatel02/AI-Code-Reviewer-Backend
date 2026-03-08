import { Schema, model } from 'mongoose';

const codeSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    review: {
        type: String,
        default: null
    }
}, { timestamps: true });

const Code = model('Code', codeSchema);

export default Code;