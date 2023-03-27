using API.DTOs;
using API.Services;
using Domain;
using Infrastructure.Email;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly TokenService _tokenService;
    private readonly EmailSender _emailSender;

    public AccountController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        TokenService tokenService,
        EmailSender emailSender
        )
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _emailSender = emailSender;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager.Users.Include(x => x.Photos)
            .FirstOrDefaultAsync(x => x.Email == loginDto.Email);

        if (user == null)
            return Unauthorized("Invalid Email");

        if (!user.EmailConfirmed)
            return Unauthorized("Email not confirmed");

        var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
        if (result.Succeeded)
        {
            await SetRefreshToken(user);
            return CreateUserObject(user);
        }

        return Unauthorized("Invalid Password");
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await _userManager.Users.AnyAsync(x => x.Email.Equals(registerDto.Email)))
        {
            ModelState.AddModelError("email", "邮箱重复");
            return BadRequest(ModelState);
        }

        if (await _userManager.Users.AnyAsync(x => x.UserName.Equals(registerDto.UserName)))
        {
            ModelState.AddModelError("username", "用户名重复");
            return BadRequest(ModelState);
        }

        var user = new AppUser
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.UserName,
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
        {
            return BadRequest("Problem registration user");
        }

        var origin = Request.Headers["origin"];
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}";
        var message = $"<p>Please click the below link to verify your email address</p><p><a href='{verifyUrl}'>Click to verify email</a></p>";

        await _emailSender.SendEmailAsync(user.Email, "Please verify email", message);

        return Ok("Registration success - please verify email");
    }

    [AllowAnonymous]
    [HttpPost("verifyEmail")]
    public async Task<IActionResult> VerifyEmail(string token, string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return Unauthorized();
        }

        var decodedTokenBytes = WebEncoders.Base64UrlDecode(token);
        var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);
        var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

        if (!result.Succeeded)
            return BadRequest("Could not verify email address");

        return Ok("Email confirmed - you can now login");
    }

    [AllowAnonymous]
    [HttpGet("resendEmailConfirmationLink")]
    public async Task<IActionResult> ResendEmailConfirmationLink(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return Unauthorized();

        var origin = Request.Headers["origin"];
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}";
        var message = $"<p>Please click the below link to verify your email address</p><p><a href='{verifyUrl}'>Click to verify email</a></p>";

        await _emailSender.SendEmailAsync(user.Email, "Please verify email", message);

        return Ok("Email verification link resent");
    }


    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var user = await _userManager.Users.Include(x => x.Photos)
            .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

        await SetRefreshToken(user);
        return CreateUserObject(user);
    }

    [Authorize]
    [HttpPost("refreshToken")]
    public async Task<ActionResult<UserDto>> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        var user = await _userManager.Users.Include(x => x.RefreshTokens)
            .Include(x => x.Photos)
            .FirstOrDefaultAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.Name));

        if (user == null) return Unauthorized();

        var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken);

        if (oldToken != null && !oldToken.IsActive) return Unauthorized();

        return CreateUserObject(user);
    }

    private async Task SetRefreshToken(AppUser user)
    {
        var refreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshTokens.Add(refreshToken);
        await _userManager.UpdateAsync(user);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7),
        };

        Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
    }

    private UserDto CreateUserObject(AppUser user)
    {
        return new UserDto
        {
            DisplayName = user.DisplayName,
            Token = _tokenService.CreateToken(user),
            UserName = user.UserName,
            Image = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
        };
    }
}
