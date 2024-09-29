using API.Dto;

namespace API.Interfaces;

public interface IWebsiteService
{
    Task<WebsiteDto> CreateWebsiteAsync(int userId, WebsiteCreateDto websiteCreateDto);
    Task DeleteWebsiteAsync(int userId, int websiteId);
    Task<IEnumerable<WebsiteDto>> GetWebsitesByUserIdAsync(int userId);
}