import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Redirect /dashboard to /authenticatedHome
export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/authenticatedHome');
  }, [router]);

  return null;
}
