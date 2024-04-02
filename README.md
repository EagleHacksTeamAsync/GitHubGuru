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
4. Stay in the extension folder and run `npm run build`. Notice that it generates a folder named "dist"
5. Open `chrome://extensions/` in your chrome browser. Ensure that developer mode is on. The toggle is in the top right corner.
6. Select "Load unpacked" in the top left corner.
7. Find and select the "dist" folder.
8. The chrome extension is now available locally.

## Development
When making changes to the code, run `npm run build` then navigate to `chrome://extensions/` in your browser and refresh the extension.

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

##CI/CD Pipeline for Extension
Our project utilizes GitHub Actions to automate the Continuous Integration and Continuous Delivery (CI/CD) process for the development of our Chrome Extension. The workflow is defined in .github/workflows/chrome-extension-ci.yml, which orchestrates several key operations upon every push to the main branch or pull request against it. Here's what happens in our CI/CD pipeline:

Workflow Steps
Checkout: The workflow starts by checking out the latest code from the main branch to ensure that all subsequent steps are performed on the most recent version.

Node.js Setup: Sets up a Node.js environment, specifically using Node.js version 14. This step ensures that our build scripts run in a consistent, controlled environment.

Install Dependencies: Runs npm install to install all required npm packages as specified in package.json. This step is crucial for preparing the environment to build the extension.

Linting: Utilizes the Super-Linter action to perform a comprehensive linting of the codebase. This helps maintain code quality and consistency by catching syntax errors and stylistic issues early in the development process.

Build Extension: Executes npm run build-extension, a custom npm script that compiles and prepares the extension's code. This typically involves transpiling, minifying, or any other build steps required to prepare the extension for deployment.

Package Extension: After the build completes, the output in the dist/ directory is packaged into a ZIP file named package.zip. This ZIP file contains the distributable version of the Chrome Extension, ready for deployment or distribution.

Upload Artifact: The final step uploads package.zip as an artifact to the GitHub Actions run, making it easily accessible for further testing, manual downloads, or automated deployments in future steps or workflows.

Highlights
Automated Linting: Ensures that all contributions adhere to our coding standards and guidelines.
Consistent Build Environment: By using Node.js version 14, we maintain a consistent environment that mirrors our production environment closely.
Artifact Generation: Generates a deployable package of our extension, facilitating easy distribution and testing.
