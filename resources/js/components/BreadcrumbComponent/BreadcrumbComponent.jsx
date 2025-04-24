"use client";
import React from "react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export function BreadcrumbComponent(props) {
    const { pageName, pageLink } = props;
    return (
        <Breadcrumb aria-label="Solid background breadcrumb example" className="bg-gray-50 px-5 py-3 dark:bg-gray-800">
        <Breadcrumb.Item href="#" icon={HiHome}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#">Projects</Breadcrumb.Item>
        <Breadcrumb.Item>Flowbite React</Breadcrumb.Item>
      </Breadcrumb>
    );
} 
