# better_team_project3
Full Stack POS web app built using React frontend & express, node, postgres backend. 

## Development Environment Setup
- Need to get node and npm on system... please just use wsl/linux. Since Node versions, npm version, and all the dependices... do the following:
``` 
# make sure curl is installed
sudo apt update
sudo apt install curl -y

# install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash

# reload your shell so nvm is available
source ~/.bashrc

# install Node (LTS version)
nvm install --lts

# verify
node -v
npm -v
```


- Clone the Repo if haven't already
    - Get the most recent `git checkout main`, `get fetch origin main`, `git pull`
- Get dependencies... these are local depencides for a project and hence will live in project dir
    - Server stuff (express, node.js, and wtv dependices they use)
        - `cd server`
        - `npm install`
        - `npm run dev` -- test; should start the backend
    - Client stuff (react)
        - `cd client`
        - `npm install`
        - `npm run dev` --> test; should start the frontend using vite
- Make dev easy by adding support to run frontend and backend concurrently
    - go to root of project
    - `npm install concurrently` 
    - `npm run dev` --> should've ran both the frontend and backend

- Handle `.env` via discord




## File Structure:
>[!Important]
> the `.env` file will contain secrets that shouludn't be shared here... resort to discord for that. It will be apart of .gitignore and shouldn't be tracked
```
panda-pos/
│
├── client/                     # Frontend (React + Vite + TypeScript)
│   ├── assets/                 # Static assets served directly
│   ├── src/
│   │   ├── components/         # Reusable UI blocks (Button, MenuItem, Navbar)
│   │   ├── pages/              # Page routes (Home, Checkout, Manager, Kitchen)
│   │   ├── App.tsx             # Root React component
│   │   └── main.tsx            # ReactDOM.createRoot() entry point
│   ├── vite.config.ts          # Vite build & proxy config
│   ├── tsconfig.json           # TypeScript compiler settings
│   ├── package.json            # Frontend dependencies
│   └── .gitignore              # Ignore local build files
│
├── server/                     # Backend (Express + Node)
│   ├── app.js                  # Main Express server file
│   └── package.json            # Backend dependencies
│
├── .env                        # Environment variables (ignored)
├── .gitignore                  # Global ignore rules
└── README.md                   # Documentation

```

