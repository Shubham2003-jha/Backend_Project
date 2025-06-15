import mongoose,{ Schema } from 'mongoose';

const subscriptionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    channel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{timestamps:true});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
