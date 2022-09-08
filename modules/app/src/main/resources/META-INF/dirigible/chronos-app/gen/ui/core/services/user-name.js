let user = require('security/v4/user');
let response = require('http/v4/response');

response.setContentType("text/plain");
response.println(user.getName());
response.flush();
response.close();