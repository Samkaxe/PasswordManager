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

## Encryption and Decryption of Website Credentials

This application prioritizes the security of your website credentials. Here's how it's done:

**Encryption:**

* **AES-256 Encryption:** Website passwords are encrypted using AES-256, a strong, industry-standard encryption algorithm.
* **Encryption Helper:** The `EncryptionHelper` class provides methods for encrypting and decrypting passwords using a secure key stored in Azure Key Vault.

**Storage:**

* **Encrypted in Database:** Encrypted passwords are stored as byte arrays in the database. This ensures that even if the database is compromised, the passwords remain protected.

**Key Management:**

* **Azure Key Vault:** The encryption key used by the `EncryptionHelper` is securely stored in Azure Key Vault.
* **Managed Identities:** The application accesses the encryption key using managed identities, eliminating the need to store credentials directly in the application.

**Decryption:**

* **On-Demand Decryption:** Passwords are decrypted only when needed, such as when a user requests to view their website credentials.
* **Secure Handling:** Decrypted passwords are handled in memory and are not stored in any persistent form.

**Example Code Snippet (from `WebsiteService`)**

```csharp
// Encrypt the password
var encryptedPassword = _encryptionHelper.Encrypt(websiteCreateDto.Password);

// ... store encryptedPassword in the database

// ... later, when retrieving the website data:
Password = _encryptionHelper.Decrypt(Encoding.UTF8.GetString(website.EncryptedPassword)) 

```

## User Security

The application prioritizes the security of user accounts and employs robust measures to protect sensitive information.

**Password Hashing and Salting**

*   **bcrypt:** User passwords are hashed using bcrypt, a strong and widely recommended password hashing algorithm. Bcrypt is specifically designed to be computationally expensive, making it difficult for attackers to crack passwords even if they gain access to the hashed values.
*   **Salting:** Each password is also salted with a unique, randomly generated salt value before hashing. This adds an extra layer of protection by ensuring that even if two users have the same password, their hashed passwords will be different, preventing rainbow table attacks.

**Password Storage**

*   **Database Storage:** Only the hashed and salted password values are stored in the database. The actual passwords are never stored, making it extremely difficult for attackers to recover them even if they compromise the database.


## Endpoint Authorization and JWT Verification

In addition to securing user data, the application implements robust authorization mechanisms to ensure that users can only access their own resources.

**JWT Bearer Token Authorization**

*   All API endpoints that require authentication are protected using the `[Authorize]` attribute. This ensures that only requests with a valid JWT (JSON Web Token) can access these endpoints.
*   The JWT is included in the `Authorization` header of each request as a bearer token.

**User ID Verification**

*   For endpoints that involve user-specific resources (such as creating, retrieving, or deleting website credentials), the application performs an additional verification step.
*   These requests don't have the userid attached in the request body, but rather rely on the NameIdentifier claim to contain the userID
  ![image](https://github.com/user-attachments/assets/b851f0e7-995a-435b-8632-19b4635eccce)



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
![image](https://github.com/user-attachments/assets/f38b17db-8ab7-452b-b2a6-0ead66eed669)



## Potential Vulnerabilities

*   **Compromised Credentials:** If the credentials used to access Key Vault are compromised, attackers could gain access to the encryption keys and other sensitive information.
*   **Authorization Issues:**  Incorrectly configured authorization rules could allow users to access resources they are not authorized to access.
*    **Token Interception:** If a JWT is intercepted, an attacker could potentially gain unauthorized access to the application or decrypt sensitive data if the token provides access to decryption keys.
    *   **Mitigation:** Use short token lifespans, HTTPS, secure token storage (HttpOnly cookies), token blacklisting, and consider JWE (JSON Web Encryption) for sensitive data in tokens.


