using API.Entities;
using API.Interfaces;

using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;   

using System.Security.Claims;
using System.Text;
using API.Dto;

namespace API.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration
            _configuration;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string
            CreateToken(UserDto user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenKey = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]

                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())

                }),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials
                    = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);   

            return tokenHandler.WriteToken(token);
        }
    }
}