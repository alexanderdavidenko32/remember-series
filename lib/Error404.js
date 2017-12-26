/**
 * Created by Alexander Davidenko
 * @date 12/5/17.
 */
class Error404 extends Error {
    constructor(text) {
        super();

        this.text = text;
    }
}

module.exports = Error404;