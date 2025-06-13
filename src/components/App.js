import React, { useState } from 'react';
import VideoCall from './components/VideoCall';
import RunnerNavigation from './components/RunnerNavigation';

function App() {
  const [userId] = useState("user123");
  const [runnerId] = useState("runner456");

  const origin = "Katihar Junction, Bihar";
  const destination = "Baba Sweet Shop, Katihar";

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center text-indigo-600">🍬 Mangaao App</h1>
      <RunnerNavigation origin={origin} destination={destination} />
      <VideoCall userId={userId} remoteUserId={runnerId} />
    </div>
  );
}

export default App;