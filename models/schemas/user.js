const { Schema } = require('mongoose');
const UserSchema = new Schema(
	{
		nickName: {
			type: String,
			required: true,
		},
		name: {
			type: String,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		mbti: {
			type: String,
			default: null,
		},
		job: {
			type: String,
			default: null,
		},
		intro: {
			type: String,
			default: null,
		},
		profileImage: {
			type: String,
			default: 'http://localhost:5000/defaultImage.png',
		},
		experience: {
			type: Number,
			default: 1,
		},
		refreshToken: {
			type: String,
			select: false,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		isTempPassword: {
			type: Boolean,
			default: false,
		},
		state: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: false }
);

module.exports = UserSchema;