# Medium clone backend

# status codes:
* information responses:
- 100 continue (continue request or ignore if it's finished) 
- 101 switching protocol

* successful responses:
- 200 success 
- 201 created (e.g. POST,PUT) 

* client error responses:
- 400 bad request (e.g. malformed payload)
- 401 unauthorized-not authenticated
- 403 forbidden (user doesn't have access rights to content)
- 404 not found
- 405 method not allowed

* server error responses:
- 500 internal server error
- 501 method not implemented
- 502 bad gateway (e.g. got issue while handling the request)

