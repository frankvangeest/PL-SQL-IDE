# Coding Guidelines

## General
This project contains both Rust (Tauri) and JavaScript (Plain) code.
The Rust Framework is used for the backend and the UI, and the JavaScript is used for the frontend.
For javascript we use plain javascript, no frameworks or libraries, as much as possible.


### Naming
Use clear descriptive names for variables, functions, etc., that makes clear what it is or does.


#### Rust
We adhere to the Rust style guide.
In Rust we use the Rust Language Server (RLS) for linting and formatting.


#### JavaScript
When defining more than one variable below each other, put them in nice colomns so that the assigment operator is vertically aligned. E.g.:
```javascript
const codeEditor     = document.getElementById('code');
const lineNumbersDiv = document.getElementById('line-numbers');
const fileTree       = document.getElementById('file-list');
const tabs           = document.getElementById('tabs');
```




