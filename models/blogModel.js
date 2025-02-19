const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: "Admin"
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    numViews: {
        type: Number,
        default: 0
    },
    isLiked: {
        type: Boolean
    },
    isDisliked: {
        type: Boolean
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    image: {
        type: String,
        default: "https://dribbble.com/shots/24706602-Shoe-website-landing-page-UI-UX-Design"
    }
}, 
{
    timestamps: true,

    toJSON: {
        virtuals: true  
    },
    toObject: {
        virtuals: true 
    }
});


blogSchema.virtual("likeCount").get(function() {
    return this.likes.length;
});

// Create a model
const BlogModel = mongoose.model("Blog", blogSchema);

module.exports = BlogModel;
