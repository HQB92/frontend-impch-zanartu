"use strict";
exports.id = 751;
exports.ids = [751];
exports.modules = {

/***/ 2377:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "L": () => (/* binding */ Scrollbar)
/* harmony export */ });
/* harmony import */ var simplebar_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4172);
/* harmony import */ var simplebar_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(simplebar_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8442);
/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_mui_material_styles__WEBPACK_IMPORTED_MODULE_1__);


const Scrollbar = (0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_1__.styled)((simplebar_react__WEBPACK_IMPORTED_MODULE_0___default()))``;


/***/ }),

/***/ 3385:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "I": () => (/* binding */ withAuthGuard)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(1853);
// EXTERNAL MODULE: external "prop-types"
var external_prop_types_ = __webpack_require__(580);
var external_prop_types_default = /*#__PURE__*/__webpack_require__.n(external_prop_types_);
// EXTERNAL MODULE: ./src/contexts/auth-context.js + 1 modules
var auth_context = __webpack_require__(3521);
;// CONCATENATED MODULE: ./src/guards/auth-guard.js




const AuthGuard = (props)=>{
    const { children  } = props;
    const router = (0,router_.useRouter)();
    const { isAuthenticated  } = (0,auth_context/* useAuthContext */.Eu)();
    const ignore = (0,external_react_.useRef)(false);
    const [checked, setChecked] = (0,external_react_.useState)(false);
    // Only do authentication check on component mount.
    // This flow allows you to manually redirect the user after sign-out, otherwise this will be
    // triggered and will automatically redirect to sign-in page.
    (0,external_react_.useEffect)(()=>{
        if (!router.isReady) {
            return;
        }
        // Prevent from calling twice in development mode with React.StrictMode enabled
        if (ignore.current) {
            return;
        }
        ignore.current = true;
        if (!isAuthenticated) {
            console.log("Not authenticated, redirecting");
            router.replace({
                pathname: "/auth/login",
                query: router.asPath !== "/" ? {
                    continueUrl: router.asPath
                } : undefined
            }).catch(console.error);
        } else {
            setChecked(true);
        }
    }, [
        router.isReady
    ]);
    if (!checked) {
        return null;
    }
    // If got here, it means that the redirect did not occur, and that tells us that the user is
    // authenticated / authorized.
    return children;
};
AuthGuard.propTypes = {
    children: (external_prop_types_default()).node
};

;// CONCATENATED MODULE: ./src/hocs/with-auth-guard.js


const withAuthGuard = (Component)=>(props)=>/*#__PURE__*/ jsx_runtime_.jsx(AuthGuard, {
            children: /*#__PURE__*/ jsx_runtime_.jsx(Component, {
                ...props
            })
        });


/***/ }),

/***/ 9797:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "S": () => (/* binding */ usePopover)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function usePopover() {
    const anchorRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    const [open, setOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const handleOpen = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(()=>{
        setOpen(true);
    }, []);
    const handleClose = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(()=>{
        setOpen(false);
    }, []);
    const handleToggle = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(()=>{
        setOpen((prevState)=>!prevState);
    }, []);
    return {
        anchorRef,
        handleClose,
        handleOpen,
        handleToggle,
        open
    };
}


/***/ }),

/***/ 5392:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "x": () => (/* binding */ AccountPopover)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9332);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(580);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5692);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_mui_material__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var src_hooks_use_auth__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2662);






