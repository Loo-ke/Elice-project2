const { Answer,Like,Comment } = require('../models');


const AnswerService = {
	// 답변 생성
	// async createAnswer(nickName,{  content,reportCount,stateCode,  createdAt }) {
	// 	const createdAnswer = await Answer.create(,{ content,reportCount,stateCode,  createdAt });
	// 	return createdAnswer;
	// },
	async createAnswer( { nickName,questionId, content,reportCount,stateCode,  createdAt }) {
    const newAnswer = new Answer({
			questionId,
        nickName,
        content,
				stateCode,
        createdAt: new Date(),
        updatedAt: new Date(),
        reportCount: 0,
    });

    const savedAsnwer = await newAnswer.save();
    return savedAsnwer;
	},
	
	async getDetailAnswers (questionId, answerId,nickName) {
		try {
			const answers = await Answer.find({ _id:answerId });
			const likeCount = await Like.countDocuments({ answerId });
			  // 좋아요 정보 조회
				const like = await Like.findOne({ answerId });

				// 좋아요 여부를 나타내는 flag
				const isLiked = like && like.like.some((item) => item.nickName === nickName);
				const comments = await Comment.find({ answerId });
			console.log(likeCount);
			console.log(`질문 ID(${answerId})에 대한 답변 상세를 가져왔습니다.`);
			return {answers,likeCount,isLiked,comments};
		} catch (error) {
			console.error('답변 가져오기 중 오류 발생:', error);
			throw error;
		}
	},

	async getAnswersByQuestionId  (questionId) {
		try {
			const answers = await Answer.find({ questionId,stateCode: true });
			console.log(`질문 ID(${questionId})에 대한 전체 공개 답변을 가져왔습니다.`);
			return answers;
		} catch (error) {
			console.error('답변 가져오기 중 오류 발생:', error);
			throw error;
		}
	},

	async getAnswersByQuestionIdAll  (questionId) {
		try {
			const answers = await Answer.find({ questionId});
			const reportCount = Answer.reportCount;
			console.log(`질문 ID(${questionId})에 대한 모든 답변을 가져왔습니다.`);
			return {answers,reportCount};
		} catch (error) {
			console.error('답변 가져오기 중 오류 발생:', error);
			throw error;
		}
	},


	// 친구 공개 게시글을 조회하는 함수
	async  getFriendAnswers(questionId) {
			// const answers = await Answer.find({ stateCode: false })
			const answers = await Answer.find({ questionId, stateCode: false });
			console.log(`질문 ID(${questionId})에 대한 친구공개 답변을 가져왔습니다.`);
			return answers;


			// .populate('nickName'); // stateCode가 false인 글을 조회하고, 작성자 정보를 가져옵니다.
			return answers;
},


	async reportAnswer(answerId) {

		const answer = await  Answer.findById(answerId);

		if (!answer) {
			return res.status(404).json({ message: '답변을 찾을 수 없습니다.' });
		}
		// 신고 횟수 증가
		answer.reportCount += 1;
	
		// 답변 저장
		await answer.save();

		return {message: '답변이 수정 되었습니다.', answer:answer };
	},
  //answerId를 사용해 답변 수정
  async updateAnswer(answerId, updateData) {
    const option = { new: true };

    const updateAnswer = await Answer.updateOne(
			{_id: answerId}, updateData, option);
    return {message: '답변이 수정 되었습니다.', answer:updateAnswer };
  },
	// 답변 삭제
	async deleteAnswer(answerId) {
		const deleteResult = await Answer.deleteOne({_id: answerId});
		console.log(deleteResult);
		return {message: '답변이 삭제 되었습니다.', answer:deleteResult };
	},
};

module.exports = AnswerService;
