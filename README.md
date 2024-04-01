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