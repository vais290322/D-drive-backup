const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CSRBlogSchema = new Schema({
    abstract: {
        type: String,
        required: true
    },
    details: [
        {
            heading: {
                type: String,
                required: true
            },
            content: {
                type: String,
            },
            subDetails: [
                {
                    subHeading: {
                        type: String,
                        required: true
                    },
                    subContent: {
                        type: String,
                    
                    }
                },
            ]
        },
    ],
    references: [
        {
            title: {
                type: String,
                required: true
            },
            link: {
                type: String,
            }
        },
    ],
},{
    timestamps: true,
});

module.exports = mongoose.model('CSRBlog', CSRBlogSchema, 'csrblog');