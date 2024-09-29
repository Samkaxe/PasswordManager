using API.Dal.IRepo;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Dal.Repo;
public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User> CreateUserAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User> GetUserByUsernameAsync(string username)
    {
        return await _context.Users.Include(u => u.Websites)
            .FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<User> GetUserByIdAsync(int userId)
    {
        return await _context.Users.Include(u => u.Websites)
            .FirstOrDefaultAsync(u => u.Id == userId);
    }
}