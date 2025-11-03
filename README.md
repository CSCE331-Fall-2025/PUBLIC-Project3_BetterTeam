# better_team_project3


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

