using API.Dal.IRepo;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Dal.Repo;

public class WebsiteRepository : IWebsiteRepository
{
    private readonly ApplicationDbContext _context;

    public WebsiteRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Website> CreateWebsiteAsync(Website website)
    {
        _context.Websites.Add(website);
        await _context.SaveChangesAsync();
        return website;
    }

    public async Task DeleteWebsiteAsync(int websiteId)
    {
        var website = await _context.Websites.FindAsync(websiteId);
        if (website != null)
        {
            _context.Websites.Remove(website);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<Website> GetWebsiteByIdAsync(int websiteId)
    {
        return await _context.Websites
            .FirstOrDefaultAsync(w => w.Id == websiteId);
    }
    public async Task<IEnumerable<Website>> GetWebsitesByUserIdAsync(int userId)
    {
        return await _context.Websites
            .Where(w => w.UserId == userId)
            .ToListAsync();
    }
}