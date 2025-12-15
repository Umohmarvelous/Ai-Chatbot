import ChatPage from "./chat/page";

async function getStatus() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/status`, {
      cache: 'no-store', // Ensure fresh data on each request
    });

    if (!res.ok) {
      throw new Error('Failed to fetch status');
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching status:', error);
    return { status: 'Error connecting to backend' };
  }
}

export default async function Home() {
  const statusData = await getStatus();

  return (
    <>
      <ChatPage/>
    </>
  ); 
}

