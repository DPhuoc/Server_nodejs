import db from '../models/index'
import bcrypt from 'bcryptjs'

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}

            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exists
                let user = await db.User.findOne({
                    attributes: ['email', 'password', 'roleId'],
                    where: { email: email },
                    raw: true,
                })
                if (user) {
                    let check = bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong Password!'
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User not found!`
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your Email isn't exist in your system. Plz try other email!`
            }
            resolve(userData);
        } catch (err) {
            reject(err)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail}
            })

            if (user) {
                resolve(true);
            } else {
                resolve(false)
            }
        } catch (err) {
            reject(err);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
}