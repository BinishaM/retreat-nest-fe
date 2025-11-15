import React, { useEffect, useState, useRef } from "react";
import PageBreadcrumb from "@/common/Breadcrumb";

const ComponentWrapper = ({ children }: { children: any }) => {


    return (
        <>
            <PageBreadcrumb />
            <div className="rounded-2xl border border-gray-800 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
                {children}
            </div>
        </>
    );
};

export default ComponentWrapper;
