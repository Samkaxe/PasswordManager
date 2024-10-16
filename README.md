## Setup Instructions

### System Requirements

*   **.NET SDK:** Ensure you have the .NET SDK (version 8.0 or later) installed. You can check your version using the command:

    ```bash
    dotnet --version
    ```

### Backend Setup (.NET)

1.  **Navigate to the API directory:**

    ```bash
    cd .\API\
    ```

2.  **Install the required packages:**

    ```bash
    dotnet restore
    ```

3.  **Run the database migrations:**

    ```bash
    dotnet ef migrations add InitialSetup
    dotnet ef database update
    ```

    *   This will create the necessary tables in your database based on the `DbContext` configuration.

4.  **Start the API server:**

    ```bash
    dotnet run
    ```

    *   This will start your ASP.NET Core Web API, and it should be accessible at `https://localhost:5190` (or the port specified in `launchSettings.json` file).


### Frontend Setup (React)

**System Requirements**

*   **Node.js and npm:** Make sure you have node and npm installed on your machine, the version used during development was @npm/10.2.1 and @node/20.9.0

**Frontend Installation Steps**

1.  **Navigate to the UI directory:**

    ```bash
    cd ui
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**

    ```bash
    npm start
    ```

    *   This will start your React development server, and your application should be accessible at `http://localhost:3000` and will not work if it's on a different port because of CORS

**Additional Notes**

