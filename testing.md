# health
curl http://localhost:5000/health

# Testing Of Auth SignUp
curl -X POST http://localhost:5000/api/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@intellmeet.com\",\"password\":\"Test@1234\"}"

output- {"success":true,"message":"Account created successfully","accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWViNjYzYTRhZjc0MzcyYzMxMmVmYjAiLCJyb2xlIjoibWVtYmVyIiwiaWF0IjoxNzc3MDM0ODExLCJleHAiOjE3NzcwMzU3MTF9.YiyMNg0P4Ebw1Wcs2Fo1L5N10v9sJUFMZN8I_beP1A0","user":{"name":"Test User","email":"test@intellmeet.com","role":"member","avatar":"","bio":"","isActive":true,"_id":"69eb663a4af74372c312efb0","createdAt":"2026-04-24T12:46:50.372Z","updatedAt":"2026-04-24T12:46:51.335Z"}}

# Testing Of Auth Login In
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -c cookies.txt ^
  -d "{\"email\":\"test@intellmeet.com\",\"password\":\"Test@1234\"}"

output- {"success":true,"message":"Login successful","accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWViNjYzYTRhZjc0MzcyYzMxMmVmYjAiLCJyb2xlIjoibWVtYmVyIiwiaWF0IjoxNzc3MDM0OTcxLCJleHAiOjE3NzcwMzU4NzF9.Yzi9KmD5pH_0IaCFnePf7G9CK7bZl3BSQ0EDxbM5HME","user":{"_id":"69eb663a4af74372c312efb0","name":"Test User","email":"test@intellmeet.com","role":"member","avatar":"","bio":"","isActive":true,"createdAt":"2026-04-24T12:46:50.372Z","updatedAt":"2026-04-24T12:49:31.607Z"}}


# get My Profile 
curl http://localhost:5000/api/auth/me ^
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

  output- {"success":true,"user":{"_id":"69eb663a4af74372c312efb0","name":"Test User","email":"test@intellmeet.com","role":"member","avatar":"","bio":"","isActive":true,"createdAt":"2026-04-24T12:46:50.372Z","updatedAt":"2026-04-24T12:49:31.607Z"}}

# update 
curl -X PATCH http://localhost:5000/api/users/profile ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Updated Name\",\"bio\":\"Building IntellMeet\"}"

output- {"success":true,"message":"Profile updated","user":{"_id":"69eb663a4af74372c312efb0","name":"Updated Name","email":"test@intellmeet.com","role":"member","avatar":"","bio":"Building IntellMeet","isActive":true,"createdAt":"2026-04-24T12:46:50.372Z","updatedAt":"2026-04-24T12:52:14.792Z"}}

# rate limit - hit login 11 times faster 
for /L %i in (1,1,11) do curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"x@x.com\",\"password\":\"wrong\"}"

output - 

{"success":false,"message":"Invalid credentials"}
C:\Users\absol>curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"x@x.com\",\"password\":\"wrong\"}"
{"success":false,"message":"Invalid credentials"}
C:\Users\absol>curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"x@x.com\",\"password\":\"wrong\"}"
{"success":false,"message":"Invalid credentials"}
C:\Users\absol>curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"x@x.com\",\"password\":\"wrong\"}"
{"success":false,"message":"Invalid credentials"}
C:\Users\absol>curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"x@x.com\",\"password\":\"wrong\"}"
{"success":false,"message":"Invalid credentials"}
C:\Users\absol>curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"x@x.com\",\"password\":\"wrong\"}"
{"success":false,"message":"Invalid credentials"}
C:\Users\absol>curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"x@x.com\",\"password\":\"wrong\"}"
{"success":false,"message":"Invalid credentials"}
C:\Users\absol>curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"x@x.com\",\"password\":\"wrong\"}"
{"success":false,"message":"Invalid credentials"}
C:\Users\absol>curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"x@x.com\",\"password\":\"wrong\"}"
{"success":false,"message":"Invalid credentials"}
C:\Users\absol>curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"x@x.com\",\"password\":\"wrong\"}"
{"success":false,"message":"Invalid credentials"}
C:\Users\absol>curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"x@x.com\",\"password\":\"wrong\"}"
{"success":false,"message":"Too many requests from this IP. Please try again after 15 minutes."}


# create meeting 
curl -X POST http://localhost:5000/api/meetings ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Team Standup\",\"description\":\"Daily sync\",\"agenda\":\"Updates + blockers\"}"

output- {"success":true,"meeting":{"title":"Team Standup","description":"Daily sync","host":"69eb663a4af74372c312efb0","participants":[{"user":"69eb663a4af74372c312efb0","role":"host","joinedAt":"2026-04-24T12:53:43.877Z"}],"status":"scheduled","isRecorded":false,"recording":{"duration":0},"agenda":"Updates + blockers","_id":"69eb67d74af74372c312efc4","roomId":"9f110d6a-ab67-49ae-9898-484d67aea882","createdAt":"2026-04-24T12:53:43.891Z","updatedAt":"2026-04-24T12:53:43.891Z"}}


# list meetings
curl http://localhost:5000/api/meetings ^
  -H "Authorization: Bearer YOUR_TOKEN"

output- {"success":true,"total":1,"page":1,"pages":1,"meetings":[{"recording":{"duration":0},"_id":"69eb67d74af74372c312efc4","title":"Team Standup","description":"Daily sync","host":{"_id":"69eb663a4af74372c312efb0","name":"Updated Name","email":"test@intellmeet.com","avatar":""},"participants":[{"user":{"_id":"69eb663a4af74372c312efb0","name":"Updated Name","avatar":""},"role":"host","joinedAt":"2026-04-24T12:53:43.877Z"}],"status":"scheduled","isRecorded":false,"agenda":"Updates + blockers","roomId":"9f110d6a-ab67-49ae-9898-484d67aea882","createdAt":"2026-04-24T12:53:43.891Z","updatedAt":"2026-04-24T12:53:43.891Z"}]}

# get meeting by id
# First call — cache MISS (check server logs)
curl http://localhost:5000/api/meetings/MEETING_ID_HERE ^
  -H "Authorization: Bearer YOUR_TOKEN"

# Second call — cache HIT ({"fromCache":true} in response)
curl http://localhost:5000/api/meetings/MEETING_ID_HERE ^
  -H "Authorization: Bearer YOUR_TOKEN"

# join -> leave -> end
# Join
curl -X POST http://localhost:5000/api/meetings/MEETING_ID/join ^
  -H "Authorization: Bearer YOUR_TOKEN"

# Leave  
curl -X POST http://localhost:5000/api/meetings/MEETING_ID/leave ^
  -H "Authorization: Bearer YOUR_TOKEN"

# End (host only)
curl -X POST http://localhost:5000/api/meetings/MEETING_ID/end ^
  -H "Authorization: Bearer YOUR_TOKEN"


# Logout
curl -X POST http://localhost:5000/api/auth/logout ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -c cookies.txt ^
  -b cookies.txt


Access Token I got after registering Test User email - test@intellimeet.com and password - Test@1234
token - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWViNjYzYTRhZjc0MzcyYzMxMmVmYjAiLCJyb2xlIjoibWVtYmVyIiwiaWF0IjoxNzc3MDM0ODExLCJleHAiOjE3NzcwMzU3MTF9.YiyMNg0P4Ebw1Wcs2Fo1L5N10v9sJUFMZN8I_beP1A0
