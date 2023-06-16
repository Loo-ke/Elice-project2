const { Answer, Like, Comment, User, Friend } = require("../models");

const AnswerService = {
	// 답변 생성
	// async createAnswer(nickName,{  content,reportCount,stateCode,  createdAt }) {
	// 	const createdAnswer = await Answer.create(,{ content,reportCount,stateCode,  createdAt });
	// 	return createdAnswer;
	// },
	async createAnswer({
		nickName,
		questionId,
		content,
		reportCount,
		stateCode,
		createdAt,
		profileImage,
	}) {
		const newAnswer = Answer.create({
			questionId,
			nickName,
			content,
			stateCode,
			createdAt: new Date(),
			updatedAt: new Date(),
			reportCount: 0,
			profileImage,
		});

		// const savedAsnwer = await newAnswer.save();
		return newAnswer;
	},

	async getDetailAnswers(questionId, answerId, nickName) {
		try {
			const answers = await Answer.find({ _id: answerId });
			// const likeCount = await Like.countDocuments({ answerId,nickName });
			// 좋아요 정보 조회
			const like = await Like.findOne({ answerId:answerId });
			console.log("like",like);
			console.log("서비스에서 answerId",answerId);
    	const likeCount = like && like.like ? like.like.length : 0;

			// 좋아요 여부를 나타내는 flag
			// const isLiked = like && like.like && like.like.some((item) => item.nickName === nickName);
			let isLiked = false;
			if (like && like.like) {
				isLiked = like.like.some((item) => item.nickName === nickName);
			}
			
			console.log("좋아요 눌렀나?", isLiked);
			const comments = await Comment.find({ answerId });
			console.log(`질문 ID(${answerId})에 대한 답변 상세를 가져왔습니다.`);
			return { answers, likeCount, isLiked, comments };
		} catch (error) {
			console.error("답변 가져오기 중 오류 발생:", error);
			throw error;
		}
	},

	async getAnswer(answerId) {
		try {
			const answers = await Answer.find({ answerId });
			return answers;
		} catch (error) {
			console.error("답변 가져오기 중 오류 발생:", error);
			throw error;
		}
	},

	async getAnswersByQuestionId(questionId, limit, skip) {
		try {
			const answerCount = await Answer.find({questionId}).countDocuments({});
			console.log(answerCount);
			const answers = await Answer.find({ questionId })
			.sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
			console.log(
				`질문 ID(${questionId})에 대한 전체 공개 답변을 가져왔습니다.`
			);
			return answers;
		} catch (error) {
			console.error("답변 가져오기 중 오류 발생:", error);
			throw error;
		}
	},

	async getProfileImage(nickName) {
		const user = await User.findOne({ nickName });
		return user.profileImage;
	},

	async getAnswersByQuestionIdAll(questionId) {
		try {
			const answers = await Answer.find({ questionId });
			const reportCount = Answer.reportCount;
			console.log(`질문 ID(${questionId})에 대한 모든 답변을 가져왔습니다.`);
			return { answers, reportCount };
		} catch (error) {
			console.error("답변 가져오기 중 오류 발생:", error);
			throw error;
		}
	},
	// 전체 공개 게시글을 조회하는 함수
	async getPublicAnswers(questionId) {
		// const answers = await Answer.find({ stateCode: false })
		const answers = await Answer.find({ questionId, stateCode: true });
		console.log(`질문 ID(${questionId})에 대한 전체공개 답변을 가져왔습니다.`);
		return answers;
		// .populate('nickName'); // stateCode가 false인 글을 조회하고, 작성자 정보를 가져옵니다.
	},

	// 친구 공개 게시글을 조회하는 함수
	async getFriendAnswers(questionId) {
		// const answers = await Answer.find({ stateCode: false })
		const answers = await Answer.find({ questionId, stateCode: false });
		console.log(`질문 ID(${questionId})에 대한 친구공개 답변을 가져왔습니다.`);
		return answers;
		// .populate('nickName'); // stateCode가 false인 글을 조회하고, 작성자 정보를 가져옵니다.
	},

	async getFriendOfFriendAnswers(questionId, nickName, email) {
		const friend = await Friend.findOne({ email, nickName });
		console.log("내 닉네임 =", nickName);
		console.log("내 친구들 =", friend);

		if (!friend) {
			throw new Error("친구 정보를 찾을 수 없습니다.");
		}

		const friendNicknames = friend.friends.map((friend) => friend.nickName);
		friendNicknames.push(nickName);
		console.log("friendNicknames", friendNicknames);

		const friendOfFriendAnswers = await Answer.find({
			questionId,
			nickName: { $in: friendNicknames },
			stateCode: false && true,
		});

		return friendOfFriendAnswers;
	},

	async reportAnswer(answerId) {
		const answer = await Answer.findById(answerId);

		if (!answer) {
			return "답변을 찾을 수 없습니다.";
		}
		// 신고 횟수 증가
		answer.reportCount += 1;

		// 답변 저장
		return await answer.save();
	},
	//answerId를 사용해 답변 수정
	async updateAnswer(answerId, updateData) {
		const option = { new: true };

		const updateAnswer = await Answer.updateOne(
			{ _id: answerId },
			updateData,
			option
		);
		return { message: "답변이 수정 되었습니다.", answer: updateAnswer };
	},
	// 답변 삭제
	async deleteAnswer(answerId) {
		const deleteResult = await Answer.deleteOne({ _id: answerId });
		console.log(deleteResult);
		return { message: "답변이 삭제 되었습니다.", answer: deleteResult };
	},
};

module.exports = AnswerService;
