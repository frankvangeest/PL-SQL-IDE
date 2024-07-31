# PL-SQL-IDE
A PLSQL Development tool

My POC for minimalistic PL-SQL editor windows desktop application, written in Rust and Tauri for the backend, and html, css and javascript for the frontend.



All the frontend stuff is in the frontend folder. E.g. html, css, javascript, and images/icons, etc.
For the live service development, just 'cargo run' the live-server-dev project.
Go to http://127.0.0.1:5500/index.html or http://127.0.0.1:5500/code-editor.html
Or build the backend in debug, and make sure the tauri.conf.json "build": {
    "devPath": "http://127.0.0.1:5500/code-editor.html",
} is set to the live-server url.
Note: Layout and design stuff can be done in any browser with your favorite extensions, but for communication with the backend, the backend needs to be running. 

All the backend stuff is in the backend folder. E.g. Rust tauri code, backend data, etc.
Run 'cargo run' in the backend folder.


For development both the live-server and the backend need to be running. Just 'cargo run' them both in the terminal.
The live-server allows you to edit the frontend in real-time and see the changes directly.

For release, only running the backend is enough.
The release build has no live reloading of changes to the frontend. 



Project State:

Currently in Alpha.

Tasks:
- Oracle Database connections backend (WSA)
- Connection management frontend (WIP)
- Text Editor frontend (MVP done)
- Running Queries backend (WIP)
- Saving (sql) Files backend (MVP done)
- Loading (sql) Files backend (WIP)
- Loading ini files backend
    - User preferences (WIP)
    - tnsnames.ora (WSA)
- Saving user preferences backend (WIP)
- Project file tree frontend (MVP done)


WIP: Work In Progress
MVP: Minimal Viable (Sub)Product. (Usable in current project)
WSA: Working StandAlone POC (Needs to be integrated into this project)

