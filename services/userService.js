const { User } = require('../models');
const hashPassword = require('../utils/hash-password');

const userService = {
	// 사용자 생성 (회원가입)
	async createUser({ email, password, name, nickName }) {
		const hashedPassword = hashPassword(password); // 비밀번호 해쉬값 만들기
		const createdUser = await User.create({
			email,
			password: hashedPassword,
			name,
			nickName,
		});
		return createdUser;
	},
	// 사용자 정보 조회
	async getUser(email) {
		const user = await User.findOne({ email });
		return user;
	},
	async getUserpassword(email) {
		const user = await User.findOne({ email }, 'password');
		return user;
	},
	async getUserFromNickName(nickName) {
		const user = await User.findOne({ nickName });
		return user;
	},
	async getUserFromEmail(email) {
		const user = await User.findOne({ email });
		return user;
	},
	async getUserForToken(email) {
		const user = await User.findOne(
			{ email },
			{
				nickName: 1,
				name: 1,
				email: 1,
				profileImage: 1,
				isAdmin: 1,
				isTempPassword: 1,
			}
		);
		return user;
	},
	async getUserRefreshToken(email) {
		const user = await User.findOne({ email }, 'refreshToken');
		return user;
	},
	// 사용자 정보 수정
	async updateUser(email, user) {
		const { nickName, name, intro, mbti, job, state } = user;
		//성공여부, 조건에 맞는 문서의 수, 새로 생성된 문서의 수, 새로 생성된 문서의 id값이 들어있음
		const result = await User.updateOne(
			{ email },
			{
				name,
				nickName,
				intro,
				mbti,
				job,
				state,
			}
		);
		if (result.modifiedCount === 0) {
			console.log('변경사항이 없습니다.');
		}
		console.log(result);
		return {
			message: `요청: ${result.acknowledged}, 요청된 문서의 수: ${result.modifiedCount}`,
		};
	},
	async updateProfileImage(email, profileImage) {
		const result = await User.updateOne(
			{ email },
			{
				profileImage,
			}
		);
		return {
			message: `요청: ${result.acknowledged}, 요청된 문서의 수: ${result.modifiedCount}`,
		};
	},
	async updatePasswordFromEmail(email, tempPassword) {
		const result = await User.updateOne(
			{ email },
			{
				password: hashPassword(tempPassword),
				isTempPassword: true,
			}
		);
		return {
			message: `요청: ${result.acknowledged}, 요청된 문서의 수: ${result.modifiedCount}`,
		};
	},
	async updatePasswordFromemail(email, password) {
		const result = await User.updateOne(
			{ email },
			{
				password: hashPassword(password),
				isTempPassword: false,
			}
		);
		return {
			message: `요청: ${result.acknowledged}, 요청된 문서의 수: ${result.modifiedCount}`,
		};
	},
	// 사용자 삭제 (회원탈퇴)
	async deleteUser(email) {
		await User.updateOne({ email }, { $set: { state: false } });
		return { message: '계정이 탈퇴 되었습니다.' };
	},
	async realDeleteUser(email) {
		const deleteResult = await User.deleteOne({ email });
		console.log(deleteResult);
		return { message: '계정이 영구삭제 되었습니다.' };
	},

	//특정 사용자 조회
	async adminReadSearchUser(email) {
		const user = await User.findOne({ email });
		return user;
	},
	//관리자 - 사용자 전체 정보 조회
	async adminReadUser(page) {
		const total = await User.countDocuments({});
		const userlist = await User.find({ isAdmin: false })
			.sort({ name: 1 })
			.skip(7 * (page - 1))
			.limit(7);
		return [userlist, { total: total }];
	},
	// 관리자 - 답변 삭제
	async adminDeleteAnswer(answerId) {
		const deleteResult = await User.deleteOne({ answerId });
		console.log(deleteResult);
		return { message: '답변이 삭제 되었습니다.' };
	},
};

module.exports = userService;