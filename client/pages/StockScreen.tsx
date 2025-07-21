import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  X,
  Search,
  QrCode,
  Plus,
  Mic,
} from "lucide-react";

export default function StockScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: "",
    container: "",
    qtyUsed: "",
    description: "",
    comments: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdd = () => {
    console.log("Adding stock:", formData);
    // Clear form after adding
    setFormData({
      code: "",
      container: "",
      qtyUsed: "",
      description: "",
      comments: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Add Stock</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full h-10 w-10"
            onClick={() => navigate('/')}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24 space-y-6">
        {/* Code Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              placeholder="Search..."
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              className="pl-10 pr-12 py-3 text-lg"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-gray-100"
            >
              <QrCode className="h-6 w-6 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Container */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Container
          </label>
          <Select 
            value={formData.container} 
            onValueChange={(value) => handleInputChange('container', value)}
          >
            <SelectTrigger className="w-full py-3 text-lg">
              <SelectValue placeholder="Select Container" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="container1">Container 1</SelectItem>
              <SelectItem value="container2">Container 2</SelectItem>
              <SelectItem value="container3">Container 3</SelectItem>
              <SelectItem value="vehicle">Vehicle</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quantity Used */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Qty Used
          </label>
          <Input
            type="number"
            placeholder="0"
            value={formData.qtyUsed}
            onChange={(e) => handleInputChange('qtyUsed', e.target.value)}
            className="py-3 text-lg"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <Textarea
            placeholder=""
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="min-h-[120px] resize-none text-lg"
          />
        </div>

        {/* Comments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comments
          </label>
          <div className="relative">
            <Textarea
              placeholder=""
              value={formData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              className="min-h-[120px] resize-none text-lg pr-12"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-3 right-3 hover:bg-gray-100 text-green-600"
            >
              <Mic className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button 
          onClick={handleAdd}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-semibold"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add
        </Button>
      </div>
    </div>
  );
}
