namespace API.Entities;

public class Website
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string WebsiteUrl { get; set; }
    public string Username { get; set; }
    
    
    public byte[] EncryptedPassword { get; set; }

    public User User { get; set; }
}