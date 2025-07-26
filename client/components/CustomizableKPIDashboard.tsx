import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  Edit3,
  Save,
  Settings,
  Plus,
  Trash2,
  Move,
  RotateCcw,
  Copy,
  Download,
  RefreshCw,
  GripVertical,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Palette,
  Layout,
  Grid3x3,
  Square,
  Rectangle
} from "lucide-react";

interface KPIWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'gauge' | 'heatmap';
  size: {
    width: number; // Grid columns (1-4)
    height: number; // Grid rows (1-3)
  };
  position: {
    x: number;
    y: number;
  };
  data: {
    value: string | number;
    label: string;
    trend?: string;
    color?: string;
    target?: number;
    unit?: string;
    chartData?: any[];
  };
  config: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    showTrend?: boolean;
    showTarget?: boolean;
    refreshInterval?: number;
  };
}

interface DashboardLayout {
  id: string;
  name: string;
  description: string;
  widgets: KPIWidget[];
  permissions: {
    viewRoles: string[];
    editRoles: string[];
  };
  createdBy: string;
  createdAt: string;
  lastModified: string;
}

const GRID_COLUMNS = 4;
const GRID_ROWS = 6;

const DEFAULT_WIDGETS: KPIWidget[] = [
  {
    id: 'widget-1',
    title: 'Open Cases',
    type: 'metric',
    size: { width: 1, height: 1 },
    position: { x: 0, y: 0 },
    data: {
      value: 8,
      label: 'Open Cases',
      trend: '+12%',
      color: 'blue',
      unit: 'cases'
    },
    config: {
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      showTrend: true
    }
  },
  {
    id: 'widget-2',
    title: 'Late Appointments',
    type: 'metric',
    size: { width: 1, height: 1 },
    position: { x: 1, y: 0 },
    data: {
      value: 4,
      label: 'Late Appointments',
      trend: '-8%',
      color: 'green',
      unit: 'appointments'
    },
    config: {
      backgroundColor: '#10b981',
      textColor: '#ffffff',
      showTrend: true
    }
  },
  {
    id: 'widget-3',
    title: 'Installation Progress',
    type: 'gauge',
    size: { width: 2, height: 2 },
    position: { x: 2, y: 0 },
    data: {
      value: 78,
      label: 'Installation Progress',
      target: 85,
      color: 'purple',
      unit: '%'
    },
    config: {
      backgroundColor: '#8b5cf6',
      textColor: '#ffffff',
      showTarget: true
    }
  },
  {
    id: 'widget-4',
    title: 'Team Performance',
    type: 'chart',
    size: { width: 2, height: 2 },
    position: { x: 0, y: 1 },
    data: {
      value: 94,
      label: 'Team Performance',
      chartData: [
        { name: 'Mon', value: 85 },
        { name: 'Tue', value: 92 },
        { name: 'Wed', value: 78 },
        { name: 'Thu', value: 96 },
        { name: 'Fri', value: 94 }
      ],
      color: 'orange',
      unit: '%'
    },
    config: {
      backgroundColor: '#f59e0b',
      textColor: '#ffffff'
    }
  }
];