*   **Troubleshooting:** If you encounter any errors during the setup process, refer to the troubleshooting section in this README (you'll add this section later) or consult the documentation for your specific tools and technologies.
*   **Environment variables:** If you're using environment variables (like we did for the API base URL), make sure to create a `.env` file (or `.env.local` for local development) in your `ui` directory and define the necessary variables.
*   **Building for production:** When you're ready to deploy your frontend application, use the command `npm run build` (or `yarn build`) to create a production-ready build. This will generate optimized files in the `build` directory.
*   **Backend API:** Ensure your backend API is running and accessible at the base URL specified in your frontend environment variables.


## Application Functionality

When you open the application in your web browser (typically at `http://localhost:3000`), you'll be presented with a login/sign-in page. This page allows you to either create a new user account or log in with your existing credentials.

![image](https://github.com/user-attachments/assets/1ca82851-e222-46bb-bd1f-81ba7f43f79e)


Once you've successfully authenticated, you'll be redirected to the "Manage Credentials" page. This page provides the following functionalities:

*   **Create a new credential:**
    *   A form is provided to input the details of a new website credential, including the website URL, username, and password.
    *   A "Generate Password" button allows you to generate a secure random password for the credential.
    *   After filling in the details, click the "Add Credential" button to save the new credential.

![image](https://github.com/user-attachments/assets/052196f3-c1c9-4659-a288-7a4e570699be)

*   **View existing credentials:**
    *   A list displays all the website credentials associated with your account.
    *   Each credential entry shows the website URL, username, and password (optionally hidden).

*   **Delete credentials:**
    *   Each credential entry has a "Delete" button to remove the credential from your account.

*   **Logout:**
    *   A "Logout" button is located at the top right corner of the page. Clicking it will log you out of the application and clear your authentication token.


**Additional Notes**

*   The application uses secure storage and encryption mechanisms to protect your credentials.
*   The password generation feature uses a cryptographically secure random number generator to create strong and unique passwords.
*   The application is designed to be user-friendly and intuitive, even for those unfamiliar with password managers.


## Data Model

The application uses a simple data model with two main entities:

*   **User:** Stores user information, including their ID, username, hashed password (for security), email, and a list of associated websites.
*   **Website:** Stores website credentials associated with a user, including the website URL, username for the website, and the encrypted password for the website.

The relationship between these entities is straightforward:

*   One-to-many: A user can have multiple website credentials associated with their account.
*   Foreign key: The `Website` entity has a `UserId` foreign key that links it to the corresponding `User` entity.

[Image of data model diagram]

## Secure Key Management with Azure Key Vault

This application utilizes Azure Key Vault to securely store and manage sensitive information, including:

* **Encryption Keys:** Used for encrypting sensitive user data.
* **JWT Signing Key:**  Used for signing and validating JSON Web Tokens (JWTs) for authentication.
* **JWT Issuer**: Additional token validation parameter
* **JWT Audience**: Additional token validation parameter

 ```csharp
    var keyVaultUrl = new Uri(builder.Configuration.GetSection("AzureVault:Url").Value!);
    var azureCredential = new ClientSecretCredential(
    builder.Configuration.GetSection("AzureVault:AzureClientTenantId").Value!,
    builder.Configuration.GetSection("AzureVault:AzureClientId").Value!,
    builder.Configuration.GetSection("AzureVault:AzureClientSecret").Value!);

builder.Configuration.AddAzureKeyVault(keyVaultUrl, azureCredential);
 ```
 
## Encryption and Decryption of Website Credentials
```csharp
public class EncryptionHelper
{
private readonly byte[] _key;

    public EncryptionHelper(string key)
    {
       
        _key = Encoding.UTF8.GetBytes(key.PadRight(32).Substring(0, 32));
    }

    public string Encrypt(string plainText)
    {
        using (var aesAlg = Aes.Create())
        {
            aesAlg.Key = _key;
            aesAlg.GenerateIV();
            var encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

            using (var msEncrypt = new MemoryStream())
            {
               
                msEncrypt.Write(aesAlg.IV, 0, aesAlg.IV.Length);
                using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                using (var swEncrypt = new StreamWriter(csEncrypt))
                {
                    swEncrypt.Write(plainText);
                }
                return Convert.ToBase64String(msEncrypt.ToArray());
            }
        }
    }

    public string Decrypt(string cipherText)
    {
        var fullCipher = Convert.FromBase64String(cipherText);

        using (var aesAlg = Aes.Create())
        {
            aesAlg.Key = _key;
            
            var iv = new byte[aesAlg.BlockSize / 8];
            Array.Copy(fullCipher, iv, iv.Length);
            aesAlg.IV = iv;

            var decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

            using (var msDecrypt = new MemoryStream(fullCipher, iv.Length, fullCipher.Length - iv.Length))
            using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
            using (var srDecrypt = new StreamReader(csDecrypt))
            {
                return srDecrypt.ReadToEnd();
            }
        }
    }
}
```

## EncryptionHelper Class

The `EncryptionHelper` class provides two key methods: `Encrypt` and `Decrypt`. It uses the AES (Advanced Encryption Standard) algorithm to encrypt and decrypt website credentials, such as passwords, to ensure their security in the database.

### Constructor: `EncryptionHelper(string key)`
- **Purpose**: Initializes the helper with a secret key, which is used for encryption and decryption.
- **Process**: The provided key is processed to ensure it is exactly 32 bytes long, as required by AES. If the key is shorter, it is padded with additional characters; if longer, it is trimmed.

### Method: `Encrypt(string plainText)`
- **Purpose**: Encrypts plain text (such as a website password) into a secure, encoded format.
- **Process**:
    1. Creates an instance of the AES algorithm (`Aes.Create()`).
    2. Sets the key and generates a new initialization vector (IV) for each encryption session to ensure that encrypting the same text multiple times produces different results.
    3. Writes the IV into a `MemoryStream`, followed by the encrypted version of the plain text using a `CryptoStream` and `StreamWriter`.
    4. Converts the entire content (IV + encrypted data) into a Base64 string for storage.

### Method: `Decrypt(string cipherText)`
- **Purpose**: Decrypts an encrypted string back into plain text.
- **Process**:
    1. Converts the Base64-encoded cipher text back into a byte array.
    2. Extracts the IV (stored at the beginning of the byte array) for use in decryption.
    3. Uses the AES algorithm to decrypt the remaining encrypted data.
    4. Converts the decrypted byte array back into plain text.



## Explanation of `CreateWebsiteAsync` Method

```csharp
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

```

This method handles the process of creating a new website record for a user, including securely storing the website's credentials (password) in an encrypted format.

### Key Steps:
1. **User Validation**: It first checks if the user exists by retrieving the user data using their `userId`. If the user does not exist, it throws an error.
2. **Password Encryption**: The provided password (`websiteCreateDto.Password`) is encrypted using the `Encrypt` method from the `EncryptionHelper` class.
3. **Website Creation**: A new `Website` object is created, with the encrypted password stored as a byte array. The password is converted to a UTF-8 encoded byte array after encryption for secure storage in the database.
4. **Repository Interaction**: The `website` object is then passed to a repository to be saved in the database (`CreateWebsiteAsync`).
5. **Return Value**: After successfully saving, it returns a `WebsiteDto` object containing the relevant website details (but excluding the password, for security reasons).




---

## Explanation of `GetWebsitesByUserIdAsync` Method

```csharp
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
```

This method retrieves all websites associated with a user and decrypts their encrypted passwords for display.

### Key Steps:
1. **Fetching Websites**: It retrieves all website entries related to the `userId` from the database using the repository (`GetWebsitesByUserIdAsync`).
2. **Decryption of Passwords**: For each website entry, it decrypts the stored encrypted password using the `Decrypt` method of the `EncryptionHelper`. The `website.EncryptedPassword` is a byte array that must be decoded back to a string before decryption.
3. **Return Value**: It returns a collection of `WebsiteDto` objects, each containing the decrypted password, along with other website details like `WebsiteUrl` and `Username`.


## User Security

The `UserService` class is responsible for handling the creation and authentication (login) of users. 
It ensures that passwords are securely hashed and compared using the **HMACSHA512** algorithm, 
which is crucial for maintaining security in the system.

### HMACSHA512 and Its Use in Security

**HMACSHA512** (Hash-based Message Authentication Code with SHA-512) is a cryptographic
hash function that combines the **SHA-512** hashing algorithm with a secret key 
(known as the salt) to generate a **one-way hash**.
This method is particularly useful for securely storing passwords because the
hashed value cannot be reversed to retrieve the original password (making it "one-way").

### Why HMACSHA512 Is Useful for Security
- **Irreversible Hashing**: When a user creates a password, it is hashed using HMACSHA512. 
- This ensures that even if an attacker gains access to the hashed password, 
- they cannot reverse the process to retrieve the original password.
- **Password Salting**: The HMACSHA512 algorithm uses a salt (a randomly generated key)
- to add an extra layer of security.
- This ensures that even if two users have the same password,
- their stored password hashes will be different.
- **Security in Comparison**: When a user attempts to log in, 
- their entered password is hashed again with the stored salt
- (from when the account was created).
- The two hashes (the one stored and the one just computed) are then compared.
- If they match, the user is authenticated.

### Why HMACSHA512 Is Not Suitable for Encryption
HMACSHA512 is a **one-way cryptographic function**, 
meaning that once the password is hashed,
it **cannot be decrypted** back into its original form.
This makes it ideal for storing passwords securely but
unsuitable for encryption scenarios where data must be decrypted later.

In contrast, **AES** (used in the `EncryptionHelper` class) is a **symmetric encryption algorithm**. It allows both encryption and decryption, meaning the original data can be retrieved later, which is crucial for storing sensitive information like website passwords that need to be accessed in the future.

### Example Usage in the `CreateUserAsync` Method:
- When creating a user, HMACSHA512 is used to generate a `PasswordHash` from the user's password.
- The salt (`hmac.Key`) is stored alongside the hash to be used later for verification during login.
- The user's password is **not stored in plain text** but is instead stored as a secure, hashed value.

```csharp
var user = new User
{
    Username = userCreateDto.Username.ToLower(),
    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userCreateDto.Password)),  // Generate the hash
    PasswordSalt = hmac.Key,  // Store the salt (HMAC key)
    Email = userCreateDto.Email
};

```csharp
  public async Task<UserDto> CreateUserAsync(UserCreateDto userCreateDto)
    {
        using var hmac = new HMACSHA512();

        var user = new User
        {
            Username = userCreateDto.Username.ToLower(),
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userCreateDto.Password)),
            PasswordSalt = hmac.Key, 
            Email = userCreateDto.Email
        };

    
        var createdUser = await _userRepository.CreateUserAsync(user);

        
        return new UserDto
        {
            Id = createdUser.Id,
            Username = createdUser.Username,
            Email = createdUser.Email
        };
    }
    
    public async Task<UserDto> LoginAsync(UserLoginDto userLoginDto)
    {
        
        var user = await _userRepository.GetUserByUsernameAsync(userLoginDto.Username);
        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid username or password.");
        }
        
        using var hmac = new HMACSHA512(user.PasswordSalt);
        
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userLoginDto.Password));

       
        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i])
            {
                throw new UnauthorizedAccessException("Invalid username or password.");
            }
        }
        
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email
        };
    }
