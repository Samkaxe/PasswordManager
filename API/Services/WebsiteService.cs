using System.Security.Cryptography;
using System.Text;
using API.Dal.IRepo;
using API.Dto;
using API.Entities;
using API.Interfaces;

namespace API.Services;

public class WebsiteService : IWebsiteService
{
    private readonly IWebsiteRepository _websiteRepository;
    private readonly IUserRepository _userRepository;
    private readonly EncryptionHelper _encryptionHelper;
    public WebsiteService(IWebsiteRepository websiteRepository, IUserRepository userRepository , EncryptionHelper encryptionHelper)
    {
        _websiteRepository = websiteRepository;
        _userRepository = userRepository;
        _encryptionHelper = encryptionHelper;
    }

    public async Task<WebsiteDto> CreateWebsiteAsync(int userId, WebsiteCreateDto websiteCreateDto)
    {
        var user = await _userRepository.GetUserByIdAsync(userId);
        if (user == null)
        {
            throw new ArgumentException("User not found.");
        }

        // Encrypt the password
        var encryptedPassword = _encryptionHelper.Encrypt(websiteCreateDto.Password);

        var website = new Website
        {
            UserId = userId,
            WebsiteUrl = websiteCreateDto.WebsiteUrl,
            Username = websiteCreateDto.Username,
            EncryptedPassword = Encoding.UTF8.GetBytes(encryptedPassword) 
        };

        var createdWebsite = await _websiteRepository.CreateWebsiteAsync(website);

        return new WebsiteDto
        {
            Id = createdWebsite.Id,
            WebsiteUrl = createdWebsite.WebsiteUrl,
            Username = createdWebsite.Username
        };
    }

    public async Task DeleteWebsiteAsync(int userId, int websiteId)
    {
       
        var user = await _userRepository.GetUserByIdAsync(userId);
        if (user == null)
        {
            throw new ArgumentException("User not found.");
        }

        
        var website = await _websiteRepository.GetWebsiteByIdAsync(websiteId);
        if (website == null || website.UserId != userId)
        {
            throw new UnauthorizedAccessException("User does not have permission to delete this website.");
        }
        
        await _websiteRepository.DeleteWebsiteAsync(websiteId);
    }

    public async Task<IEnumerable<WebsiteDto>> GetWebsitesByUserIdAsync(int userId)
    {
        var websites = await _websiteRepository.GetWebsitesByUserIdAsync(userId);
        if (websites == null || !websites.Any())
        {
            return new List<WebsiteDto>();
        }

        return websites.Select(website => new WebsiteDto
        {
            Id = website.Id,
            WebsiteUrl = website.WebsiteUrl,
            Username = website.Username,
            Password = _encryptionHelper.Decrypt(Encoding.UTF8.GetString(website.EncryptedPassword)) 
        });
    }
}