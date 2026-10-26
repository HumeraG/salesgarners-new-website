import LoginForm from './LoginForm';
import '../admin.css';
export const metadata = { title: 'Admin login', robots: { index: false } };
export default function Page() { return <div className="login"><LoginForm /></div>; }