const AccountPopover = (props)=>{
    const { anchorEl , onClose , open  } = props;
    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.useRouter)();
    const auth = (0,src_hooks_use_auth__WEBPACK_IMPORTED_MODULE_5__/* .useAuth */ .a)();
    const handleSignOut = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{
        onClose?.();
        auth.signOut();
        router.push("/auth/login");
    }, [
        onClose,
        auth,
        router
    ]);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Popover, {
        anchorEl: anchorEl,
        anchorOrigin: {
            horizontal: "left",
            vertical: "bottom"
        },
        onClose: onClose,
        open: open,
        PaperProps: {
            sx: {
                width: 200
            }
        },
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Box, {
                sx: {
                    py: 1.5,
                    px: 2
                },
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Typography, {
                        variant: "overline",
                        children: "Cuenta"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Typography, {
                        color: "text.secondary",
                        variant: "body2",
                        children: "Hugo Quinteros"
                    })
                ]
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Divider, {}),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.MenuList, {
                disablePadding: true,
                dense: true,
                sx: {
                    p: "8px",
                    "& > *": {
                        borderRadius: 1
                    }
                },
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.MenuItem, {
                    onClick: handleSignOut,
                    children: "Salir"
                })
            })
        ]
    });
};
AccountPopover.propTypes = {
    anchorEl: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().any),
    onClose: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func),
    open: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool.isRequired)
};


/***/ }),

