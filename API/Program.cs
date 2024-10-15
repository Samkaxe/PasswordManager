using System.Text;
using API.Dal;
using API.Dal.IRepo;
using API.Dal.Repo;
using API.Interfaces;
using API.Services;
using Azure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Add services to the container.
builder.Services.AddControllers(); 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var keyVaultUrl = new Uri(builder.Configuration.GetSection("AzureVault:Url").Value!);
var azureCredential = new ClientSecretCredential(
    builder.Configuration.GetSection("AzureVault:AzureClientTenantId").Value!,
    builder.Configuration.GetSection("AzureVault:AzureClientId").Value!,
    builder.Configuration.GetSection("AzureVault:AzureClientSecret").Value!);

builder.Configuration.AddAzureKeyVault(keyVaultUrl, azureCredential);

// Register DbContext and repositories
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<EncryptionHelper>(provider => 
        new EncryptionHelper(builder.Configuration.GetSection("EncryptionHelper").Value) // Or retrieve the key from configuration
);
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IWebsiteService, WebsiteService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IWebsiteRepository, WebsiteRepository>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime
                = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration[builder.Configuration.GetSection("JwtIssuer").Value],
            ValidAudience = builder.Configuration[builder.Configuration.GetSection("JwtAudience").Value],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration[builder.Configuration.GetSection("JwtKey").Value])) 

        };
    });

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:3000") // Allow requests from localhost:3000
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();
app.MapControllers();
app.Run();

