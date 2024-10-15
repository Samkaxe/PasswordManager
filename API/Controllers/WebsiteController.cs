using System.Security.Claims;
using API.Dto;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WebsiteController : ControllerBase
{
    private readonly IWebsiteService _websiteService;

    public WebsiteController(IWebsiteService websiteService)
    {
        _websiteService = websiteService;
    }

    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> CreateWebsite(WebsiteCreateDto websiteCreateDto)
    {
        
        var tokenUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        try
        {
            var website = await _websiteService.CreateWebsiteAsync(tokenUserId, websiteCreateDto);
            return Ok(website);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
   
    [Authorize]
    [HttpGet("getWebsites")]
    public async Task<IActionResult> GetWebsitesByUserId()
    {
        
        var tokenUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        
        try
        {
            var websites = await _websiteService.GetWebsitesByUserIdAsync(tokenUserId);
            if (!websites.Any())
            {
                return Ok(Enumerable.Empty<WebsiteDto>());
            }
            return Ok(websites);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpDelete("delete/{websiteId}")]
    public async Task<IActionResult> DeleteWebsite(int websiteId)
    {
        
        var tokenUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        try
        {
            await _websiteService.DeleteWebsiteAsync(tokenUserId, websiteId);
            return Ok(new { message = "Website deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}