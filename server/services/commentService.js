const connection = require('../dbConn');
const ResponseModel = require('../models/responseModel');
const CommentModel = require('../models/commentModel');
const postService = require('../services/postService');
const userService = require('../services/userService');
const { response } = require('express');

const getAllComments = () => {
    return new Promise((resolve, reject) => {
        const response = new ResponseModel();

        connection.query("SELECT * FROM Comment", (error, results) => {
            if (error) {
                response.success = false;
                response.message = `Error querying the database: ${error}`;

                reject(response);
            } else {
                response.status = 200;
                response.success = true;
                response.data = results;

                if (results.length === 0) {
                    response.message = 'No comments were found!';
                } 

                resolve(response);
            }
        });
    }).catch((error) => {
        if (error instanceof ResponseModel) {
            return error;
        } else {
            const response = new ResponseModel();
            response.message = error;
            response.success = false;
            return response;
        }
    });
};

const getAllCommentsByPostId = (post_id) => {
    return new Promise((resolve, reject) => {
        const response = new ResponseModel();

        const query = "SELECT * FROM comment WHERE post_id = ?";

        connection.query(query, [post_id], (error, results) => {
            if (error) {
                response.success = false;
                response.message = `Error querying the database: ${error}`;

                reject(response);
            } else {
                response.status = 200;
                response.success = true;
                response.data = results;
                if (results.length === 0) {
                    response.message = 'No comments was found!';
                }

                resolve(response);
            }
        });
    }).catch((error) => {
        if (error instanceof ResponseModel) {
            return error;
        } else {
            const response = new ResponseModel();
            response.message = error;
            response.success = false;
            return response;
        }
    });
};

const getCommentById = (id) => {
    return new Promise((resolve, reject) => {
        const response = new ResponseModel();

        const query = "SELECT * FROM comment WHERE id = ?";

        connection.query(query, [id], (error, results) => {
            if (error) {
                response.success = false;
                response.message = `Error querying the database: ${error}`;

                reject(response);
            } else {
                response.status = 200;
                response.success = true;
                response.data = results;
                if (results.length === 0) {
                    response.message = 'No comment was found!';
                }

                resolve(response);
            }
        });
    }).catch((error) => {
        if (error instanceof ResponseModel) {
            return error;
        } else {
            const response = new ResponseModel();
            response.message = error;
            response.success = false;
            return response;
        }
    });
};

const deleteCommentById = (id) => {
    return new Promise(async (resolve, reject) => {
        const response = new ResponseModel();

        const query = `DELETE FROM comment 
                       WHERE id = ?`;

        connection.query(query, [id], (error, results) => {
            if (error) {
                console.log(error);
                response.success = false;
                response.message = `Error querying the database: ${error}`;

                reject(response);
            } else {
                response.status = 200;
                response.success = true;

                resolve(response);
            }
        });
    }).catch((error) => {
        if (error instanceof ResponseModel) {
            return error;
        } else {
            const response = new ResponseModel();
            response.message = error;
            response.success = false;
            return response;
        }
    });
};

const deleteAllComments = () => {
    return new Promise(async (resolve, reject) => {
        const response = new ResponseModel();

        connection.query(`DELETE FROM comment`, (error, results) => {
            if (error) {
                console.log(error);
                response.success = false;
                response.message = `Error querying the database: ${error}`;

                reject(response);
            } else {
                response.status = 200;
                response.success = true;

                resolve(response);
            }
        });
    }).catch((error) => {
        if (error instanceof ResponseModel) {
            return error;
        } else {
            const response = new ResponseModel();
            response.message = error;
            response.success = false;
            return response;
        }
    });
};

const createComment = (CommentModel) => {
    return new Promise(async (resolve, reject) => { 
        const response = new ResponseModel();
            
        const existingPostResult = await postService.getPostById(CommentModel.post_id);
        if (existingPostResult && existingPostResult.data && existingPostResult.data.length > 0) {

            const existingUserResult = await userService.getUserById(CommentModel.user_id);
            if (existingUserResult && existingUserResult.data && existingUserResult.data.length > 0) {
                const query = `INSERT INTO Comment (post_id, user_id, body, created_at) 
                                VALUES(?, ?, ?, ?)`;
        
                const dateTimeNow = new Date();
                const formattedDateTimeNow = dateTimeNow.toISOString().slice(0, 19).replace('T', ' ');
        
                connection.query(query, [CommentModel.post_id, CommentModel.user_id, CommentModel.body, formattedDateTimeNow], (error, results) => {
                    if (error) {
                        response.success = false;
                        response.message = `Error querying the database: ${error}`;
        
                        reject(response);
                    } else {
                        response.status = 200;
                        response.success = true;
        
                        resolve(response);
                    }
                });
            } else {
                response.message = `No user was found for this user id: ${CommentModel.user_id}!`;
                response.status = 409;
                response.success = false;
    
                reject(response);
            }
        } else {
            response.message = `No post was found for this post id: ${CommentModel.post_id}!`;
            response.status = 409;
            response.success = false;

            reject(response);
        }
    }).catch((error) => {
        if (error instanceof ResponseModel) {
            return error;
        } else {
            const response = new ResponseModel();
            response.message = error;
            response.success = false;
            return response;
        }
    });
}

const updateComment = (CommentModel) => {
    return new Promise(async (resolve, reject) => {
        const response = new ResponseModel();

        const query = `UPDATE Comment 
                        SET body = ?
                        WHERE id = ?`;

        connection.query(query, [CommentModel.body, CommentModel.id], (error, results) => {
            if (error) {
                console.log(error);
                response.success = false;
                response.message = `Error querying the database: ${error}`;

                reject(response);
            } else {
                response.status = 200;
                response.success = true;

                resolve(response);
            }
        });

    }).catch((error) => {
        if (error instanceof ResponseModel) {
            return error;
        } else {
            const response = new ResponseModel();
            response.message = error;
            response.success = false;
            return response;
        }
    });
};

module.exports = {
    getAllComments,
    getAllCommentsByPostId,
    getCommentById,
    deleteCommentById,
    deleteAllComments,
    createComment,
    updateComment
};