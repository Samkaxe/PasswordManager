﻿using System.Security.Claims;
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
    [HttpPost("create/{userId}")]
    public async Task<IActionResult> CreateWebsite(int userId, WebsiteCreateDto websiteCreateDto)
    {
        
        var tokenUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        // Check if the userId in the route matches the one in the token
        if (userId != tokenUserId)
        {
            return Unauthorized("Unauthorized access. User ID mismatch.");
        }
        
        
        try
        {
            var website = await _websiteService.CreateWebsiteAsync(userId, websiteCreateDto);
            return Ok(website);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
   
    [Authorize]
    [HttpGet("getWebsites/{userId}")]
    public async Task<IActionResult> GetWebsitesByUserId(int userId)
    {
        
        var tokenUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        // Check if the userId in the route matches the one in the token
        if (userId != tokenUserId)
        {
            return Unauthorized("Unauthorized access. User ID mismatch.");
        }
        
        try
        {
            var websites = await _websiteService.GetWebsitesByUserIdAsync(userId);
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
    [HttpDelete("delete/{userId}/{websiteId}")]
    public async Task<IActionResult> DeleteWebsite(int userId, int websiteId)
    {
        
        var tokenUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        // Check if the userId in the route matches the one in the token
        if (userId != tokenUserId)
        {
            return Unauthorized("Unauthorized access. User ID mismatch.");
        }
        
        try
        {
            await _websiteService.DeleteWebsiteAsync(userId, websiteId);
            return Ok(new { message = "Website deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}