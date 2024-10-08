# Requirements

## Introduction
This is a cross-platform desktop application for working with Oracle PL-SQL Databases.
It is built using the Rust programming language and the Tauri framework for the backend and html and plain javascript for the frontend.
This file contains a set of requirements the application should adhere to. But also some guidelines and recommendations.
These may be changed if needed, but should be discussed first with the project owner.
The idea is that this document should be a living document, meaning that it should be updated as the application evolves.
The project should start simple, with a focus on functionality and usability, and then grow from there. 
Without to many frameworks and libraries. Just build it as needed.



## Dependencies
* Oracle Database
  The whole purpose of this application is to connect to an Oracle Database, run queries and edit database objects.
  The application should be able to connect to a Oracle Database using a Oracle Instant Client on the system, 
  keep the connection alive and allow the user to run queries and edit database objects.
* Oracle Instant Client
  This application makes use of Oracle Instant Client installed on the system to connect to the Oracle Database.
* Tauri
  This application is built using Tauri, a framework for building cross-platform desktop applications.
* No Javascript frameworks, just plain Javascript.
  This application is built using plain Javascript, no Javascript frameworks are allowed. This is to keep the application lightweight and easy to maintain. No Typescript allowed either.


## Architecture requirements
* Cross-platform desktop application
  The application should be able to run on Windows (and later also on Linux and MacOS).
* No NPM, Yarn or any other package manager. Only cargo that already exists in the Rust ecosystem.
* Backend: Rust (Tauri)
  The backend should be built using Rust (Tauri), as it is a cross-platform language, with good memory safety guarantees, performance and security.
* Frontend: Plain Javascript
  The frontend should be built using plain Javascript, no frameworks or libraries, as much as possible.
* Multiple windows support:
  The application should be able to open multiple windows with different database connections.
  E.g. one database connection to a development database, and one database connection to a testing database.


## Primary Functional requirements
* Connect to Oracle Database
  * Use the TNSNames.ora file to connect to the database.
* Save and load SQL files
* Code editor
  * create, edit and run SQL queries
  * create, edit and compile PL-SQL
* Browse database objects, such as tables, views, procedures, functions, etc.
* Run queries and view results
* Edit database objects, such as tables, views, procedures, functions, etc.
* Create new database objects, such as tables, views, procedures, functions, etc.
* Drop existing database objects, such as tables, views, procedures, functions, etc.


## Secondary Functional requirements
* Syntax highlighting
* Debugger
* Compare database objects between two different database connections.


## User interface requirements

* Application
  * Dark theme
  * Top Menu
  * Left sidebar for files
  * Code editor in the middle
    * with tabs for switching between files
    * with line numbers
    * with syntax highlighting
    * with PL-SQL and SQL code highlighting
    * with insert statement highlighting, when clicking on the value, the corresponding column lights up.
  * Right sidebar for output, results, data preview, etc.
  * Status bar at the bottom
  
* Views:
  * Table data preview
  * Table data export
  * Table data import
  * Table data editor

* Sidebar for project file tree
  * Playbooks, for running queries.

* Top Menu
  * File menu
    * New Playbook
    * Open Playbook
    * Save Playbook
    * Save Playbook as...
    * Exit
  * Edit menu
    * Undo
    * Redo
  * Run menu
    * Run query
    * Run PL/SQL
  * View menu
    * View results
    * View output
    * View PL/SQL execution plan
    * View PL/SQL execution plan for last execution
    * View PL/SQL execution plan for current execution
  * Help menu
    * About

* Status bar



## Non-functional requirements
* Performance: Non-blocking, fast response times.
* Security
* Usability
* Reliability: The application should be reliable, it should not crash and it should not lose data.
* Maintainability: The application should be easy to maintain, modify and extend.
* Portability: The application is currently only build for Windows, but should later also run on Linux and MacOS.

