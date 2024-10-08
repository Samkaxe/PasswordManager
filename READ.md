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
