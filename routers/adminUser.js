const { Router } = require('express');
const adminUserRouter = Router();
const { userController,adminController } = require('../controller/index');
const getUserFromJwt = require('../middlewares/getUserFromJwt');
const { authAdmin } = require('../middlewares/index');

//ADNIM 유저 전체 조회
adminUserRouter.get('/', getUserFromJwt, authAdmin, userController.adminGetUserlist);

//ADNIM 경고 메일 발송
adminUserRouter.post('/warning',getUserFromJwt, authAdmin, userController.adminsendEmail);

//ADNIM 유저 프로필 사진 수정
adminUserRouter.put('/profileImage/:email',getUserFromJwt, authAdmin, userController.adminPutProfileImage);

//ADNIM 유저 정보 수정
adminUserRouter.put('/:email',getUserFromJwt, authAdmin, userController.adminUpdateUser);

//ADNIM 유저 휴면 전환
adminUserRouter.delete('/:email', getUserFromJwt, authAdmin, userController.adminDeleteUser);

//ADNIM 유저 정보 진짜 삭제
adminUserRouter.delete('/delete/:email', userController.adminDeleteUser);

//ADMIN 답변 전체 조회
adminUserRouter.get('/:answerId', getUserFromJwt, authAdmin, userController.adminDeleteAnswer);

//ADMIN 신고된 답변 조회
adminUserRouter.get("/complaint", getUserFromJwt, authAdmin, userController.adminGetComplaint);


module.exports = adminUserRouter;
