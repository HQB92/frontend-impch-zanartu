"use strict";
exports.id = 996;
exports.ids = [996];
exports.modules = {

/***/ 990:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "c": () => (/* binding */ useSelection)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const useSelection = (items = [])=>{
    const [selected, setSelected] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{
        setSelected([]);
    }, [
        items
    ]);
    const handleSelectAll = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(()=>{
        setSelected([
            ...items
        ]);
    }, [
        items
    ]);
    const handleSelectOne = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((item)=>{
        setSelected((prevState)=>[
                ...prevState,
                item
            ]);
    }, []);
    const handleDeselectAll = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(()=>{
        setSelected([]);
    }, []);
    const handleDeselectOne = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((item)=>{
        setSelected((prevState)=>{
            return prevState.filter((_item)=>_item !== item);
        });
    }, []);
    return {
        handleDeselectAll,
        handleDeselectOne,
        handleSelectAll,
        handleSelectOne,
        selected
    };
};


/***/ }),

/***/ 8355:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "i": () => (/* binding */ applyPagination)
/* harmony export */ });
function applyPagination(documents, page, rowsPerPage) {
    return documents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}


/***/ })

};
;