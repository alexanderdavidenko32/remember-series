/**
 * Created by Alexander Davidenko
 * @date 12/17/17.
 */

class Helper {
    static getCreatorCondition (path, req) {
        let itemOne = {},
            itemTwo = {};

        itemOne[path] = this.getAdminId();
        itemTwo[path] = this.getUserId(req);

        return [
            itemOne,
            itemTwo
        ]
    }

    static getUserId (req) {
        return req.user && req.user.id || '';
    }

    static getAdminId () {
        // TODO: move admin id
        return 'admin@admin.admin';
    }
}

module.exports = Helper;