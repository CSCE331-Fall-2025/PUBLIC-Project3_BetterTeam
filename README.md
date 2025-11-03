# better_team_project3

### Development Environment Setup
Quick lil dev env setup... don't have to follow. Meant for wsl/linux:
- Need node and npm....
  - Check if node is downloaded: `node -v`
  - Check if npm is downloaded: 'npm -v`
  - Install both with: `sudo apt install -y nodejs npm`
    - Check if both were downloaded
- Get other frameworks:
  - `npm install express cors dotenv pg`
    - `express` --> express.js
    - 'cors`    --> something to help react & express integrate
    - `dotenv`  --> automatically loads `.env` for environment variables in build
    - `pg`      --> postgresql


### File Structure:
>[!Important]
> the `.env` file will contain secrets that shouludn't be shared here... resort to discord for that. It will be apart of .gitignore and shouldn't be tracked
```
panda-pos/
│
├── client/                     # Frontend (React)
│   ├── src/
│   │   ├── components/         # UI blocks (Button, MenuItem, Navbar)
│   │   ├── pages/              # Each page route (Home, Checkout, Manager)
│   │   ├── App.jsx             # Main app entry
│   │   └── index.jsx           # ReactDOM.render() entry point
│   ├── package.json
│   └── vite.config.js          # or CRA config
│
├── server/                     # Backend (Express + Node)
│   ├── app.js                  # Express server setup
│   ├── routes.js               # Define endpoints directly here (for simplicity)
│   ├── db.js                   # Database connection
│   └── package.json
│
├── db/
│   ├── schema.sql              # CREATE TABLE statements
│   └── seed.sql                # Sample data
│
├── .env                        # secrets (db login, etc)
│
└── README.md
```

