# MePad Frontend Guide (Next.js)

## Project Setup

1. Create Next.js App:
```bash
npx create-next-app@latest mepad-frontend
cd mepad-frontend
```
Choose the following options:
- Would you like to use TypeScript? → Yes
- Would you like to use ESLint? → Yes
- Would you like to use Tailwind CSS? → Yes
- Would you like to use `src/` directory? → Yes
- Would you like to use App Router? → Yes
- Would you like to customize the default import alias (@/*)? → Yes

2. Install Additional Dependencies:
```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install axios date-fns @mui/x-date-pickers
npm install next-auth
```

## Project Structure
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── admin/
│   │   │   ├── meetings/page.tsx
│   │   │   ├── tasks/page.tsx
│   │   │   └── page.tsx
│   │   └── participant/
│   │       ├── meetings/page.tsx
│   │       ├── tasks/page.tsx
│   │       └── page.tsx
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── dashboard/
│   │   ├── MeetingList.tsx
│   │   ├── TaskBoard.tsx
│   │   └── DashboardLayout.tsx
│   └── common/
│       ├── Navbar.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── api.ts
│   └── auth.ts
└── types/
    └── index.ts
```

## API Integration

```typescript
// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(config => {
    // Token will be handled by next-auth
    return config;
});

export default api;
```

## Authentication Setup

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import api from './api';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                role: { label: "Role", type: "text" }
            },
            async authorize(credentials) {
                try {
                    const res = await api.post('/auth/login', credentials);
                    return {
                        ...res.data.user,
                        token: res.data.token
                    };
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.accessToken = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.role = token.role;
            session.user.accessToken = token.accessToken;
            return session;
        }
    },
    pages: {
        signIn: '/login',
        error: '/login'
    }
};
```

## Component Examples

### Login Form
```typescript
// src/components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { TextField, Button, Alert } from '@mui/material';

export default function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn('credentials', {
            ...formData,
            redirect: false
        });

        if (result?.error) {
            setError('Invalid credentials');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            {/* Add password field and submit button */}
        </form>
    );
}
```

### Meeting List
```typescript
// src/components/dashboard/MeetingList.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import api from '@/lib/api';

export default function MeetingList() {
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        const fetchMeetings = async () => {
            const response = await api.get('/meetings');
            setMeetings(response.data);
        };
        fetchMeetings();
    }, []);

    return (
        <div className="grid gap-4">
            {meetings.map(meeting => (
                <Card key={meeting.id}>
                    <CardContent>
                        <Typography variant="h6">{meeting.title}</Typography>
                        <Typography>{meeting.description}</Typography>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
```

## Route Protection

```typescript
// src/middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Protect admin routes
        if (path.startsWith('/admin') && token?.role !== 'admin') {
            return NextResponse.redirect(new URL('/participant', req.url));
        }

        // Protect participant routes
        if (path.startsWith('/participant') && token?.role !== 'participant') {
            return NextResponse.redirect(new URL('/admin', req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        }
    }
);

export const config = {
    matcher: ['/admin/:path*', '/participant/:path*']
};
```

## Environment Setup

Create `.env.local`:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Development Workflow

1. Start the development server:
```bash
npm run dev
```

2. Build for production:
```bash
npm run build
```

3. Start production server:
```bash
npm start
```

## Key Features

1. **Authentication**
   - JWT-based auth with next-auth
   - Role-based access control
   - Protected routes

2. **Dashboard Features**
   - Admin dashboard with full control
   - Participant dashboard with limited access
   - Meeting management
   - Task tracking

3. **API Integration**
   - Axios for API calls
   - Automatic token handling
   - Error handling

4. **UI/UX**
   - Material-UI components
   - Responsive design
   - Loading states
   - Error feedback

## Best Practices

1. **Performance**
   - Server components where possible
   - Client components only when needed
   - Image optimization with next/image
   - API route caching

2. **Security**
   - CSRF protection
   - XSS prevention
   - Secure auth flow
   - Environment variables

3. **Code Organization**
   - Feature-based structure
   - Shared components
   - Type safety with TypeScript
   - Consistent naming conventions
