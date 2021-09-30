import { MyRequestListener } from 'types';
import { login } from '../controller/user';
import { ErrorModel, SuccessModel } from '../model/resModel';
import { setSession } from '../db/redis';

type ReturnType = Promise<SuccessModel | ErrorModel> | undefined;

interface BodyType {
    username: string;
    password: string;
}

export const handleUserRouter: MyRequestListener<ReturnType, BodyType> = (req, res) => {
    const method = req.method; // GET POST

    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body ?? {};
        // const { username, password } = req.query ?? {};
        console.log('req.body', req.body);
        console.log(username, password);
        const result = login(username, password);
        return result.then(userInfo => {
            // 判断 username 是否有值
            if (userInfo.username) {
                // 设置 session
                if (req.session) {
                    // 有该属性就覆盖为新的，没有就设置
                    req.session.username = userInfo.username;
                    req.session.realname = userInfo.realname;
                    setSession(req.sessionID, req.session);
                }
                console.log('session: ', req.session);
                return new SuccessModel();
            } else return new ErrorModel('登录失败');
        });
    }

    // // 登录验证的测试
    // if (method === 'GET' && req.path === "/api/user/login-test") {
    //     if (req.session?.username) return Promise.resolve(new SuccessModel({
    //         session: req.session
    //     }));
    //     return Promise.resolve(new ErrorModel("尚未登录"));
    // }
};
