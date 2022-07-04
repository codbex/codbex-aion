var query = require("db/v4/query");
var response = require("http/v4/response");
var user = require("security/v4/user");

var sql = "SELECT * FROM CHRONOS_EMPLOYEE WHERE EMPLOYEE_EMAIL = ?";
var resultset = query.execute(sql, [user.getName()]);

response.println(resultset[0].EMPLOYEE_ID);

response.flush();
response.close();