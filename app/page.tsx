import { redirect } from 'next/navigation';

export default function Home() {
// Instantly redirect users from the default home page to our custom login page
redirect('/login');
}