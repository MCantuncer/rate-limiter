# rate-limiter 🚀

This API has 5 different endpoints which have different weights.

⚠️ Requests are limited (can be changed on **.env**) depending on keys (**for _private_**, it can be uuid which is generated via email or private-api-key which is stored in **.env**, **for _public_**, it's **IP**). 

🎧 Limit is represented as points, like if user has 100 requests limit for public endpoint, s/he has 100 points for related endpoints.

🏋🏽 **Weight** stands for how many points that requester needs to spend to execute request. 

📚 Used stack: NodeJS (TS), Redis

🏠 Redis stores generated uuid data by email and first request date and total request count in specified minutes (**_PER_X_MINUTES_**: can be changed in **.env**) 

🏃🏽‍♂️ You can run it as followings:

⏱ Timezone conversion is ignored and all time data will come as UTC+0

- docker compose build
- docker compose up
- visit http://localhost:8000 via browser or Postman like platform, and it's good to go 🚀
