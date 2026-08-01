# HackSphere REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /auth/register`
- **Description**: Register a new platform account with role choice.
- **Body**: `{ name, email, password, role, organization, bio }`
- **Response**: `{ _id, name, email, role, avatar, token }`

### `POST /auth/login`
- **Description**: Authenticate user and return JWT bearer token.
- **Body**: `{ email, password }`
- **Response**: `{ _id, name, email, role, avatar, token }`

### `GET /auth/me`
- **Description**: Fetch current logged-in user profile.
- **Headers**: `Authorization: Bearer <token>`

### `PUT /auth/profile`
- **Description**: Update user profile attributes or password.
- **Headers**: `Authorization: Bearer <token>`

---

## 2. User Governance Endpoints (`/api/users`) [Admin Only]

### `GET /users`
- **Description**: Retrieve all registered platform users.
- **Access**: Administrator

### `PUT /users/:id/block`
- **Description**: Toggle block/unblock status for a user.
- **Access**: Administrator

### `DELETE /users/:id`
- **Description**: Delete a user account.
- **Access**: Administrator

---

## 3. Hackathon Management Endpoints (`/api/hackathons`)

### `GET /hackathons`
- **Query Params**: `search`, `mode`, `status`, `theme`
- **Description**: List all public hackathons with filters.

### `GET /hackathons/:id`
- **Description**: Get full hackathon details, schedule, criteria, and assigned judges.

### `POST /hackathons`
- **Access**: Organizer, Administrator
- **Body**: `{ title, description, theme, mode, venue, startDate, endDate, registrationDeadline, prizePool, maxTeamSize, rules }`

### `PUT /hackathons/:id/assign-judges`
- **Access**: Organizer, Administrator
- **Body**: `{ judgeIds: [userId1, userId2] }`

---

## 4. Team Management Endpoints (`/api/teams`)

### `POST /teams`
- **Access**: Participant, Administrator
- **Body**: `{ name, hackathonId }`
- **Description**: Create team and auto-generate unique invite code (`HS-XXXXXX`).

### `POST /teams/join`
- **Access**: Participant, Administrator
- **Body**: `{ code }`
- **Description**: Join existing team using invite code.

### `GET /teams/my-teams`
- **Access**: Logged-in User
- **Description**: Get all teams user is part of.

---

## 5. Submission & Review Endpoints (`/api/submissions` & `/api/reviews`)

### `POST /submissions`
- **Access**: Participant, Administrator
- **Body**: `{ teamId, hackathonId, projectName, problemStatement, solution, githubUrl, liveDemoUrl, videoUrl, techStack }`

### `POST /reviews`
- **Access**: Judge, Administrator
- **Body**: `{ submissionId, hackathonId, scores: [{ criterionName, marks }], comments }`
- **Description**: Submit rubric evaluation. Recalculates aggregate submission score automatically.

### `GET /analytics/leaderboard/:hackathonId`
- **Description**: Get ranked team standings for hackathon.
