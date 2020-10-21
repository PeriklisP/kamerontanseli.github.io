(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{"6NSr":function(e,n,t){"use strict";t.r(n),n.default='---\nauthor: Kameron Tanseli\ndate: "2020-09-24T16:24:35.794Z"\nhero_image: https://ucarecdn.com/81ef33ca-1950-40fe-bcaf-ba09f1f81e9a/validations---previews.png\ntitle: "Chrome Extensions (How to Build & Monetise)"\nbyline: "I made a very conscious decision early on to try writing the initial MVP without a framework. I wanted the end result to be small."\n---\n\n### Starting Off Light\n\nMuch like how we have [Create React App](https://reactjs.org/docs/create-a-new-react-app.html) for building front end applications, we also have the [Chrome Extension CLI](https://github.com/dutiyesh/chrome-extension-cli) for quickly spinning up Chrome Extensions. This saved me hours of setting up Webpack and configuring manifests and I highly recommend you use it!\n\nI made a very conscious decision early on to try writing the initial MVP without a framework. I wanted the end result to be small in size as my users would be downloading the entire extension before using it.\n\n```js\nconst isDev = process.env.NODE_ENV === "development";\n\nlet state = {\n  license: {\n    activated: false,\n  },\n  activation: {\n    error: false,\n  },\n  currentTab: "validations",\n  validations: {\n    config: {\n      twitter: true,\n    },\n    passed: [],\n    failed: [],\n    siteInfo: {},\n  },\n};\n\nexport function reducer(action = {}, state = {}) {\n  switch (action.type) {\n    case "ACTIVATION_FAILURE":\n      state.activation.error = true;\n      return state;\n    case "LICENSE_VALID":\n      state.activation.error = false;\n      state.license.activated = true;\n      return state;\n    case "NAVIGATION":\n      state.currentTab = action.payload.currentTab;\n      return state;\n    case "VALIDATION_SET": {\n      state.validations.passed = action.payload.passed;\n      state.validations.failed = action.payload.failed;\n      state.validations.siteInfo = action.payload.siteInfo;\n      return state;\n    }\n    case "VALIDATION_TWITTER_CHANGE": {\n      state.validations.config.twitter = action.payload.twitter;\n      return state;\n    }\n    default:\n      return state;\n  }\n}\n\nexport const dispatch = (callback) => (action) => {\n  const oldState = JSON.parse(JSON.stringify(state));\n  if (isDev) console.log("Previous State", oldState);\n  state = reducer(action, oldState);\n  if (isDev) console.log("New State", state);\n  callback(state);\n};\n```\n\nIt was quite simple to hook this up with my LitHTML views:\n\n```js\nconst emit = dispatch((state) =>\n  render(app(state, emit), document.getElementById("app"))\n);\n```\n\n### Dealing with Communication\n\nI wasted 1-2 hours on trying to figure out how to pass information from my content script (a script that executes code on the user\u2019s current tab) to my extension popup.\n\nTurns out that in order to communicate with the content script you need to first fetch the Tab ID:\n\n`contentScript.js`\n\n```js\nchrome.runtime.onMessage.addListener((request, sender, sendResponse) => {\n  switch (request.type) {\n    case "FETCH_META_DATA": {\n      sendResponse({\n        ...validateMetaData(),\n        siteInfo: getSiteInfo(),\n      });\n      break;\n    }\n    case "ERROR": {\n      console.error(request.payload);\n      break;\n    }\n    default:\n      break;\n  }\n});\n```\n\n`popup.js`\n\n```js\nchrome.tabs.getSelected(null, (tab) => {\n  chrome.tabs.sendMessage(\n    tab.id,\n    { type: "FETCH_META_DATA" },\n    (response) => {}\n  );\n});\n```\n\n### Monetisation & Distribution\n\nNow that the UI and Business Logic was sorted I needed to find a way to monetize my creation. Taking inspiration from CSS Scan I opted to host my extension on Gumroad.\n\nI could have gone the route of uploading my extension to the Chrome Web Store. However, as the extension is essentially useless without a License Key I would have failed the Extension Review.\n\nInstead, the extension build is uploaded as a zip to GumRoad. It\u2019s quite a simple process to add the extension to Chrome and as my customers were developers I didn\u2019t think the extra step of unzipping and adding via chrome://extensions was that difficult.\n\nFortunately, GumRoad has an inbuilt License Key API.\n\nUnfortunately, it requires a server to call it, so I had to add to build a small web service to call from my extension.\n\nNote: The API only accepts URL encoded requests and not JSON (this will save you 30 minutes of wondering why it doesn\u2019t work):\n\n```js\nconst result = await axios({\n  url: `https://api.gumroad.com/v2/licenses/verify`,\n  method: "POST",\n  headers: { "Content-Type": "application/x-www-form-urlencoded" },\n  data: `product_permalink=<permalink>&license_key=${\n    encodeURIComponent(license_key)\n  }`,\n});\n```'}}]);