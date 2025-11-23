### Proiect Appointment Manager cu un serviciu integrat, Google Calendar

***Appointment Manager este un REST API, care utilizeaza o baza de date pentru gestionarea utilizatorilor (autenfiricare JWT), programarilor si sincronizeaza programarile intr-un serviciu extern Google Calendar prin OAuth2.***
---
### Tehnologii folosite (dependencies pentru node.js)
-**npm install - instalare dependente**
- **node.js + express - implementare proiect cu arhitectura modulara**
- **sqlite3 - baza de date, Sequelize - mapare a relatiilor**
- **Auth - JWT(jsonwebtoken)**
- **bcrypt - criptare parola**
- **dotenv**
- **nodemon**
- **googleapis - (Calendar API + Oauth2)**
- **faker.js - implementare date fake si stocare in baza de date pentru testare API, in INSOMNIA**

### Server
- **node seed.js - populare baza de date cu date fake pentru test**
- **npm run dev sau nodemon.server.js - pornire server**
---
### Resurse - endpoints
- **/api/auth  - ruta auth**
- **/api/users - ruta pentru utilizatori**
- **/api/google/calendar - ruta sincronizare appointments in Google Calendar**
- **/api/google - ruta de autentificare Google OAuth2**
- **/api/appointment - ruta appointments**

---
### Operatii REST API

- **GET /http://localhost:4500/ - URL server**

### endpoint /api/auth
- **POST /api/auth/login**
```json
campuri:
{
		"fullName": "String Name",
		"password": "********"
}
```

**Autentificarea se face prin JWT (Bearer Token).Header-ele necesare:**

```
Authorization: Bearer <ACCESS_TOKEN>
x-refresh-token: <REFRESH_TOKEN>

```

- **POST /api/auth/refresh - reinprospatare refresh token**
```
x-refresh-token: <REFRESH_TOKEN>
```
- **POST /api/auth/logout - la delogare se pierde JWT token si refresh token**

### endpoint /api/users
```json
campuri:
{
	"id": 2,
	"fullName": "StringName",
	"email": "StringEmail@gmail.com",
	"googleAccessToken": null,
	"googleRefreshToken": null,
	"googleTokenExpire": null,
	"created_at": "2025-11-23T14:48:34.123Z",
	"updated_at": "2025-11-23T14:48:34.123Z"
}
```
- **GET /api/users/:id - returneaza un utilizator dupa id**
- **POST /api/users - adauga un utilizator**
```json
campuri:
{
		"fullName": "String Name",
		"password": "***********",
		"email": "stringName@exampleMail.com"
	
}
```
- **PATCH /api/users/:id - actualizare user dupa id**
```json
  campuri:
{
            "fullName": "String Name",
            "password": "*********",
}
```
- **DELETE /users/:id - sterge utilizator dupa id**

### endpoint /api/google/calendar