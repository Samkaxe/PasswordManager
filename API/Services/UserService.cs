using System.Security.Cryptography;
using System.Text;
using API.Dal.IRepo;
using API.Dto;
using API.Entities;
using API.Interfaces;

namespace API.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDto> CreateUserAsync(UserCreateDto userCreateDto)
    {
        using var hmac = new HMACSHA512();

        var user = new User
        {
            Username = userCreateDto.Username.ToLower(),
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userCreateDto.Password)),
            PasswordSalt = hmac.Key, 
            Email = userCreateDto.Email
        };

    
        var createdUser = await _userRepository.CreateUserAsync(user);

        
        return new UserDto
        {
            Id = createdUser.Id,
            Username = createdUser.Username,
            Email = createdUser.Email
        };
    }
    
    public async Task<UserDto> LoginAsync(UserLoginDto userLoginDto)
    {
        
        var user = await _userRepository.GetUserByUsernameAsync(userLoginDto.Username);
        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid username or password.");
        }
        
        using var hmac = new HMACSHA512(user.PasswordSalt);
        
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userLoginDto.Password));

       
        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i])
            {
                throw new UnauthorizedAccessException("Invalid username or password.");
            }
        }
        
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email
        };
    }

    // this is for the clinet side :D , we gotta remove the token once this method trigger 
    public Task LogoutAsync(int userId)
    {
        return Task.CompletedTask;
    }
}