export default function ChatMessage({ message }) {
    const isUser = message.sender === 'user';
    
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-2 text-xs font-bold">
            SL
          </div>
        )}
        <div className="max-w-xs sm:max-w-md">
          <div
            className={`rounded-2xl px-4 py-2 ${
              isUser
                ? 'bg-indigo-600 text-white rounded-br-none'
                : 'bg-white border border-gray-200 rounded-tl-none'
            }`}
          >
            {message.text}
          </div>
          <div className={`text-xs mt-1 ${isUser ? 'text-right' : 'text-left'} text-gray-500`}>
            {message.timestamp}
            {isUser && (
              <span className="ml-1">✓✓</span>
            )}
          </div>
        </div>
        {isUser && (
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden ml-2">
            <img src="/api/placeholder/32/32" alt="User" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    );
  }