export default function CustomizableKPIDashboard() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [widgets, setWidgets] = useState<KPIWidget[]>(DEFAULT_WIDGETS);
  const [selectedWidget, setSelectedWidget] = useState<KPIWidget | null>(null);
  const [dashboardLayouts, setDashboardLayouts] = useState<DashboardLayout[]>([]);
  const [currentLayout, setCurrentLayout] = useState<DashboardLayout | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [draggedWidget, setDraggedWidget] = useState<KPIWidget | null>(null);
  const [gridHover, setGridHover] = useState<{ x: number; y: number } | null>(null);
  const [newWidgetForm, setNewWidgetForm] = useState({
    title: '',
    type: 'metric' as KPIWidget['type'],
    size: { width: 1, height: 1 },
    dataSource: '',
    color: '#3b82f6'
  });
  const [newLayoutForm, setNewLayoutForm] = useState({
    name: '',
    description: '',
    copyFrom: ''
  });
  const [editWidgetForm, setEditWidgetForm] = useState({
    title: '',
    backgroundColor: '',
    textColor: '',
    showTrend: false,
    showTarget: false
  });

  const { toast } = useToast();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadDashboardLayouts();
  }, []);

  const loadDashboardLayouts = () => {
    // Mock loading from localStorage/API
    const saved = localStorage.getItem('kpi_dashboard_layouts');
    if (saved) {
      const layouts = JSON.parse(saved);
      setDashboardLayouts(layouts);
      if (layouts.length > 0) {
        const defaultLayout = layouts.find((l: DashboardLayout) => l.name === 'Default') || layouts[0];
        setCurrentLayout(defaultLayout);
        setWidgets(defaultLayout.widgets);
      }
    } else {
      const defaultLayout: DashboardLayout = {
        id: 'default-layout',
        name: 'Default Dashboard',
        description: 'Default KPI dashboard layout',
        widgets: DEFAULT_WIDGETS,
        permissions: {
          viewRoles: ['Manager', 'CEO', 'Coordinator'],
          editRoles: ['Manager', 'CEO']
        },
        createdBy: 'Manager',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      setDashboardLayouts([defaultLayout]);
      setCurrentLayout(defaultLayout);
    }
  };

  const saveDashboardLayout = (layout: DashboardLayout) => {
    const updatedLayouts = dashboardLayouts.map(l => 
      l.id === layout.id ? layout : l
    );
    if (!dashboardLayouts.find(l => l.id === layout.id)) {
      updatedLayouts.push(layout);
    }
    setDashboardLayouts(updatedLayouts);
    localStorage.setItem('kpi_dashboard_layouts', JSON.stringify(updatedLayouts));
    
    toast({
      title: "Dashboard Saved",
      description: `Layout "${layout.name}" has been saved successfully.`,
    });
  };

  const handleWidgetDragStart = (widget: KPIWidget, e: React.DragEvent) => {
    setDraggedWidget(widget);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleGridCellDrop = (x: number, y: number, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedWidget || !isEditMode) return;

    // Check if position is valid (no overlap)
    const canPlace = checkWidgetPlacement(draggedWidget, x, y);
    if (!canPlace) {
      toast({
        title: "Invalid Position",
        description: "Cannot place widget here due to overlap.",
        variant: "destructive"
      });
      return;
    }

    setWidgets(prev => prev.map(w => 
      w.id === draggedWidget.id 
        ? { ...w, position: { x, y } }
        : w
    ));
    setDraggedWidget(null);
    setGridHover(null);
  };

  const handleGridCellDragOver = (x: number, y: number, e: React.DragEvent) => {
    e.preventDefault();
    if (isEditMode && draggedWidget) {
      setGridHover({ x, y });
    }
  };

  const checkWidgetPlacement = (widget: KPIWidget, x: number, y: number): boolean => {
    // Check bounds
    if (x + widget.size.width > GRID_COLUMNS || y + widget.size.height > GRID_ROWS) {
      return false;
    }

    // Check overlap with other widgets
    for (const otherWidget of widgets) {
      if (otherWidget.id === widget.id) continue;
      
      const otherX = otherWidget.position.x;
      const otherY = otherWidget.position.y;
      const otherW = otherWidget.size.width;
      const otherH = otherWidget.size.height;

      if (!(x >= otherX + otherW || x + widget.size.width <= otherX || 
            y >= otherY + otherH || y + widget.size.height <= otherY)) {
        return false;
      }
    }
    return true;
  };

  const resizeWidget = (widgetId: string, newSize: { width: number; height: number }) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId 
        ? { ...w, size: newSize }
        : w
    ));
  };

  const deleteWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
    toast({
      title: "Widget Deleted",
      description: "Widget has been removed from the dashboard.",
    });
  };

  const addNewWidget = () => {
    const newWidget: KPIWidget = {
      id: `widget-${Date.now()}`,
      title: newWidgetForm.title,
      type: newWidgetForm.type,
      size: newWidgetForm.size,
      position: { x: 0, y: 0 }, // Will be placed automatically
      data: {
        value: 0,
        label: newWidgetForm.title,
        color: newWidgetForm.color
      },
      config: {
        backgroundColor: newWidgetForm.color,
        textColor: '#ffffff'
      }
    };

    // Find available position
    let placed = false;
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLUMNS; x++) {
        if (checkWidgetPlacement(newWidget, x, y)) {
          newWidget.position = { x, y };
          placed = true;
          break;
        }
      }
      if (placed) break;
    }

    if (placed) {
      setWidgets(prev => [...prev, newWidget]);
      setActiveModal(null);
      setNewWidgetForm({
        title: '',
        type: 'metric',
        size: { width: 1, height: 1 },
        dataSource: '',
        color: '#3b82f6'
      });
      toast({
        title: "Widget Added",
        description: "New widget has been added to the dashboard.",
      });
    } else {
      toast({
        title: "Cannot Add Widget",
        description: "No available space on the dashboard.",
        variant: "destructive"
      });
    }
  };

  const saveCurrentLayout = () => {
    if (!currentLayout) return;

    const updatedLayout: DashboardLayout = {
      ...currentLayout,
      widgets: widgets,
      lastModified: new Date().toISOString()
    };

    saveDashboardLayout(updatedLayout);
    setCurrentLayout(updatedLayout);
    setIsEditMode(false);
  };

  const createNewLayout = () => {
    const newLayout: DashboardLayout = {
      id: `layout-${Date.now()}`,
      name: newLayoutForm.name,
      description: newLayoutForm.description,
      widgets: newLayoutForm.copyFrom === 'current' && currentLayout ?
        JSON.parse(JSON.stringify(currentLayout.widgets)) :
        newLayoutForm.copyFrom === 'default' ?
        JSON.parse(JSON.stringify(DEFAULT_WIDGETS)) : [],
      permissions: {
        viewRoles: ['Manager', 'CEO', 'Coordinator'],
        editRoles: ['Manager', 'CEO']
      },
      createdBy: 'Manager',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    saveDashboardLayout(newLayout);
    setCurrentLayout(newLayout);
    setWidgets(newLayout.widgets);
    setActiveModal(null);
    setNewLayoutForm({ name: '', description: '', copyFrom: '' });
  };

  const updateWidgetConfig = () => {
    if (!selectedWidget) return;

    setWidgets(prev => prev.map(w =>
      w.id === selectedWidget.id
        ? {
            ...w,
            title: editWidgetForm.title || w.title,
            config: {
              ...w.config,
              backgroundColor: editWidgetForm.backgroundColor || w.config.backgroundColor,
              textColor: editWidgetForm.textColor || w.config.textColor,
              showTrend: editWidgetForm.showTrend,
              showTarget: editWidgetForm.showTarget
            }
          }
        : w
    ));

    setActiveModal(null);
    setSelectedWidget(null);
    toast({
      title: "Widget Updated",
      description: "Widget configuration has been saved.",
    });
  };

  const renderWidget = (widget: KPIWidget) => {
    const gridSpan = `col-span-${widget.size.width} row-span-${widget.size.height}`;
    const isSelected = selectedWidget?.id === widget.id;

    return (
      <div
        key={widget.id}
        className={`relative group ${gridSpan} transition-all duration-200 ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{
          gridColumnStart: widget.position.x + 1,
          gridRowStart: widget.position.y + 1,
        }}
        draggable={isEditMode}
        onDragStart={(e) => handleWidgetDragStart(widget, e)}
        onClick={() => isEditMode && setSelectedWidget(widget)}
      >
        <Card className="h-full relative overflow-hidden">
          {isEditMode && (
            <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedWidget(widget);
                  setActiveModal('editWidget');
                }}
              >
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteWidget(widget.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="h-3 w-3" />
              </Button>
            </div>
          )}

          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span style={{ color: widget.config.textColor }}>{widget.title}</span>
              {!isEditMode && (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Eye className="h-3 w-3" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0">
            {widget.type === 'metric' && (
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: widget.config.textColor }}>
                  {widget.data.value}
                </div>
                <div className="text-sm opacity-80" style={{ color: widget.config.textColor }}>
                  {widget.data.label}
                </div>
                {widget.config.showTrend && widget.data.trend && (
                  <div className="text-xs mt-1 opacity-70" style={{ color: widget.config.textColor }}>
                    {widget.data.trend}
                  </div>
                )}
              </div>
            )}

            {widget.type === 'gauge' && (
              <div className="flex items-center justify-center h-32">
                <div className="relative w-24 h-24">
                  <div className="w-full h-full rounded-full border-8 border-gray-200"></div>
                  <div 
                    className="absolute inset-0 w-full h-full rounded-full border-8 transform"
                    style={{
                      borderColor: widget.config.backgroundColor,
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + (widget.data.value as number) * 0.5}% ${50 - (widget.data.value as number) * 0.5}%)`
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold" style={{ color: widget.config.textColor }}>
                      {widget.data.value}{widget.data.unit}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {widget.type === 'chart' && (
              <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-50 rounded flex items-end justify-around p-2">
                {widget.data.chartData?.map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div 
                      className="rounded-t"
                      style={{ 
                        backgroundColor: widget.config.backgroundColor,
                        width: '16px',
                        height: `${data.value}px`
                      }}
                    ></div>
                    <span className="text-xs">{data.name}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resize handles */}
        {isEditMode && isSelected && (
          <>
            <div
              className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize opacity-75 hover:opacity-100"
              onMouseDown={(e) => {
                // Implement resize logic
                e.preventDefault();
              }}
            ></div>
          </>
        )}
      </div>
    );
  };

  const renderGrid = () => {
    const gridCells = [];
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLUMNS; x++) {
        const isHovered = gridHover?.x === x && gridHover?.y === y;
        const canDrop = draggedWidget ? checkWidgetPlacement(draggedWidget, x, y) : false;
        
        gridCells.push(
          <div
            key={`${x}-${y}`}
            className={`border border-dashed border-gray-300 min-h-[80px] ${
              isEditMode ? 'border-opacity-50' : 'border-opacity-0'
            } ${isHovered && canDrop ? 'bg-blue-100 border-blue-400' : ''} ${
              isHovered && !canDrop ? 'bg-red-100 border-red-400' : ''
            }`}
            onDrop={(e) => handleGridCellDrop(x, y, e)}
            onDragOver={(e) => handleGridCellDragOver(x, y, e)}
            onDragLeave={() => setGridHover(null)}
          />
        );
      }
    }
    return gridCells;
  };

  return (
    <div className="space-y-4">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Layout className="h-5 w-5" />
            {currentLayout?.name || 'KPI Dashboard'}
          </h3>
          <p className="text-sm text-gray-600">{currentLayout?.description}</p>
        </div>
        <div className="flex gap-2">
          {!isEditMode ? (
            <>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveModal('layoutManager')}>
                <Settings className="h-4 w-4 mr-2" />
                Layouts
              </Button>
              <Button size="sm" onClick={() => setIsEditMode(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setActiveModal('addWidget')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Widget
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                setWidgets(currentLayout?.widgets || DEFAULT_WIDGETS);
                setIsEditMode(false);
              }}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={saveCurrentLayout}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Dashboard Grid */}
      <div
        ref={gridRef}
        className={`grid grid-cols-4 gap-4 min-h-[500px] relative ${
          isEditMode ? 'bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300' : ''
        }`}
        style={{ gridTemplateRows: `repeat(${GRID_ROWS}, minmax(80px, 1fr))` }}
      >
        {isEditMode && renderGrid()}
        {widgets.map(renderWidget)}
      </div>

      {/* Edit Mode Info */}
      {isEditMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <Edit3 className="h-4 w-4" />
            <span className="font-medium">Edit Mode Active</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Drag widgets to reposition, click to select, use handles to resize. Click "Save Changes" when done.
          </p>
        </div>
      )}

      {/* Add Widget Modal */}
      <Dialog open={activeModal === 'addWidget'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Widget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Widget Title</Label>
              <Input
                value={newWidgetForm.title}
                onChange={(e) => setNewWidgetForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter widget title"
              />
            </div>
            <div>
              <Label>Widget Type</Label>
              <Select
                value={newWidgetForm.type}
                onValueChange={(value: KPIWidget['type']) => setNewWidgetForm(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric</SelectItem>
                  <SelectItem value="chart">Chart</SelectItem>
                  <SelectItem value="gauge">Gauge</SelectItem>
                  <SelectItem value="table">Table</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Width (Columns)</Label>
                <Select
                  value={newWidgetForm.size.width.toString()}
                  onValueChange={(value) => setNewWidgetForm(prev => ({ 
                    ...prev, 
                    size: { ...prev.size, width: parseInt(value) }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Height (Rows)</Label>
                <Select
                  value={newWidgetForm.size.height.toString()}
                  onValueChange={(value) => setNewWidgetForm(prev => ({ 
                    ...prev, 
                    size: { ...prev.size, height: parseInt(value) }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Color Theme</Label>
              <div className="flex gap-2 mt-2">
                {['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280'].map(color => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded border-2 ${
                      newWidgetForm.color === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewWidgetForm(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button onClick={addNewWidget} disabled={!newWidgetForm.title}>Add Widget</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Layout Manager Modal */}
      <Dialog open={activeModal === 'layoutManager'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dashboard Layouts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-3">
              {dashboardLayouts.map(layout => (
                <div key={layout.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{layout.name}</div>
                    <div className="text-sm text-gray-600">{layout.description}</div>
                    <div className="text-xs text-gray-500">
                      {layout.widgets.length} widgets • Modified {new Date(layout.lastModified).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => {
                      setCurrentLayout(layout);
                      setWidgets(layout.widgets);
                      setActiveModal(null);
                    }}>
                      Load
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={() => setActiveModal('newLayout')}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Layout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
