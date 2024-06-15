"use strict";
exports.id = 397;
exports.ids = [397];
exports.modules = {

/***/ 4992:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "D": () => (/* binding */ CustomersSearch)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _heroicons_react_24_solid_MagnifyingGlassIcon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(521);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5692);
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_mui_material__WEBPACK_IMPORTED_MODULE_2__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_heroicons_react_24_solid_MagnifyingGlassIcon__WEBPACK_IMPORTED_MODULE_1__]);
_heroicons_react_24_solid_MagnifyingGlassIcon__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];



const CustomersSearch = ()=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_2__.Card, {
        sx: {
            p: 2
        },
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_2__.OutlinedInput, {
            defaultValue: "",
            fullWidth: true,
            placeholder: "Buscar",
            startAdornment: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_2__.InputAdornment, {
                position: "start",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_mui_material__WEBPACK_IMPORTED_MODULE_2__.SvgIcon, {
                    color: "action",
                    fontSize: "small",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_solid_MagnifyingGlassIcon__WEBPACK_IMPORTED_MODULE_1__["default"], {})
                })
            }),
            sx: {
                maxWidth: 500
            }
        })
    });

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 3826:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "d": () => (/* binding */ CustomersTable)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "prop-types"
var external_prop_types_ = __webpack_require__(580);
var external_prop_types_default = /*#__PURE__*/__webpack_require__.n(external_prop_types_);
// EXTERNAL MODULE: external "date-fns"
var external_date_fns_ = __webpack_require__(4146);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: external "@mui/material"
var material_ = __webpack_require__(5692);
// EXTERNAL MODULE: ./src/components/scrollbar.js
var scrollbar = __webpack_require__(2377);
;// CONCATENATED MODULE: ./src/utils/get-initials.js
const getInitials = (name = "")=>name.replace(/\s+/, " ").split(" ").slice(0, 2).map((v)=>v && v[0].toUpperCase()).join("");

// EXTERNAL MODULE: external "@mui/icons-material/Edit"
var Edit_ = __webpack_require__(6902);
var Edit_default = /*#__PURE__*/__webpack_require__.n(Edit_);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(1853);
// EXTERNAL MODULE: external "@mui/icons-material/DeleteForever"
var DeleteForever_ = __webpack_require__(4334);
var DeleteForever_default = /*#__PURE__*/__webpack_require__.n(DeleteForever_);
// EXTERNAL MODULE: external "@mui/system"
var system_ = __webpack_require__(7986);
;// CONCATENATED MODULE: ./src/sections/customer/customers-table.js











const CustomersTable = (props)=>{
    const { count =0 , items =[] , onDeselectAll , onDeselectOne , onPageChange =()=>{} , onRowsPerPageChange , onSelectAll , onSelectOne , page =0 , rowsPerPage =0 , selected =[]  } = props;
    const selectedSome = selected.length > 0 && selected.length < items.length;
    const selectedAll = items.length > 0 && selected.length === items.length;
    const router = (0,router_.useRouter)();
    const handleClick = ()=>{
        alert("\xbfEst\xe1 seguro que desea eliminar este miembro?");
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(material_.Card, {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(scrollbar/* Scrollbar */.L, {
                children: /*#__PURE__*/ jsx_runtime_.jsx(material_.Box, {
                    sx: {
                        minWidth: 800
                    },
                    children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(material_.Table, {
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx(material_.TableHead, {
                                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(material_.TableRow, {
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx(material_.TableCell, {
                                            children: "Nombre"
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx(material_.TableCell, {
                                            children: "Direcci\xf3n"
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx(material_.TableCell, {
                                            children: "Tel\xe9fono"
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx(material_.TableCell, {
                                            children: "Fecha Nacimiento"
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx(material_.TableCell, {
                                            children: "Fecha Probando"
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx(material_.TableCell, {
                                            children: "Fecha Plena"
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx(material_.TableCell, {})
                                    ]
                                })
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx(material_.TableBody, {
                                children: items.map((customer)=>{
                                    const isSelected = selected.includes(customer.id);
                                    const createdAt = (0,external_date_fns_.format)(customer.createdAt, "dd/MM/yyyy");
                                    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(material_.TableRow, {
                                        hover: true,
                                        selected: isSelected,
                                        children: [
                                            /*#__PURE__*/ jsx_runtime_.jsx(material_.TableCell, {
                                                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(material_.Stack, {
                                                    alignItems: "center",
                                                    direction: "row",
                                                    spacing: 2,
                                                    children: [
                                                        /*#__PURE__*/ jsx_runtime_.jsx(material_.Avatar, {
                                                            src: customer.avatar,
                                                            children: getInitials(customer.name)
                                                        }),
                                                        /*#__PURE__*/ jsx_runtime_.jsx(material_.Typography, {
                                                            variant: "subtitle2",
                                                            children: customer.name
                                                        })
                                                    ]
                                                })
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)(material_.TableCell, {
                                                children: [
                                                    customer.address.city,
                                                    ", ",
                                                    customer.address.state,
                                                    ",",
                                                    " ",
                                                    customer.address.country
                                                ]
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx(material_.TableCell, {
                                                children: customer.phone
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx(material_.TableCell, {
                                                children: createdAt
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx(material_.TableCell, {
                                                children: createdAt
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx(material_.TableCell, {
                                                children: createdAt
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)(material_.TableCell, {
                                                children: [
                                                    /*#__PURE__*/ jsx_runtime_.jsx(material_.Button, {
                                                        size: "large",
                                                        startIcon: /*#__PURE__*/ jsx_runtime_.jsx((Edit_default()), {
                                                            style: {
                                                                marginRight: "-9px"
                                                            }
                                                        }),
                                                        variant: "contained",
                                                        component: (link_default()),
                                                        href: `/members/editar?id=${customer.id}`
                                                    }),
                                                    " ",
                                                    /*#__PURE__*/ jsx_runtime_.jsx(material_.Button, {
                                                        size: "large",
                                                        position: "center",
                                                        color: "error",
                                                        startIcon: /*#__PURE__*/ jsx_runtime_.jsx((DeleteForever_default()), {
                                                            style: {
                                                                marginRight: "-9px"
                                                            }
                                                        }),
                                                        variant: "contained",
                                                        onClick: handleClick
                                                    })
                                                ]
                                            })
                                        ]
                                    }, customer.id);
                                })
                            })
                        ]
                    })
                })
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(material_.TablePagination, {
                component: "div",
                count: count,
                onPageChange: onPageChange,
                onRowsPerPageChange: onRowsPerPageChange,
                page: page,
                rowsPerPage: rowsPerPage,
                rowsPerPageOptions: [
                    5,
                    10,
                    25
                ]
            })
        ]
    });
};
CustomersTable.propTypes = {
    count: (external_prop_types_default()).number,
    items: (external_prop_types_default()).array,
    onDeselectAll: (external_prop_types_default()).func,
    onDeselectOne: (external_prop_types_default()).func,
    onPageChange: (external_prop_types_default()).func,
    onRowsPerPageChange: (external_prop_types_default()).func,
    onSelectAll: (external_prop_types_default()).func,
    onSelectOne: (external_prop_types_default()).func,
    page: (external_prop_types_default()).number,
    rowsPerPage: (external_prop_types_default()).number,
    selected: (external_prop_types_default()).array
};


/***/ })

};
;