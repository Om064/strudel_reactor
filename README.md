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



---

# Strudel Music Sequencer – Project Documentation

## Overview
This application is an interactive Strudel-based music sequencer built using React, WebAudio, CodeMirror, and Bootstrap.  
Users can write and modify Strudel scripts, adjust playback parameters, view piano roll/D3 visualizations, and manipulate audio effects.

---

## Controls Overview

### **Playback Controls**
- **Preprocess:** Applies placeholder replacements (e.g., `<p1_Radio>`) before playing.
- **Proc & Play:** Runs preprocess and immediately starts playback.
- **Play:** Starts playing the current script.
- **Stop:** Stops playback instantly.
- **Save Script:** Exports the editor script as JSON.
- **Load Script:** Imports JSON and replaces editor content.

---

### **Sound Settings**
- **Tempo (BPM):** Updates the script's first line (`setcps(...)`), changing the playback tempo.
- **Drum Volume (Kicks):** Adjusts the loudness of the drum / kick layer by updating a gain constant in the script. At low values you mostly hear the arpeggiated synth, and at higher values the beat becomes much heavier and more prominent.

---

### **Pattern Controls**
- **p1 : ON** → Enables pattern by replacing `<p1_Radio>` with an empty string.
- **p1 : HUSH** → Mutes pattern by replacing `<p1_Radio>` with `_`.
- **Reverb:** Dynamically injects `.room(value)` into scripted blocks (bassline, main_arp, drums, drums2).

---

### Hotkeys
| Key           | Function        |
|---------------|-----------------|
| Space         | Play            |
| Shift + Space | Stop            |
| Enter         | Proc & Play     |
| P             | Preprocess	  |
| S             | Save Script     |
| L             | Load Script     |
| 1             | Toggle p1: ON   |
| 2             | Toggle p1: HUSH |

---

## Quirks & Usage Notes
- Script must contain the placeholder:  `<p1_Radio>`
- for ON/HUSH toggling to work.
- Reverb slider rewrites `.room()` lines inside specific block names only (bassline, main_arp, drums, drums2).
- Drum Volume affects primarily the kick/drum layer by updating a gain constant in the script and reapplying the pattern. The melodic arpeggiator continues at its original level, so turning Drum Volume down effectively creates a “beat-only vs. melody-only” contrast.
- Multiple accordion groups can be opened simultaneously.

---

## Demonstration Video
https://mymailunisaedu-my.sharepoint.com/:v:/g/personal/bhaog001_mymail_unisa_edu_au/IQDthEug3v2RQJwyUZLm3JbhAR6JWUAx8zHynKztidomXDE?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=mMFfWm

---

## Technologies Used
- React
- Strudel
- CodeMirror
- Bootstrap 5
- D3.js
- WebAudio API

---

## License
Created for academic use as part of a university assignment.
