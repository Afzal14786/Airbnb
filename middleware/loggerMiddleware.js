
// creating logger middleware

const loggerMiddleware = (req, res, next)=> {
    let timeStamp = Date.now().toLocaleString();
    let {method, path} = req.body;
    console.log(`[Request Log]`);
    console.log(`[Method : ${method}], [Path : ${path}]`);
    console.log(`------------------------------`);
    next();
}

module.exports = loggerMiddleware;