using API.Entities;

namespace API.Dal.IRepo;

public interface IWebsiteRepository
{
    Task<Website> CreateWebsiteAsync(Website website);
    Task DeleteWebsiteAsync(int websiteId);
    Task<Website> GetWebsiteByIdAsync(int websiteId);
    Task<IEnumerable<Website>> GetWebsitesByUserIdAsync(int userId);
}