/***/ 8336:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "e": () => (/* binding */ items)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _heroicons_react_24_solid_ChartBarIcon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5123);
/* harmony import */ var _heroicons_react_24_solid_ShoppingBagIcon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8707);
/* harmony import */ var _heroicons_react_24_solid_UserIcon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8356);
/* harmony import */ var _heroicons_react_24_solid_UsersIcon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1950);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5692);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_mui_material__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _mui_icons_material_MonetizationOn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1906);
/* harmony import */ var _mui_icons_material_MonetizationOn__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material_MonetizationOn__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _mui_icons_material_People__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(7166);
/* harmony import */ var _mui_icons_material_People__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material_People__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _mui_icons_material_Church__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(6456);
/* harmony import */ var _mui_icons_material_Church__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material_Church__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _mui_icons_material_Inventory__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(5020);
/* harmony import */ var _mui_icons_material_Inventory__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material_Inventory__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _mui_icons_material_AddBox__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(976);
/* harmony import */ var _mui_icons_material_AddBox__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material_AddBox__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _mui_icons_material_ListAlt__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(4846);
/* harmony import */ var _mui_icons_material_ListAlt__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material_ListAlt__WEBPACK_IMPORTED_MODULE_11__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_heroicons_react_24_solid_ChartBarIcon__WEBPACK_IMPORTED_MODULE_1__, _heroicons_react_24_solid_ShoppingBagIcon__WEBPACK_IMPORTED_MODULE_2__, _heroicons_react_24_solid_UserIcon__WEBPACK_IMPORTED_MODULE_3__, _heroicons_react_24_solid_UsersIcon__WEBPACK_IMPORTED_MODULE_4__]);
([_heroicons_react_24_solid_ChartBarIcon__WEBPACK_IMPORTED_MODULE_1__, _heroicons_react_24_solid_ShoppingBagIcon__WEBPACK_IMPORTED_MODULE_2__, _heroicons_react_24_solid_UserIcon__WEBPACK_IMPORTED_MODULE_3__, _heroicons_react_24_solid_UsersIcon__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);












const items = [
    {
        title: "Reportes",
        path: "/",
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_5__.SvgIcon, {
            fontSize: "small",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_ChartBarIcon__WEBPACK_IMPORTED_MODULE_1__["default"], {})
        })
    },
    {
        title: "Usuarios",
        path: "/customers",
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_5__.SvgIcon, {
            fontSize: "small",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_UsersIcon__WEBPACK_IMPORTED_MODULE_4__["default"], {})
        }),
        subItems: [
            {
                title: "Listado",
                path: "/customers",
                icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_5__.SvgIcon, {
                    fontSize: "small",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_mui_icons_material_ListAlt__WEBPACK_IMPORTED_MODULE_11___default()), {})
                })
            },
            {
                title: "Nuevo",
                path: "/customers/new",
                icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_5__.SvgIcon, {
                    fontSize: "small",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_mui_icons_material_AddBox__WEBPACK_IMPORTED_MODULE_10___default()), {})
                })
            }
        ]
    },
    {
        title: "Miembros",
        path: "/members",
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_5__.SvgIcon, {
            fontSize: "small",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_mui_icons_material_People__WEBPACK_IMPORTED_MODULE_7___default()), {})
        })
    },
    {
        title: "Iglesias",
        path: "/churchs",
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_5__.SvgIcon, {
            fontSize: "small",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_mui_icons_material_Church__WEBPACK_IMPORTED_MODULE_8___default()), {})
        })
    },
    {
        title: "Ofrendas",
        path: "/companies",
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_5__.SvgIcon, {
            fontSize: "small",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_mui_icons_material_MonetizationOn__WEBPACK_IMPORTED_MODULE_6___default()), {})
        })
    },
    {
        title: "Inventario",
        path: "/inventory",
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_5__.SvgIcon, {
            fontSize: "small",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((_mui_icons_material_Inventory__WEBPACK_IMPORTED_MODULE_9___default()), {})
        })
    },
    {
        title: "Gastos",
        path: "/expenses",
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_5__.SvgIcon, {
            fontSize: "small",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_ShoppingBagIcon__WEBPACK_IMPORTED_MODULE_2__["default"], {})
        })
    },
    {
        title: "Mi Perfil",
        path: "/account",
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_5__.SvgIcon, {
            fontSize: "small",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_UserIcon__WEBPACK_IMPORTED_MODULE_3__["default"], {})
        })
    }
];

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 4751:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "A": () => (/* binding */ Layout)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9332);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8442);
/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_mui_material_styles__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var src_hocs_with_auth_guard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3385);
/* harmony import */ var _side_nav__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5407);
/* harmony import */ var _top_nav__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8683);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_side_nav__WEBPACK_IMPORTED_MODULE_5__, _top_nav__WEBPACK_IMPORTED_MODULE_6__]);
([_side_nav__WEBPACK_IMPORTED_MODULE_5__, _top_nav__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);







const SIDE_NAV_WIDTH = 302;
const LayoutRoot = (0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_3__.styled)("div")(({ theme  })=>({
        display: "flex",
        flex: "1 1 auto",
        maxWidth: "100%",
        [theme.breakpoints.up("lg")]: {
            paddingLeft: SIDE_NAV_WIDTH
        }
    }));
const LayoutContainer = (0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_3__.styled)("div")({
    display: "flex",
    flex: "1 1 auto",
    flexDirection: "column",
    width: "100%"
});
const Layout = (0,src_hocs_with_auth_guard__WEBPACK_IMPORTED_MODULE_4__/* .withAuthGuard */ .I)((props)=>{
    const { children  } = props;
    const pathname = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.usePathname)();
    const [openNav, setOpenNav] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const handlePathnameChange = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{
        if (openNav) {
            setOpenNav(false);
        }
    }, [
        openNav
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        handlePathnameChange();
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [
        pathname
    ]);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_top_nav__WEBPACK_IMPORTED_MODULE_6__/* .TopNav */ .t, {
                onNavOpen: ()=>setOpenNav(true)
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_side_nav__WEBPACK_IMPORTED_MODULE_5__/* .SideNav */ .k, {
                onClose: ()=>setOpenNav(false),
                open: openNav
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(LayoutRoot, {
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(LayoutContainer, {
                    children: children
                })
            })
        ]
    });
});

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1587:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "y": () => (/* binding */ SideNavItem)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(580);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5692);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_mui_material__WEBPACK_IMPORTED_MODULE_4__);





