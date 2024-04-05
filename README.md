# Github Guru

The Ultimate Github Chrome Extension, used to display notifications from your GitHub repositories and view pending PRs.

## Features
### Notifications
* Receive Github notifications no matter what tab you are on.
* View GitHub notifications received previously and link to the relevant change.
* Functionality to clear or mark notifications as read, or mark them as "Flag for later"
* "Flag for later" can be set for a specific time frame, the user will receive another notification after the time that is chosen.
* Functionality to filter notifications by repository.

### PRs
* Track PRs that are waiting for your review.
* Track PR comments that were left on your PR.
* Functionality to filter PRs by repository.

### Analytics
* View the number of commits that the user has contributed over specific intervals of time.
* Display the number of PRs reviewed over specific intervals of time.
* Display the number of PRs completed and merged over specific intervals of time.

## Team Contributors and Roles
Team Name: Async
* Delphine Sintamour
* Jose Suarez
* Kevin Rodriguez Trujillo
* Luke Hepokoski

# Local Setup
1. Clone the repo
2. Run `npm install`
3. Navigate to the extension folder and run `npm install`(again)
5. Navigate to `extension/src/config`, create a copy of the "config.json.example" file and name that copy "config.json".
6. Retrieve the `clientId` and `clientSecret` from your admins.
7. Stay in the extension folder and run `npm run build` or `npm run watch`. Notice that it generates a folder named "dist"
8. Open `chrome://extensions/` in your chrome browser. Ensure that developer mode is on. The toggle is in the top right corner.
9. Select "Load unpacked" in the top left corner.
10. Find and select the "dist" folder.
11. The chrome extension is now available locally.
*Note: If you run `npm run watch` and you are not actively developing, remember to halt the process using CTRL+C*

## Development
When making changes to the code, run `npm run build` then navigate to `chrome://extensions/` in your browser and refresh the extension to ensure all changes are there (it should update on its own). Using `npm run watch` will allow you to develop/make changes and not have to continuously run `npm run build` to view your changes.

# Tech Stack
* HTML
* CSS
* JS
* React
* Node.js
* Express.js
  
## Other Resources
* Webpack
* AntDesign

## Sustainability
Google Extensions themselves are utilized to streamline workflows, enable collaboration and remote work, increase productivity or efficiency through analytics, and use minimal power consumption due to their integration within the Chrome browser. In terms of software engineering sustainability practices, the extension utilizes a CI/CD pipeline which streamlines software development and deployment processes while also reducing the time and resources required for each iteration and minimizing waste. Since the extension is built-in via the Chrome browser, it minimizes system resource usage while also optimizing data transfers. This allows for the software to be efficient and perform well when running. Also, the main data host, Google, is a carbon neutral company, meaning that even when the data servers are being utilized they have very little to no impact on environmental resources.
https://cloud.google.com/sustainability
https://www.netlify.com/sustainability/

## CI/CD Pipeline for Chrome Extension
Our project utilizes GitHub Actions to automate the Continuous Integration and Continuous Delivery (CI/CD) process for the development of our Chrome Extension. The workflow is defined in .github/workflows/chrome-extension-ci.yml, which orchestrates several key operations upon every push to the main branch or pull request against it. Here's what happens in our CI/CD pipeline:

Workflow Steps
1. Checkout: The workflow starts by checking out the latest code from the main branch to ensure that all subsequent steps are performed on the most recent version.

2. Node.js Setup: Sets up a Node.js environment, specifically using Node.js version 14. This step ensures that our build scripts run in a consistent, controlled environment.

3. Install Dependencies: Runs npm install to install all required npm packages as specified in package.json. This step is crucial for preparing the environment to build the extension.

4. Pack Extension: Instead of a direct build script, we utilize TheDoctor0/zip-release@0.7.6 action to package the extension. This action compresses the project into a package.zip, excluding unnecessary files (like .git, .vscode, .github, and markdown files), ensuring that only relevant files are included in the package.

5. Upload Artifact: Uploads the package.zip as an artifact of the GitHub Actions run. This makes the packaged extension easily accessible for further testing, manual downloads, or future automated deployments.

Highlights
* Consistent Build Environment: By using Node.js version 14, we maintain a consistent environment that mirrors our production environment closely.
* Artifact Generation: Generates a deployable package of our extension, facilitating easy distribution and testing.

## Deployment for Server

Our project's server is seamlessly deployed and hosted using Netlify, a powerful platform that simplifies the deployment process and automates continuous delivery. Netlify's deployment model is designed around a Git-centric workflow, automatically building and deploying the server whenever changes are committed to the repository. This ensures that our server is always up-to-date with the latest changes in our codebase, providing a reliable and efficient deployment process.

### How Netlify Deployment Works:
1. Continuous Deployment: Netlify integrates directly with our GitHub repository, monitoring for any changes committed to the server's directory. Upon detecting changes, Netlify triggers a new build and deployment process, ensuring that our server reflects the latest version of our code.

2. Build Process: During the deployment, Netlify executes a build process defined by our project's configuration. This process involves installing dependencies, running build scripts, and generating the final build artifacts that will be served. For our server, this typically includes the execution of server-side scripts and the preparation of serverless functions.

3. Live Server Updates: Once the build is complete, Netlify automatically updates our live server with the new build. This is done with minimal downtime, ensuring that our server remains accessible to users at all times. Netlify's atomic deployments also ensure that only fully successful builds are deployed, reducing the risk of introducing errors into the production environment.

4. Rollbacks and Versioning: Netlify maintains a history of deployments, allowing us to easily rollback to previous versions of our server if needed. This is particularly useful for quickly reverting changes in case of unexpected issues with a new deployment.

5. Custom Domains and SSL: Netlify provides support for custom domains and automatically manages SSL certificates, ensuring that our server is accessible via a secure and user-friendly URL.

By leveraging Netlify for our server deployment, we benefit from a streamlined deployment process, reduced development overhead, and enhanced reliability. The platform's automation of the continuous delivery pipeline allows our team to focus more on development and less on the intricacies of deployment, making it an integral part of our project's infrastructure.


##Privacy Policy

GitHub Guru is a Google Chrome extension developed by [Your Company Name]. This Privacy Policy explains how we collect, use, and disclose information collected from users of the GitHub Guru extension.

Information Collection and Use

GitHub Guru does not collect any personal information from users. However, the extension may request access to certain browser features or permissions to provide its functionality. These permissions are used solely for the intended purpose of the extension and are not shared with third parties.

Data Security

We take the security of your data seriously. GitHub Guru only accesses data necessary for its functionality and does not store any personal information locally or on our servers. Any data accessed by the extension is used exclusively within the extension and is not shared externally.

Third-Party Services

GitHub Guru may integrate with third-party services such as GitHub's API to provide certain features. Users are encouraged to review the privacy policies of these third-party services for information on how they collect, use, and disclose data.

Changes to this Privacy Policy

We reserve the right to update or change our Privacy Policy at any time. Any changes to the Privacy Policy will be reflected on this page. Users are encouraged to check this page periodically for updates.

Contact Us

If you have any questions or concerns about our Privacy Policy or the GitHub Guru extension, please contact us at [Your Contact Email Address].
