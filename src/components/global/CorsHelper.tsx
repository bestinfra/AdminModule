import React from 'react';

interface CorsHelperProps {
  apiUrl: string;
  onClose: () => void;
}

const CorsHelper: React.FC<CorsHelperProps> = ({ apiUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">🚫 CORS Error - Quick Fixes</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900 rounded-lg">
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">What's happening?</h3>
            <p className="text-red-700 dark:text-red-300 text-sm">
              Your browser is blocking the request due to CORS (Cross-Origin Resource Sharing) policy. 
              This happens when a web app tries to access an API from a different domain.
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">🛠️ Quick Solutions</h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-blue-700 dark:text-blue-300">Option 1: Chrome with CORS disabled (for testing only)</h4>
                <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                  chrome.exe --user-data-dir=/tmp/chrome_dev --disable-web-security --disable-features=VizDisplayCompositor
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  ⚠️ Only use this for testing! It disables important security features.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-700 dark:text-blue-300">Option 2: Browser Extension</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Install "CORS Unblock" or similar extension to temporarily disable CORS
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-700 dark:text-blue-300">Option 3: Use a CORS Proxy (for testing)</h4>
                <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                  <p>Use a proxy service like:</p>
                  <ul className="mt-1 list-disc list-inside text-xs">
                    <li>https://cors-anywhere.herokuapp.com/</li>
                    <li>https://api.allorigins.win/raw?url=</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Production Solution</h3>
            <p className="text-green-700 dark:text-green-300 text-sm">
              For production, the API server needs to include proper CORS headers:
            </p>
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
              Access-Control-Allow-Origin: *<br/>
              Access-Control-Allow-Methods: GET, POST, PUT, DELETE<br/>
              Access-Control-Allow-Headers: Content-Type, Authorization
            </div>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">🔧 Test API Directly</h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-2">
              You can test the API directly using these tools:
            </p>
            <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
              <li>• Postman or Insomnia (API testing tools)</li>
              <li>• curl command in terminal</li>
              <li>• Browser developer tools (Network tab)</li>
            </ul>
            
            <div className="mt-3">
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">Sample curl command:</p>
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono overflow-x-auto">
                curl -X POST "{apiUrl}/getToken" \<br/>
                &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
                &nbsp;&nbsp;-d '&#123;"username":"att","password":"att@123"&#125;'
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CorsHelper; 