const SideNavItem = (props)=>{
    const { active =false , disabled , external , icon , path , title , subItems  } = props;
    const [isOpen, setIsOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const linkProps = path ? external ? {
        component: "a",
        href: path,
        target: "_blank"
    } : {
        component: (next_link__WEBPACK_IMPORTED_MODULE_2___default()),
        href: path
    } : {};
    const handleSubMenu = ()=>{
        setIsOpen(!isOpen);
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_4__.ButtonBase, {
                sx: {
                    alignItems: "center",
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "flex-start",
                    pl: "16px",
                    pr: "16px",
                    py: "6px",
                    textAlign: "left",
                    width: "100%",
                    ...active && {
                        backgroundColor: "rgba(255, 255, 255, 0.04)"
                    },
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.04)"
                    }
                },
                onClick: handleSubMenu,
                ...linkProps,
                children: [
                    icon && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Box, {
                        component: "span",
                        sx: {
                            alignItems: "center",
                            color: "neutral.400",
                            display: "inline-flex",
                            justifyContent: "center",
                            mr: 2,
                            ...active && {
                                color: "primary.lightest"
                            }
                        },
                        children: icon
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Box, {
                        component: "span",
                        sx: {
                            color: "neutral.400",
                            flexGrow: 1,
                            fontFamily: (theme)=>theme.typography.fontFamily,
                            fontSize: 14,
                            fontWeight: 600,
                            lineHeight: "24px",
                            whiteSpace: "nowrap",
                            ...active && {
                                color: "common.white"
                            },
                            ...disabled && {
                                color: "neutral.500"
                            }
                        },
                        children: title
                    })
                ]
            }),
            subItems && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Collapse, {
                in: isOpen,
                sx: {
                    pl: "30px"
                },
                children: subItems.map((subItem)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(SideNavItem, {
                        ...subItem
                    }, subItem.path))
            })
        ]
    });
};
SideNavItem.propTypes = {
    active: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
    disabled: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
    external: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
    icon: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().node),
    path: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
    title: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string.isRequired),
    subItems: prop_types__WEBPACK_IMPORTED_MODULE_3___default().arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_3___default().shape({
        path: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
        title: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string.isRequired)
    }))
};


/***/ }),

/***/ 5407:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "k": () => (/* binding */ SideNav)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9332);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(580);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5692);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_mui_material__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var src_components_logo__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2540);
/* harmony import */ var src_components_scrollbar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2377);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8336);
/* harmony import */ var _side_nav_item__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(1587);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_config__WEBPACK_IMPORTED_MODULE_7__]);
_config__WEBPACK_IMPORTED_MODULE_7__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];









const SideNav = (props)=>{
    const { open , onClose  } = props;
    const pathname = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.usePathname)();
    const lgUp = (0,_mui_material__WEBPACK_IMPORTED_MODULE_4__.useMediaQuery)((theme)=>theme.breakpoints.up("lg"));
    const content = /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(src_components_scrollbar__WEBPACK_IMPORTED_MODULE_6__/* .Scrollbar */ .L, {
        sx: {
            height: "100%",
            "& .simplebar-content": {
                height: "100%"
            },
            "& .simplebar-scrollbar:before": {
                background: "neutral.400"
            }
        },
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Box, {
            sx: {
                display: "flex",
                flexDirection: "column",
                height: "100%"
            },
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Box, {
                    sx: {
                        p: 3
                    },
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Box, {
                            component: (next_link__WEBPACK_IMPORTED_MODULE_1___default()),
                            href: "/",
                            sx: {
                                display: "inline-flex",
                                height: 32,
                                width: 32
                            },
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(src_components_logo__WEBPACK_IMPORTED_MODULE_5__/* .Logo */ .T, {})
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Typography, {
                                    color: "inherit",
                                    variant: "h4",
                                    children: "IMPCH Za\xf1artu"
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Typography, {
                                    color: "neutral.400",
                                    variant: "body2",
                                    children: "Iglesia Metodista Pentecostal de Chile"
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Divider, {
                    sx: {
                        borderColor: "neutral.700"
                    }
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Box, {
                    component: "nav",
                    sx: {
                        flexGrow: 1,
                        px: 2,
                        py: 3
                    },
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Stack, {
                        component: "ul",
                        spacing: 0.5,
                        sx: {
                            listStyle: "none",
                            p: 0,
                            m: 0
                        },
                        children: _config__WEBPACK_IMPORTED_MODULE_7__/* .items.map */ .e.map((item)=>{
                            const active = item.path ? pathname === item.path : false;
                            return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_side_nav_item__WEBPACK_IMPORTED_MODULE_8__/* .SideNavItem */ .y, {
                                active: active,
                                disabled: item.disabled,
                                external: item.external,
                                icon: item.icon,
                                path: item.path,
                                title: item.title,
                                subItems: item.subItems
                            }, item.title);
                        })
                    })
                })
            ]
        })
    });
    if (lgUp) {
        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Drawer, {
            anchor: "left",
            open: true,
            PaperProps: {
                sx: {
                    backgroundColor: "neutral.800",
                    color: "common.white",
                    width: 302
                }
            },
            variant: "permanent",
            children: content
        });
    }
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Drawer, {
        anchor: "left",
        onClose: onClose,
        open: open,
        PaperProps: {
            sx: {
                backgroundColor: "neutral.800",
                color: "common.white",
                width: 302
            }
        },
        sx: {
            zIndex: (theme)=>theme.zIndex.appBar + 100
        },
        variant: "temporary",
        children: content
    });
};
SideNav.propTypes = {
    onClose: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func),
    open: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool)
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 8683:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "t": () => (/* binding */ TopNav)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(580);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _heroicons_react_24_solid_Bars3Icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2506);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5692);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_mui_material__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8442);
/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_mui_material_styles__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var src_hooks_use_popover__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9797);
/* harmony import */ var _account_popover__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5392);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_heroicons_react_24_solid_Bars3Icon__WEBPACK_IMPORTED_MODULE_2__]);
_heroicons_react_24_solid_Bars3Icon__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];







