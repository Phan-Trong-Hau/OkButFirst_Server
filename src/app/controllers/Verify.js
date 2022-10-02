import bcrypt from "bcrypt";

import accounts from "../models/account.js";
import verification from "../models/verification.js";

class VerifyController {
    // [GET] /login
    get(req, res) {
        res.send("Get router verify");
    }

    // [POST] /login
    post(req, res) {}

    getSlug(req, res) {
        const { userId, uniqueString } = req.params;
        verification
            .findOne({ userId })
            .then((data) => {
                if (data) {
                    const { expiresAt } = data;
                    const hashUniqueString = data.uniqueString;

                    if (expiresAt < Date.now()) {
                        verification
                            .deleteOne({ userId })
                            .then((data) => {
                                accounts
                                    .deleteOne({ _id: userId })
                                    .then((data) =>
                                        res.send(
                                            "Đường dẫn đã hết hạn. Vui lòng đăng ký lại"
                                        )
                                    )
                                    .catch((err) =>
                                        res.send(
                                            "Có lỗi trong quá trình xóa tài khoản hết hạn"
                                        )
                                    );
                            })
                            .catch((err) =>
                                res.send(
                                    "Có lỗi trong quá trình xóa dữ liệu xác thực tài khoản hết hạn"
                                )
                            );
                    } else {
                        bcrypt
                            .compare(uniqueString, hashUniqueString)
                            .then((data) => {
                                if (data) {
                                    accounts.updateOne(
                                        { _id: userId },
                                        { verified: true }
                                    )
                                    .then(data=>{
                                        verification
                                            .deleteOne({ userId })
                                            .then((data) =>
                                                res.send(
                                                    "Bạn đã xác thực email thành công."
                                                )
                                            ).catch(err=>res.send('Lỗi trong quá trình xóa user id'))
                                    })
                                    .catch(err=>res.send('Lôi trong quá trình xác thực email'))
                                } else {
                                    res.send('Xác thực email không thành công');
                                }
                            })
                            .catch((err) =>
                                res.send(
                                    "Có lỗi trong quá trình phiên dịch dữ liệu "
                                )
                            );
                    }
                }else {
                    res.send('Không tìm thấy tài khoản cần xác thực!!!')
                }
            })
            .catch((err) => res.send("Lỗi trong quá trình tìm id người dùng!!!"));
    }
}

export default new VerifyController();
