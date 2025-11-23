# Proiect Appointment Manager cu un serviciu integrat, Google Calendar

Appointment Manager este un REST API, care utilizeaza o baza de date pentru gestionarea utilizatorilor (autenfiricare JWT), programarilor si sincronizeaza programarile intr-un serviciu extern Google Calendar prin OAuth2.

## Tehnologii folosite (dependencies pentru node.js)
- **node.js + express - implementare proiect cu arhitectura modulara**
- **sqlite3 - baza de date, Sequelize - mapare a relatiilor**
- **Auth - JWT(jsonwebtoken)**
- **bcrypt - criptare parola**
- **dotenv**
- **nodemon**
- **googleapis - (Calendar API + Oauth2)**
- **faker.js - implementare date fake si stocare in baza de date pentru testare API, in INSOMNIA**

## Resurse - endpoints
- **/api/auth  - ruta auth**
- **/api/users - ruta pentru utilizatori**
- **/api/google/calendar - ruta sincronizare appointments in Google Calendar**
- **/api/google - ruta de autentificare Google OAuth2**
- **/api/appointment - ruta appointment**
## Operatii REST API


