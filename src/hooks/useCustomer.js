import {useMemo} from "react";
import {applyPagination} from "../utils/apply-pagination";

const useCustomers = (page, rowsPerPage, response) => {
    return useMemo(() => {
        return applyPagination(response, page, rowsPerPage);
    }, [page, rowsPerPage, response]);
};

const useCustomerIds = (customers) => {
    return useMemo(() => {
        return customers.map((customer) => customer.rut);
    }, [customers]);
};

export {useCustomers, useCustomerIds};