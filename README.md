# SquadGame
Changbal hackathon

Dream Team Builder is a simple, interactive web application that helps users create their dream project team. Users can enter their project details, get AI-recommended candidates, review candidate information, hire members, and build their full team.

## Features

- User-friendly interface for creating a dream project team
- Step-by-step team building process
- Candidate recommendation system
- Mobile-friendly design

## Getting Started

### Prerequisites

- Node.js and npm installed
- AWS CLI configured (for S3 deployment only)

### Installation

1. Clone this repository:
```
git clone <repository-url>
cd dream-team-builder
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

This will open the application in your browser at [http://localhost:3000](http://localhost:3000).

## Deployment to S3

This application is designed to be hosted on AWS S3. A deployment script is provided to simplify the process.

1. Make sure you have the AWS CLI installed and configured with appropriate credentials.

2. Run the deployment script:
```
./deploy-to-s3.sh
```

3. Follow the prompts to specify your S3 bucket name.

4. Once deployed, the script will provide the public URL to access your application.

## S3 URL Access

The application can be accessed using the following URL patterns:
- Direct S3 object URL: `https://<bucket-name>.s3.amazonaws.com/index.html`
- S3 website URL: `http://<bucket-name>.s3-website-<region>.amazonaws.com`

## Application Flow

1. **Landing Page**: Users start by clicking "Start my dream team"
2. **Team Creation Page**: Enter team name and project description
3. **Candidate Recommendation**: Review and select from recommended candidates
4. **Team Building**: Continue adding members until the team is complete
5. **Completion**: View the assembled dream team

## Development

- Built with React.js
- CSS for styling
- No backend required (all data handled in front-end state)

## License

This project is released under the MIT License.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
