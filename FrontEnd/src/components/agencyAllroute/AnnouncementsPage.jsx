import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

const AnnouncementsPage = () => {
  const { announcements, setAnnouncements } = useOutletContext();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if(message.trim()){
      const newAnnouncement = {
        id: Date.now(),
        text: message,
        timestamp: new Date().toLocaleString()
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      setMessage('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Announcements</h2>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {announcements.length > 0 ? announcements.map(ann => (
            <div key={ann.id} className="p-3 bg-gray-50 border rounded-md">
              <p className="text-gray-800">{ann.text}</p>
              <p className="text-xs text-gray-500 mt-1">{ann.timestamp}</p>
            </div>
          )) : <p className="text-gray-500">No announcements sent yet.</p>}
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Send New Announcement</h2>
        <div className="space-y-4">
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message to all users..."
          ></textarea>
          <button onClick={handleSend} className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">Send Announcement</button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
