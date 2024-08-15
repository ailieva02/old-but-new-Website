class ResponseModel {
    success;
    status;
    message;
    data;

    constructor () {
        this.status = 500;
    }
}

module.exports = ResponseModel