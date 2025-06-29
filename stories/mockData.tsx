import React from "react";
import { createColumnHelper } from "@tanstack/react-table";

// Type definition for our data
export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  status: "active" | "inactive" | "pending";
  visits: number;
  progress: number;
  email: string;
  createdAt: Date;
};

// Create a column helper
const columnHelper = createColumnHelper<Person>();

// Generate columns with different configurations
export const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    size: 60,
    enableSorting: false,
  }),
  columnHelper.accessor("firstName", {
    header: "First Name",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("lastName", {
    header: "Last Name",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("age", {
    header: "Age",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          info.getValue() === "active"
            ? "bg-green-100 text-green-800"
            : info.getValue() === "inactive"
            ? "bg-red-100 text-red-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("visits", {
    header: "Visits",
  }),
  columnHelper.accessor("progress", {
    header: "Profile Progress",
    cell: (info) => (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${info.getValue()}%` }}
        ></div>
      </div>
    ),
  }),
  columnHelper.accessor("email", {
    header: "Email",
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => info.getValue().toLocaleDateString(),
  }),
];

// Utility function to generate random person data
const generatePerson = (id: number): Person => {
  const firstName = [
    "John",
    "Jane",
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Edward",
    "Fiona",
    "George",
    "Hannah",
  ][Math.floor(Math.random() * 10)];
  const lastName = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Miller",
    "Davis",
    "Garcia",
    "Rodriguez",
    "Wilson",
  ][Math.floor(Math.random() * 10)];
  const age = Math.floor(Math.random() * 50) + 18;
  const status = ["active", "inactive", "pending"][
    Math.floor(Math.random() * 3)
  ] as "active" | "inactive" | "pending";
  const visits = Math.floor(Math.random() * 100);
  const progress = Math.floor(Math.random() * 100);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  const createdAt = new Date(
    Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)
  );

  return {
    id: `person-${id}`,
    firstName,
    lastName,
    age,
    status,
    visits,
    progress,
    email,
    createdAt,
  };
};

// Generate a list of people
export const generatePeople = (count: number): Person[] => {
  return Array.from({ length: count }, (_, i) => generatePerson(i + 1));
};

// Generate data sets of different sizes
export const smallDataSet = generatePeople(10);
export const mediumDataSet = generatePeople(50);
export const largeDataSet = generatePeople(200);
export const hugeDataSet = generatePeople(1000);
