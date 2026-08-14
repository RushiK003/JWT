1️⃣ User types
     Email
     Password
        ▼
2️⃣ React stores them using useState()
        ▼
3️⃣ User clicks Login
        ▼
4️⃣ handleLogin()
        ▼
5️⃣ API.post("/login")
        ▼
6️⃣ Axios sends HTTP POST request
        ▼
7️⃣ Express receives request
        ▼
8️⃣ express.json() converts JSON into req.body
        ▼
9️⃣ Controller (currently inside server.js)
checks email & password
                │
        ┌──────┴────────────┐
        │                   │
        │ Correct    |      │ Wrong
        ▼            |      ▼
        200 OK       |     401 Unauthorized
        ▼            |       ▼
                     |
        {            |  {
        message:     |    message:
        "Login       |   "Invalid
        Successful"  |    Credentials"
        }            |  }

        |                  |
        --------------------
                ▼
10️⃣ Axios receives the response
        ▼
11️⃣ setMessage(response.data.message)
        ▼
12️⃣ React re-renders
        ▼
Message appears on the screen