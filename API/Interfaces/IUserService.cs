using API.Dto;

namespace API.Interfaces;

public interface IUserService
{
    Task<UserDto> CreateUserAsync(UserCreateDto userCreateDto);
    Task<UserDto> LoginAsync(UserLoginDto userLoginDto);
    Task LogoutAsync(int userId);
}