using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Data;
using backend.lib;
using backend.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("[controller]")]
[EnableCors("CorsPolicy")]
public class AuthController : Controller {

    private readonly UserService _userService;
    public AuthController(UserService userService) {
        _userService = userService;
    }

    [HttpPost]
    [Route("login")]
    public async Task<Dictionary<String, Object>> Login([FromBody] User user) {
        User userFromDB = await _userService.GetUserByUserName(user.UserName);
        if (userFromDB == null) {
            return ResponseFormatter.buildError("User not found");
        }
        Console.WriteLine(user.Password);
        if (userFromDB.Password != user.Password) {
            return ResponseFormatter.buildError("Wrong password");
        }
        TokenGenerator.Token token = TokenGenerator.GenerateToken();
        userFromDB.Token = token.token;
        userFromDB.CreatedAt = token.CreatedAt;

        await _userService.UpdateUser(userFromDB);

        //dont return password
        userFromDB.Password = "********";

        return ResponseFormatter.buildSuccess(userFromDB);
    }


    [HttpPost]
    [Route("register")]
    public async Task<Dictionary<String, Object>> Register([FromBody] User user) {
        if (user == null || user.UserName == null || user.Password == null) {
            return ResponseFormatter.buildError("invalid input. Make sure you have a UserName and Password");
        }
        if (user.UserName.Length < 3 || user.Password.Length < 3) {
            return ResponseFormatter.buildError("UserName and Password must be at least 3 characters long");
        }
        User userFromDB = await _userService.GetUserByUserName(user.UserName);
        if (userFromDB != null) {
            return ResponseFormatter.buildError("UserName is taken");
        }
        TokenGenerator.Token token = TokenGenerator.GenerateToken();
        User newUser = new User {
            UserName = user.UserName,
            Password = user.Password,
            Token = token.token,
            CreatedAt = token.CreatedAt
        };
        await _userService.CreateUser(newUser);

        //dont return password
        newUser.Password = "********";
        
        return ResponseFormatter.buildSuccess(newUser);
    }
}