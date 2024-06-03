# Medium clone

> A MERN stack application which replicates Medium's core functionality, allowing users to create accounts, follow each other, and like articles. Users can write and publish their own content, while a personalized feed displays updates from followed authors.

### Current features:

- Signup/login
- Following/followers
- Create/delete/update articles with rich editor
- Likes and shares to the articles
- Bio/title under the profile (supports markdown)
- Settings to change (email/password/avatar/bio/title/social likes, etc)
- Home feeds from people you follow
- Trending articles based on highest interactions for last 7 days

### Up-comming features:

- Notifications
- Comments
- Listen to article content
- Bookmark article

### Get started

```
    npm i
```

```
    npm run dev
```

- add `.env` file in the root of the project with these keys and values `(fill out empty quotes with yours)`:

```
NODE_ENV="dev"
JWT_SECRET="anyDummyCode"
JWT_EXPIRATION="1d"
PORT=3000
EXPRESS_LIMIT="2mb"
MONGO_URI=""
DOMAIN="put your live domain"

# firebase
apiKey=""
authDomain=""
projectId=""
storageBucket=""
messagingSenderId=""
appId=""
```
