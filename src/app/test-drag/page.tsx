import React from 'react';

const TestDragPage = () => {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Test Drag Page</h1>
      <p className="mb-4">This page is for testing the draggable WhatsApp button.</p>
      <p>Try dragging the WhatsApp button to reposition it.</p>
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Instructions:</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Look for the WhatsApp button in the bottom right corner</li>
          <li>Click and drag the button to reposition it</li>
          <li>Release the button to save its position</li>
          <li>Refresh the page to see if the position is remembered</li>
          <li>Click the button to open WhatsApp</li>
        </ul>
      </div>
    </div>
  );
};

export default TestDragPage;