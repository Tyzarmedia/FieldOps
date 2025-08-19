import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, User, Check, X } from "lucide-react";
import { authManager } from "@/utils/auth";

interface Assistant {
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  isAvailable: boolean;
  lastActive?: string;
}

interface AssistantSelectionProps {
  onSelection: (
    assistantId: string | null,
    assistantName: string | null,
  ) => void;
  onCancel: () => void;
  isVisible: boolean;
}

export default function AssistantSelection({
  onSelection,
  onCancel,
  isVisible,
}: AssistantSelectionProps) {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssistant, setSelectedAssistant] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (isVisible) {
      fetchAvailableAssistants();
    }
  }, [isVisible]);

  const fetchAvailableAssistants = async () => {
    try {
      setLoading(true);
      const response = await authManager.makeAuthenticatedRequest(
        "/api/assistants/available",
      );

      if (response.ok) {
        const data = await response.json();
        setAssistants(data.assistants || []);
      } else {
        console.error("Failed to fetch assistants");
        setAssistants([]);
      }
    } catch (error) {
      console.error("Error fetching assistants:", error);
      setAssistants([]);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleAssistantSelect = (assistant: Assistant) => {
    setSelectedAssistant(assistant.employeeId);
  };

  const handleConfirmSelection = () => {
    const selected = assistants.find((a) => a.employeeId === selectedAssistant);
    onSelection(selectedAssistant, selected?.fullName || null);
  };

  const handleWorkAlone = () => {
    onSelection(null, null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-orange-500" />
            Select Assistant
          </CardTitle>
          <p className="text-sm text-gray-600">
            Choose an assistant to work with today, or work alone
          </p>
        </CardHeader>

        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {/* Work Alone Option */}
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedAssistant === null
                ? "ring-2 ring-orange-500 bg-orange-50"
                : "hover:bg-gray-50"
            }`}
            onClick={() => setSelectedAssistant(null)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Work Alone</p>
                  <p className="text-sm text-gray-500">
                    No assistant needed today
                  </p>
                </div>
                {selectedAssistant === null && (
                  <Check className="h-5 w-5 text-orange-500" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          )}

          {/* Assistant List */}
          {!loading &&
            assistants.map((assistant) => (
              <Card
                key={assistant.employeeId}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedAssistant === assistant.employeeId
                    ? "ring-2 ring-orange-500 bg-orange-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleAssistantSelect(assistant)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-500 text-white">
                        {getInitials(assistant.fullName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 truncate">
                          {assistant.fullName}
                        </p>
                        <Badge
                          variant={
                            assistant.isAvailable ? "default" : "secondary"
                          }
                          className={
                            assistant.isAvailable ? "bg-green-500" : ""
                          }
                        >
                          {assistant.isAvailable ? "Available" : "Busy"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {assistant.phone}
                      </p>
                    </div>

                    {selectedAssistant === assistant.employeeId && (
                      <Check className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

          {/* No Assistants Available */}
          {!loading && assistants.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No assistants available at the moment</p>
              <p className="text-sm mt-1">You can still work alone today</p>
            </div>
          )}
        </CardContent>

        {/* Action Buttons */}
        <div className="border-t p-4 space-y-3">
          <Button
            onClick={
              selectedAssistant === null
                ? handleWorkAlone
                : handleConfirmSelection
            }
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={loading}
          >
            {selectedAssistant === null ? "Work Alone" : "Confirm Selection"}
          </Button>

          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full"
            disabled={loading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
