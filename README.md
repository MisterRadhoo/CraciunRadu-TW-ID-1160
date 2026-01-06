### Proiect Appointment Manager cu un serviciu integrat, Google Calendar

**Appointment Manager este un REST API, care utilizeaza o baza de date pentru gestionarea utilizatorilor (autentificare JWT), programarilor si sincronizeaza programarile intr-un serviciu extern Google Calendar prin OAuth2.**
---
### Tehnologii folosite (dependencies pentru node.js)

- **node.js - server side** 
- **express - rute http**
- **sqlite3 - baza de date** 
- **Sequelize - mapare a relatiilor**
- **JWT(jsonwebtoken)**
- **cookie-parser**
- **body-parser**
- **bcrypt - criptare parola**
- **dotenv**
- **nodemon**
- **morgan**
- **googleapis - (Calendar API + Oauth2)**
- **faker.js - implementare date fake si stocare in baza de date pentru testare, care consuma API in Insomnia, Postman, etc..**
---
## Ghid de instalare proiect

#### 1.Clonare repository

```bash

git clone https://github.com/MisterRadhoo/CraciunRadu-TW-ID-1160.git

```

#### 2.cd backend - schimba in directorul de lucru (comada CLI)

```bash

cd backend

```

#### 3.instalare dependente

```bash

npm install

```

#### 4.Initializare baza de date (optional) - pentru testare

```bash

node seed.js

```

#### 5.Start server

```bash

npm run dev 

```

**or**

```bash

nodemon server.js

```
---

## Resurse - endpoints
- **/api/auth  - ruta auth**
- **/api/users - ruta pentru utilizatori**
- **/api/google/calendar - ruta sincronizare appointments in Google Calendar**
- **/api/google - ruta de autentificare Google OAuth2**
- **/api/appointment - ruta appointments**
##

## Operatii REST API

- **GET /http://localhost:4500/ - URL server**
##

#### Endpoint /api/auth
---
Auth Routes:

| @Route                  | @Type  | @Access   | @Description                 |
| ------------------------|--------|-----------|------------------------------|
| /api/auth/login         | POST   | public    | User login account           |
| /api/auth/refresh       | POST   | public    | User refresh token/jwt token |
| /api/auth/logout        | POST   | public    | User logout account          |

---
- **POST /api/auth/login**
```json
{
	"fullName": "String Name",
	"password": "********"
}
```

**Autentificarea se face prin JWT (Bearer Token).Header-ele necesare:**

```
Authorization: Bearer <ACCESS_TOKEN>
```
**and**

```
x-refresh-token: <REFRESH_TOKEN>

```

- **POST /api/auth/refresh - reinprospatare refresh token**
```
x-refresh-token: <REFRESH_TOKEN>
```

- **POST /api/auth/logout - la delogare se pierde JWT token si refresh token**
##

#### Endpoint /api/users

---
#### User Schema

```json
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

---
User Routes:

| @Route                  | @Type  | @Access      | @Description      |
| ------------------------|--------|--------------|-------------------|
| /api/users/:id          | GET    | public       | Get a single user |
| /api/users              | POST   | public       | Add/create a user |
| /api/users/:id          | PATCH  | private(JWT) | Update a user     |
| /api/users/:id          | DELETE | private(JWT) | Delete a user     |

---

- **GET /api/users/:id - returneaza un utilizator dupa id**
#### Exemplu
- **GET http://localhost:4500/api/users/1/**


- **POST /api/users - adauga un utilizator**
```json
{
	"fullName": "Radhoo_Radhoo",
	"password": "***********",
	"email": "radhooAPI@fakerEmail.com"	
}
```
#### Response: return json 201 created
```json
{
	"message": "User implementat cu succes!",
	"user": {
		"id": 11,
		"fullName": "Radhoo_Radhoo",
		"email": "radhooAPI@fakerEmail.com"
	}
}
```
##

- **PATCH /api/users/:id - actualizare user dupa id (JWT)**
```json
{
    "fullName": "Mr.Radhoo",
    "password": "*********"
}
```

- **DELETE /api/users/:id - sterge utilizator dupa id (JWT)**

---
## Endpoint /api/google/calendar
**Rute private, se folosesc numai cu (JWT) si Google OAuth2**
##
- **POST /api/google/calendar/sync/:appointmentId - sincronizeaza un appointment dupa id, in Google Calendar**
- **PUT /api/google/calendar/sync/:appointmentId - sincronizeaza actualizare appointment dupa id, in Google Calendar**
- **DELETE /api/google/calendar/sync/:appointmentId - sincronizeaza si sterge un appointment dupa id, in Google Calendar**
##

## Endpoint /api/google
- **GET /api/google/auth/:id - logare cu Google OAuth2 (browser)**
- **GET /api/google/callback - primire code si stare**
---

#### Endpoint /api/appointment
**Note: User-ul trebuie sa fie logat si sa aiba (JWT), appointment-urile sunt create pe baza de user id.**
---

#### Appointment Schema
```json
{
	"id": 1,
    "title": "StringTitle",
	"description": "stringDescription",
	"startTime": "YYYY-MM-DDT00:00:00",
	"endTime": "YYYY-MM-DDT00:00:00",
	"userId": 2,
	"location": "stringLocation",
	"googleCalendarEventId": "6bq8c1h2i3j4k5l6m7n8o9p0",
	"status": "scheduled",
	"created_at": "2025-11-23T14:48:34.123Z",
	"updated_at": "2025-11-23T14:48:34.123Z"
}
```
---

Appointment Routes:

| @Route                         | @Type  | @Access                 | @Description             |
| -------------------------------|--------|-------------------------|--------------------------|
| /api/appointment/user/:userId  | GET    | private/User acc. (JWT) | Get user appointments    |              
| /api/appointment               | POST   | private/User acc. (JWT) | Create appointment       |                
| /api/appointment/:id           | GET    | private/User acc. (JWT) | Get a single appointment |            
| /api/appointment/:id           | PATCH  | private/user acc. (JWT) | Update appointment       |         
| /api/appointment/:id           | DELETE | private/user acc. (JWT) | Delete appointment       |             

---

- **POST /api/appointment -- implementare nou appointment. (JWT)**
```json
{
    "title": "Renewal of employee contracts",
	"description": "Based by individual performance and commitment, every employee   should get a new contract, after evalution",
	"startTime": "2026-01-16T10:00:00",
	"endTime": "2026-01-19T11:30:00",
	"location": "Plaza Tower,1 floor room 145 - Downtown LA"
}
```
  
- **GET /api/appointment/user/:userId - returneaza appointments ale utilizatorului dupa id-ul acestuia. (JWT)**

- **GET /api/appointment/:id - returneaza appointment dupa id. (JWT)**

- **PATCH /api/appointment/:id - actulizeaza un appointment dupa id. (JWT)**
```json
{
    "title": "Renewal of employee contracts, second term",
	"description": "Based by individual performance and commitment, every employee   should get a new contract, after evalution",
	"startTime": "2026-02-16T10:00:00",
	"endTime": "2026-02-19T12:30:00",
	"location": "Plaza Tower, 2nd floor, room 1A - Baxter Wing LA",
	"status": "completed"   
}
```

- **DELETE /api/appointment/:id - stergere appointment dupa id.(JWT)**
 ---

**NOTE: Fisierul .env e integrat in proiect, se gaseste in folder backend**
