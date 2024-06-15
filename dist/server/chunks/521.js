"use strict";
exports.id = 521;
exports.ids = [521];
exports.modules = {

/***/ 3521:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "he": () => (/* binding */ AuthConsumer),
  "Vo": () => (/* binding */ AuthContext),
  "Ho": () => (/* binding */ AuthProvider),
  "Eu": () => (/* binding */ useAuthContext)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: external "prop-types"
var external_prop_types_ = __webpack_require__(580);
var external_prop_types_default = /*#__PURE__*/__webpack_require__.n(external_prop_types_);
;// CONCATENATED MODULE: ./src/services/login.js
const axios = __webpack_require__(2167);
const detenv = __webpack_require__(5142);
const login = async (email, password)=>{
    let data = JSON.stringify({
        username: email,
        password: password
    });
    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${"https://pzh3nv4b-4000.brs.devtunnels.ms"}${"/auth/login"}`,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        data: data
    };
    const response = await axios.request(config).then((response)=>{
        return JSON.stringify(response.data.token);
    }).catch((error)=>{
        console.log(error);
    });
    return response;
};
/* harmony default export */ const services_login = (login);

;// CONCATENATED MODULE: ./src/contexts/auth-context.js




const HANDLERS = {
    INITIALIZE: "INITIALIZE",
    SIGN_IN: "SIGN_IN",
    SIGN_OUT: "SIGN_OUT"
};
const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null
};
const handlers = {
    [HANDLERS.INITIALIZE]: (state, action)=>{
        const user = action.payload;
        return {
            ...state,
            ...user ? {
                isAuthenticated: true,
                isLoading: false,
                user
            } : {
                isLoading: false
            }
        };
    },
    [HANDLERS.SIGN_IN]: (state, action)=>{
        const user = action.payload;
        return {
            ...state,
            isAuthenticated: true,
            user
        };
    },
    [HANDLERS.SIGN_OUT]: (state)=>{
        return {
            ...state,
            isAuthenticated: false,
            user: null
        };
    }
};
const reducer = (state, action)=>handlers[action.type] ? handlers[action.type](state, action) : state;
// The role of this context is to propagate authentication state through the App tree.
const AuthContext = /*#__PURE__*/ (0,external_react_.createContext)({
    undefined
});
const AuthProvider = (props)=>{
    const { children  } = props;
    const [state, dispatch] = (0,external_react_.useReducer)(reducer, initialState);
    const initialized = (0,external_react_.useRef)(false);
    const initialize = async ()=>{
        // Prevent from calling twice in development mode with React.StrictMode enabled
        if (initialized.current) {
            return;
        }
        initialized.current = true;
        let isAuthenticated = false;
        try {
            isAuthenticated = window.sessionStorage.getItem("authenticated") === "true";
        } catch (err) {
            console.error(err);
        }
        if (isAuthenticated) {
            const user = {
                id: "5e86809283e28b96d2d38537",
                avatar: "/assets/avatars/avatar-anika-visser.png",
                name: "Anika Visser",
                email: "anika.visser@devias.io"
            };
            dispatch({
                type: HANDLERS.INITIALIZE,
                payload: user
            });
        } else {
            dispatch({
                type: HANDLERS.INITIALIZE
            });
        }
    };
    (0,external_react_.useEffect)(()=>{
        initialize();
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    const skip = ()=>{
        try {
            window.sessionStorage.setItem("authenticated", "true");
        } catch (err) {
            console.error(err);
        }
        const user = {
            id: "5e86809283e28b96d2d38537",
            avatar: "/assets/avatars/avatar-anika-visser.png",
            name: "Anika Visser",
            email: "anika.visser@devias.io"
        };
        dispatch({
            type: HANDLERS.SIGN_IN,
            payload: user
        });
    };
    const signIn = async (email, password)=>{
        const token = await services_login(email, password);
        console.log("token", token);
        let user = {};
        //decode token
        if (token) {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            user = {
                id: decoded.userId,
                avatar: "/assets/avatars/avatar-anika-visser.png",
                name: decoded.username,
                email: decoded.email,
                rut: decoded.rut
            };
            try {
                window.sessionStorage.setItem("authenticated", "true");
                window.sessionStorage.setItem("token", token);
                window.sessionStorage.setItem("user", JSON.stringify(user));
                dispatch({
                    type: HANDLERS.SIGN_IN,
                    payload: user
                });
            } catch (err) {
                dispatch({
                    type: HANDLERS.SIGN_OUT
                });
            }
        } else {
            dispatch({
                type: HANDLERS.SIGN_OUT
            });
            throw new Error("Por favor revisa tus credenciales");
        }
    };
    const signUp = async (email, name, password)=>{
        throw new Error("Sign up is not implemented");
    };
    const signOut = ()=>{
        window.sessionStorage.removeItem("authenticated");
        window.sessionStorage.removeItem("token");
        window.sessionStorage.removeItem("user");
        dispatch({
            type: HANDLERS.SIGN_OUT
        });
    };
    return /*#__PURE__*/ jsx_runtime_.jsx(AuthContext.Provider, {
        value: {
            ...state,
            skip,
            signIn,
            signUp,
            signOut
        },
        children: children
    });
};
AuthProvider.propTypes = {
    children: (external_prop_types_default()).node
};
const AuthConsumer = AuthContext.Consumer;
const useAuthContext = ()=>(0,external_react_.useContext)(AuthContext);


/***/ })

};
;