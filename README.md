## Setup Instructions

### System Requirements

*   **.NET SDK:** Ensure you have the .NET SDK (version 8.0 or later) installed. You can check your version using the command:

    ```bash
    dotnet --version
    ```

    If you need to install or update, you can download it from the official Microsoft website: [https://dotnet.microsoft.com/download](https://dotnet.microsoft.com/download)

*   **(Optional) IDE:** While not strictly required, an IDE like Visual Studio or JetBrains Rider can significantly improve your development experience.

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

    *   This will create the necessary tables in your database based on your `DbContext` configuration.

4.  **Start the API server:**

    ```bash
    dotnet run
    ```

    *   This will start your ASP.NET Core Web API, and it should be accessible at `https://localhost:5190` (or the port specified in your `launchSettings.json` file).


### Frontend Setup (React)

**System Requirements**

*   **Node.js and npm:** Make sure you have Node.js and npm (or yarn) installed on your system. You can check your Node.js version using the command `node --version` and your npm version using `npm --version`. You can download Node.js (which includes npm) from the official website: [https://nodejs.org/](https://nodejs.org/)

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

    *   This will start your React development server, and your application should be accessible at `http://localhost:3000`

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

## Encryption and Decryption of Website Credentials

Protecting sensitive data is paramount in a password manager application. To ensure the confidentiality and integrity of your stored website credentials, this application employs robust encryption and decryption mechanisms, specifically focusing on protecting data **at rest**. This means that even if an attacker gains access to the database file, the encrypted credentials remain unreadable without the proper decryption key.

**Encryption Process**

1.  **Encryption Key:** A unique encryption key is generated for each user. This key is derived from the user's master password using a secure key derivation function (bcrypt). This ensures that the encryption key is not stored directly and is only generated when needed for decryption.

2.  **AES Encryption:** The website usernames and passwords are encrypted using the Advanced Encryption Standard (AES) algorithm. AES is a widely recognized and trusted encryption standard that provides strong security and is commonly used for protecting sensitive data.

3.  **Initialization Vector (IV):** A unique, randomly generated initialization vector (IV) is used for each encryption operation. This ensures that even if the same password is encrypted multiple times, the resulting ciphertext will be different, adding an extra layer of protection.

4.  **Ciphertext Storage:** The encrypted credentials, along with the IV, are stored as a byte array in the database. This ensures that the raw encrypted data is preserved without any potential encoding issues.

**Decryption Process**

1.  **Key Derivation:** When a user logs in, their master password is used to derive the same encryption key that was used to encrypt their credentials.

2.  **IV Retrieval:** The IV is retrieved from the stored ciphertext.

3.  **AES Decryption:** The AES algorithm is used to decrypt the website username and password using the derived key and the retrieved IV.

**Security Considerations**

*   **Key Management:** The encryption key is never stored directly. It is derived from the user's master password whenever needed, ensuring that the key is not exposed even if the database is compromised.
*   **Strong Encryption:** AES is a strong encryption algorithm that provides a high level of security against unauthorized access.
*   **Unique IVs:** The use of unique IVs for each encryption operation enhances security by ensuring that identical passwords don't result in identical ciphertexts.


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

**Addressing the Vulnerability**

You're correct about the potential vulnerability of an intercepted request being modified to access another user's credentials. However, the JWT verification on the backend mitigates this risk. Here's why:

*   **Tamper-proof:** JWTs are digitally signed using a secret key that is only known to the server. If an attacker modifies the `userId` in the request, the signature verification on the backend will fail, and the request will be rejected.
*   **User ID Claim:** The JWT contains the authenticated user's ID as a claim. The backend compares this ID with the `userId` provided in the request to ensure they match. If they don't, the request is denied, preventing unauthorized access to another user's data.


## Password Generation

The password manager provides a secure and convenient way to generate strong, random passwords for your website credentials. This feature helps you create passwords that are difficult to guess or crack, enhancing the security of your online accounts.

**Password Generation Mechanism**

*   **Browser-Native Crypto API:** The application utilizes the browser's built-in `crypto` API to generate cryptographically secure random values. This ensures that the generated passwords are truly random and unpredictable.
*   **Customization Options:** You can customize the length and complexity of the generated passwords by specifying the desired length and including or excluding character sets (uppercase, lowercase, numbers, symbols).
*   **Frontend Generation:**