const SIDE_NAV_WIDTH = 302;
const TOP_NAV_HEIGHT = 90;
const TopNav = (props)=>{
    const { onNavOpen  } = props;
    const lgUp = (0,_mui_material__WEBPACK_IMPORTED_MODULE_3__.useMediaQuery)((theme)=>theme.breakpoints.up("lg"));
    const accountPopover = (0,src_hooks_use_popover__WEBPACK_IMPORTED_MODULE_5__/* .usePopover */ .S)();
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Box, {
                component: "header",
                sx: {
                    backdropFilter: "blur(6px)",
                    backgroundColor: (theme)=>(0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_4__.alpha)(theme.palette.background.default, 0.8),
                    position: "sticky",
                    left: {
                        lg: `${SIDE_NAV_WIDTH}px`
                    },
                    top: 0,
                    width: {
                        lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`
                    },
                    zIndex: (theme)=>theme.zIndex.appBar
                },
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Stack, {
                    alignItems: "center",
                    direction: "row",
                    justifyContent: "space-between",
                    spacing: 2,
                    sx: {
                        minHeight: TOP_NAV_HEIGHT,
                        px: 2
                    },
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Stack, {
                            alignItems: "center",
                            direction: "row",
                            spacing: 2,
                            children: !lgUp && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.IconButton, {
                                onClick: onNavOpen,
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.SvgIcon, {
                                    fontSize: "small",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_Bars3Icon__WEBPACK_IMPORTED_MODULE_2__["default"], {})
                                })
                            })
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Stack, {
                            alignItems: "center",
                            direction: "row",
                            spacing: 2,
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_3__.Avatar, {
                                onClick: accountPopover.handleOpen,
                                ref: accountPopover.anchorRef,
                                sx: {
                                    cursor: "pointer",
                                    height: 70,
                                    width: 70
                                },
                                src: "/assets/avatars/avatar-cao-yu.png"
                            })
                        })
                    ]
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_account_popover__WEBPACK_IMPORTED_MODULE_6__/* .AccountPopover */ .x, {
                anchorEl: accountPopover.anchorRef.current,
                open: accountPopover.open,
                onClose: accountPopover.handleClose
            })
        ]
    });
};
TopNav.propTypes = {
    onNavOpen: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func)
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;