# Taskpro-Backend

POST http://localhost:8080/api/users/register

body:
{
"name": "John Doe",
"email": "johndoe6@example.com",
"password": "1234A12"
}

POST http://localhost:8080/api/users/login

params:
ACCESS_TOKEN_KEY=Ascf12
REFRESH_TOKEN_KEY=Asf51
body:

{

    "email": "johndoe6@example.com",
    "password": "1234A12"

}

GET http://localhost:8080/api/users/current

Authorizathion: beaer token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2M2EzZGEwNDQ5YmQ5N2VjNWY5YmY1NyIsImlhdCI6MTcxNTA5ODA1OSwiZXhwIjoxNzE1MDk4NjU5fQ.OjZWHT8iObHyjKRTMDs5uxSYBR8VVi9xcqBO4vO_RXo
(accessToken din login)
