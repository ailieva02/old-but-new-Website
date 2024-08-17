const connection = require('../dbConn');
const ResponseModel = require('../models/responseModel');
const CategoryModel = require('../models/categoryModel');
const { response } = require('express');

const deleteCategoryByCategoryId = (id) => {
    return new Promise(async (resolve, reject) => {
        const response = new ResponseModel();

        const query = `DELETE FROM Category 
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
}

const updateCategory = (CategoryModel) => {
    return new Promise(async (resolve, reject) => {
        const response = new ResponseModel();

        const query = `UPDATE Category 
                        SET title = ?
                        WHERE id = ?`;

        connection.query(query, [CategoryModel.title, CategoryModel.id], (error, results) => {
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
}

const createCategory = (CategoryModel) => {
    return new Promise(async (resolve, reject) => { 
        const response = new ResponseModel();
        
        const existingCategoryResult = await getCategoryByTitle(CategoryModel.title);
        if (existingCategoryResult) {
            if (existingCategoryResult.data && existingCategoryResult.data.length > 0) {
                response.message = `The Title: ${CategoryModel.title} is already being used, please choose another!`;
                response.status = 409;
                response.success = false;

                reject(response);
            } else {
                const query = `INSERT INTO Category (user_id, title, created_at) 
                                VALUES(?, ?, ?)`;

                const dateTimeNow = new Date();
                const formattedDateTimeNow = dateTimeNow.toISOString().slice(0, 19).replace('T', ' ');

                connection.query(query, [CategoryModel.user_id, CategoryModel.title, formattedDateTimeNow], (error, results) => {
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
            }
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

const getAllCategories = () => {
    return new Promise((resolve, reject) => {
        const response = new ResponseModel();

        connection.query("SELECT * FROM category", (error, results) => {
            if (error) {
                response.success = false;
                response.message = `Error querying the database: ${error}`;

                reject(response);
            } else {
                response.status = 200;
                response.success = true;
                response.data = results;

                if (results.length === 0) {
                    response.message = 'No categories were found!';
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
}

const getCategoriesByUserId = (id) => {
    return new Promise((resolve, reject) => {
        const response = new ResponseModel();

        const query = "SELECT * FROM category WHERE user_id = ?";

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
                    response.message = 'No categories were found!';
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
}

const getCategoryByTitle = (title) => {
    return new Promise((resolve, reject) => {
        const response = new ResponseModel();

        const query = "SELECT * FROM category WHERE title = ? LIMIT 1";

        connection.query(query, [title], (error, results) => {
            if (error) {
                response.success = false;
                response.message = `Error querying the database: ${error}`;

                reject(response);
            } else {
                response.status = 200;
                response.success = true;
                response.data = results;
                if (results.length === 0) {
                    response.message = 'No category was found!';
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
}

const getCategoryById = (id) => {
    return new Promise((resolve, reject) => {
        const response = new ResponseModel();

        const query = "SELECT * FROM category WHERE id = ?";

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
                    response.message = 'No category was found!';
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
}

module.exports = {
    deleteCategoryByCategoryId,
    updateCategory,
    createCategory,
    getAllCategories,
    getCategoriesByUserId,
    getCategoryByTitle,
    getCategoryById
};