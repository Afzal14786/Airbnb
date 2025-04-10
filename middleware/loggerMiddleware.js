
// creating logger middleware

const loggerMiddleware = (req, res, next)=> {
    console.log(`Request Log`);
    console.log(`Access / Created Time : ${new Date().toLocaleString()}`);
    console.log(`Method : ${req.method}`);
    console.log(`Path : ${req.path}`);
    console.log(`Data : `, req.body);
    console.log(`------------------------------`);
    next();
}

module.exports = loggerMiddleware;