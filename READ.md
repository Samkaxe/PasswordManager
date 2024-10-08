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