```


## Endpoint Authorization and JWT Verification

In addition to securing user data, the application implements robust authorization mechanisms to ensure that users can only access their own resources.

**JWT Bearer Token Authorization**

*   All API endpoints that require authentication are protected using the `[Authorize]` attribute. This ensures that only requests with a valid JWT (JSON Web Token) can access these endpoints.
*   The JWT is included in the `Authorization` header of each request as a bearer token.

**User ID Verification**

*   For endpoints that involve user-specific resources (such as creating, retrieving, or deleting website credentials), the application performs an additional verification step.
*   The `userId` provided in the request (e.g., as a route parameter) is compared against the `userId` extracted from the JWT claims.
*   If the IDs don't match, the request is rejected with an unauthorized error, preventing users from accessing data that doesn't belong to them.


## Frontend Authorization and Token Handling

The frontend application also plays a crucial role in authorization and secure token handling. Here's how it complements the backend authorization mechanisms:

**1. Token Storage**

*   **Local Storage:** Upon successful login, the received JWT is stored in the browser's local storage. This allows the application to persist the authentication status across page reloads and sessions.

**2.  Authorization Header**

*   **API Requests:**  Before making any API requests that require authorization, the frontend retrieves the JWT from local storage and includes it in the `Authorization` header of the request. This informs the backend API that the request is coming from an authenticated user.

**3. Route Guarding**

*   **Protected Routes:** React Router's `Navigate` component is used to protect routes that require authentication. If a user is not authenticated, they are redirected to the sign-in page.

**4.  JWT Verification (Backend)**

*   **Issuer Signature:** While the frontend includes the JWT in the request header, the actual verification of the token happens on the backend. The backend API validates the token's signature, issuer, and other claims to ensure it's a valid token issued by the server.

## Password Generation

The password manager provides a secure and convenient way to generate strong, random passwords for your website credentials. This feature helps you create passwords that are difficult to guess or crack, enhancing the security of your online accounts.

**Password Generation Mechanism**

*   **Browser-Native Crypto API:** The application utilizes the browser's built-in `crypto` API to generate cryptographically secure random values. This ensures that the generated passwords are truly random and unpredictable.
*   **Customization Options:** You can customize the length and complexity of the generated passwords by specifying the desired length and including or excluding character sets (uppercase, lowercase, numbers, symbols).
*   **Frontend Generation:**


## Potential Vulnerabilities

*   **Compromised Credentials:** If the credentials used to access Key Vault are compromised, attackers could gain access to the encryption keys and other sensitive information.
*   **Authorization Issues:**  Incorrectly configured authorization rules could allow users to access resources they are not authorized to access.
*    **Token Interception:** If a JWT is intercepted, an attacker could potentially gain unauthorized access to the application or decrypt sensitive data if the token provides access to decryption keys.
    *   **Mitigation:** Use short token lifespans, HTTPS, secure token storage (HttpOnly cookies), token blacklisting, and consider JWE (JSON Web Encryption) for sensitive data in tokens.


