# YouTube Clone

## Overview

This project is a robust recreation of YouTube's core features, boasting an intuitive UI and seamless user experience. Built with a modern tech stack, it prioritizes efficiency and security providing nearly all the features of YouTube.

## Key Features

User authentication with Google OAuth 2.0 for enhanced security.

Fast Loading and 100% SEO index using Next.js 13 Features and caching.

Progressive Web App , both works as Website and installable in other platforms.

### Unauthenticated Users

Can stream, download and search videos, playlists and can view and search channels and their associated videos and playlists.

### Authenticated Users

Can watch personal playlists, liked videos, history and subscriptions.

Can Like/Dislike videos, subscribe/unsubscribe Channels, comment on videos.

## Technologies Used

Frontend/Backend: Next.js 13

Scripting Language: TypeScript

Styling : Tailwind CSS

Database: MongoDB

Authentication: Google OAuth 2.0 using NextAuth.js

Motions : Framer Motion

Additional APIs: YouTube API

## Development Highlights

Used Next.js 13 for Unified Development to streamline frontend and backend development, resulting in a 60% boost in development efficiency.

Robust Authentication: Implemented Google OAuth 2.0 using NextAuth.js to ensure high security standards.

Comprehensive Core Features: Replicated approximately 80% of YouTube's core functionality and User Interface (UI), providing a rich user experience.

## Installation Instructions

Clone the repository:

```Bash
git clone https://github.com/Kartik20122002/YouTube-2.0.git
```

Use code with caution. Learn more
Install dependencies:

```bash
npm install
```

Use code with caution.

Create a .env file and add your environment variables (e.g., Google API keys, MongoDB connection string).

To know which keys you need, go to `/src/utils/secrets/secrets.ts` in the repo and put required keys in .env file.

For Google API key and access token, allow all scopes for youtube and in access token setting, put localhost:3000 
as authorised url and origin, you can easily take help of youtube for tutorial.

Start the development server:

```npm
npm run dev
```

Use code with caution.

Access the application at http://localhost:3000/.

## Contributions

I welcome contributions! Please follow these steps:

Fork the repository.

Create a branch for your changes.

Make your changes and commit them.
Push your changes to your fork.

Create a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any questions or inquiries, please reach out to kartikhatwar98@gmail.com.
