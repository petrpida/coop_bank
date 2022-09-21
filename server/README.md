### start the server for local development
in the terminal at **server** folder of the project:
* run (only once) ```npm install```
* run ```npm start```
* now the server should be running on http://localhost:8000 <br />
  to test it, you can type http://localhost:8000/request/list <br />
   into the address-bar in your browser and you should see list of requests as the result

### list of api endpoints 
(more on https://docs.google.com/document/d/11jeV7bfGRC9rJDsRParf_tWZAOWmVXBzGl20bchVWNg/edit?usp=sharing)
* GET /request/list
* GET /request/:id
* GET /login
* POST /request/calculate
* POST /request/create
* PUT /request/:id
* PUT /request/:id/cancel
* PUT /request/:id/approve
* DELETE /request/:id

### You can find logins and passwords of mock users in
* ./storage/users.json