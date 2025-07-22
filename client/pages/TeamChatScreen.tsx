import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Send,
  Paperclip,
  Smile,
  Users,
  Search,
  MoreVertical,
  Phone,
  Video,
  Circle,
} from "lucide-react";

interface Message {
  id: string;
  sender: string;
  message: string;
  time: string;
  isOwn: boolean;
  status?: "sent" | "delivered" | "read";
}

interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  avatar: string;
}

export default function TeamChatScreen() {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const chatRooms: ChatRoom[] = [
    {
      id: "general",
      name: "General Team",
      lastMessage: "Meeting at 2 PM today",
      time: "10:30 AM",
      unreadCount: 3,
      isOnline: true,
      avatar: "GT",
    },
    {
      id: "tech-team",
      name: "Tech Team",
      lastMessage: "Job SA-688808 completed",
      time: "9:45 AM",
      unreadCount: 1,
      isOnline: true,
      avatar: "TT",
    },
    {
      id: "manager",
      name: "Manager",
      lastMessage: "Please review overtime claims",
      time: "Yesterday",
      unreadCount: 0,
      isOnline: false,
      avatar: "MG",
    },
    {
      id: "coordinator",
      name: "Coordinator",
      lastMessage: "New job assigned",
      time: "Yesterday",
      unreadCount: 0,
      isOnline: true,
      avatar: "CO",
    },
  ];

  const messages: Message[] = [
    {
      id: "1",
      sender: "Manager",
      message: "Good morning team! Please remember to complete your safety checklists before starting any jobs today.",
      time: "8:30 AM",
      isOwn: false,
      status: "read",
    },
    {
      id: "2",
      sender: "You",
      message: "Morning! Will do. Currently on my way to the first job.",
      time: "8:45 AM",
      isOwn: true,
      status: "read",
    },
    {
      id: "3",
      sender: "Coordinator",
      message: "Job SA-688808 has been updated with additional requirements. Please check the job details.",
      time: "9:15 AM",
      isOwn: false,
      status: "delivered",
    },
    {
      id: "4",
      sender: "You",
      message: "Thanks for the update. I'll review it now.",
      time: "9:20 AM",
      isOwn: true,
      status: "sent",
    },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle sending message
      setMessageInput("");
    }
  };

  const filteredChats = chatRooms.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate(-1)}
            >
              <X className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Team Communications</h1>
              <p className="text-sm opacity-90">Stay connected with your team</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Users className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-88px)]">
        {/* Chat List */}
        <div className="w-full max-w-sm bg-white border-r border-gray-200">
          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Chat Rooms */}
          <div className="overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat === chat.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                }`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {chat.avatar}
                    </div>
                    {chat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {chat.name}
                      </h3>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <Badge className="bg-blue-500 text-white text-xs">
                      {chat.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {chatRooms.find(c => c.id === selectedChat)?.avatar}
                      </div>
                      <Circle className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {chatRooms.find(c => c.id === selectedChat)?.name}
                      </h3>
                      <p className="text-sm text-green-600">Online</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isOwn
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-900 border border-gray-200"
                      }`}
                    >
                      {!message.isOwn && (
                        <p className="text-xs font-semibold mb-1 text-blue-600">
                          {message.sender}
                        </p>
                      )}
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.isOwn ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-5 w-5 text-gray-400" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2"
                    >
                      <Smile className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    className="bg-blue-500 hover:bg-blue-600"
                    disabled={!messageInput.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500">
                  Choose a team member or group to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
