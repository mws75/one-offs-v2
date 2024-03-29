# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## Recent Posts JSON Object Example :

[
{"id": 6, "title": "post1"},
{"id": 2, "title": "post2"},
{"id": 3, "title": "post3"}
]

# The Stack

## Dateabase Stack

I am using a MySQL instance hosted on PlanetScale
Prisma connects to the PlanetScale account

Making changes to Database Command

```
$ npx prisma db push
```

## Authentication

Using Clerk

## Deployment

Using Vercel

## Search Engine

Using Elasticsearch

## Unit testing

Unit tests can be found here: src/tests
To run the unit test suite run the following command:

```
$ npm test
```

\*note:
a. Make sure the jest.config file has .cjs at the end
b. add "test": "jest" to the scripts section of the package.config file.

## TODO
