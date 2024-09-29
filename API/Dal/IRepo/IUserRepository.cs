using API.Entities;

namespace API.Dal.IRepo;

public interface IUserRepository
{
    Task<User> CreateUserAsync(User user);
    Task<User> GetUserByUsernameAsync(string username);
    Task<User> GetUserByIdAsync(int userId);
}