"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/_app",{

/***/ "./src/services/login.js":
/*!*******************************!*\
  !*** ./src/services/login.js ***!
  \*******************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\nconst axios = __webpack_require__(/*! axios */ \"./node_modules/axios/dist/browser/axios.cjs\");\nconst login = async (email, password)=>{\n    let data = JSON.stringify({\n        username: email,\n        password: password\n    });\n    let config = {\n        method: \"post\",\n        maxBodyLength: Infinity,\n        url: \"https://pzh3nv4b-4000.brs.devtunnels.ms/auth/login\",\n        headers: {\n            \"Content-Type\": \"application/json\",\n            \"Access-Control-Allow-Origin\": \"*\",\n            \"Access-Control-Allow-Methods\": \"GET, POST, PUT, DELETE\",\n            \"Access-Control-Allow-Headers\": \"Content-Type, Authorization\"\n        },\n        data: data\n    };\n    const response = await axios.request(config).then((response)=>{\n        return JSON.stringify(response.data.token);\n    }).catch((error)=>{\n        console.log(error);\n    });\n    return response;\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (login);\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2VydmljZXMvbG9naW4uanMuanMiLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU1BLFFBQVFDLG1CQUFPQSxDQUFDO0FBQ3RCLE1BQU1DLFFBQVEsT0FBT0MsT0FBT0MsV0FBYTtJQUN2QyxJQUFJQyxPQUFPQyxLQUFLQyxTQUFTLENBQUM7UUFDeEJDLFVBQVVMO1FBQ1ZDLFVBQVVBO0lBQ1o7SUFFQSxJQUFJSyxTQUFTO1FBQ1hDLFFBQVE7UUFDUkMsZUFBZUM7UUFDZkMsS0FBSztRQUNMQyxTQUFTO1lBQ1AsZ0JBQWdCO1lBQ2hCLCtCQUErQjtZQUMvQixnQ0FBZ0M7WUFDaEMsZ0NBQWdDO1FBQ2xDO1FBQ0FULE1BQU1BO0lBQ1I7SUFFQSxNQUFNVSxXQUFXLE1BQU1mLE1BQ3BCZ0IsT0FBTyxDQUFDUCxRQUNSUSxJQUFJLENBQUMsQ0FBQ0YsV0FBYTtRQUNsQixPQUFPVCxLQUFLQyxTQUFTLENBQUNRLFNBQVNWLElBQUksQ0FBQ2EsS0FBSztJQUMzQyxHQUNDQyxLQUFLLENBQUMsQ0FBQ0MsUUFBVTtRQUNoQkMsUUFBUUMsR0FBRyxDQUFDRjtJQUNkO0lBQ0YsT0FBT0w7QUFDVDtBQUVBLCtEQUFlYixLQUFLQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy9zZXJ2aWNlcy9sb2dpbi5qcz9hOWFlIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGF4aW9zID0gcmVxdWlyZSgnYXhpb3MnKTtcbmNvbnN0IGxvZ2luID0gYXN5bmMgKGVtYWlsLCBwYXNzd29yZCkgPT4ge1xuICBsZXQgZGF0YSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICB1c2VybmFtZTogZW1haWwsXG4gICAgcGFzc3dvcmQ6IHBhc3N3b3JkLFxuICB9KTtcblxuICBsZXQgY29uZmlnID0ge1xuICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgIG1heEJvZHlMZW5ndGg6IEluZmluaXR5LFxuICAgIHVybDogJ2h0dHBzOi8vcHpoM252NGItNDAwMC5icnMuZGV2dHVubmVscy5tcy9hdXRoL2xvZ2luJyxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogJ0dFVCwgUE9TVCwgUFVULCBERUxFVEUnLFxuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uJyxcbiAgICB9LFxuICAgIGRhdGE6IGRhdGEsXG4gIH07XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvc1xuICAgIC5yZXF1ZXN0KGNvbmZpZylcbiAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShyZXNwb25zZS5kYXRhLnRva2VuKTtcbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9KTtcbiAgcmV0dXJuIHJlc3BvbnNlO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgbG9naW47XG4iXSwibmFtZXMiOlsiYXhpb3MiLCJyZXF1aXJlIiwibG9naW4iLCJlbWFpbCIsInBhc3N3b3JkIiwiZGF0YSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ1c2VybmFtZSIsImNvbmZpZyIsIm1ldGhvZCIsIm1heEJvZHlMZW5ndGgiLCJJbmZpbml0eSIsInVybCIsImhlYWRlcnMiLCJyZXNwb25zZSIsInJlcXVlc3QiLCJ0aGVuIiwidG9rZW4iLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsImxvZyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/services/login.js\n"));

/***/ })

});