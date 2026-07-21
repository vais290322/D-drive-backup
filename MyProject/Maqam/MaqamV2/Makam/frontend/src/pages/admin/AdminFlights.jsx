import { useEffect, useState} from 'react';
import { adminApi } from '@/db/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Edit, Trash2, Plus, Plane } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminFlights() {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFlight, setEditingFlight] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadFlights();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = flights.filter(
        (flight) =>
          flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
          flight.flight_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          flight.departure_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          flight.arrival_city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFlights(filtered);
    } else {
      setFilteredFlights(flights);
    }
  }, [searchTerm, flights]);

  const loadFlights = async () => {
    try {
      const data = await adminApi.getAllFlights();
      setFlights(data || []);
      setFilteredFlights(data || []);
    } catch (error) {
      console.error('Failed to load flights:', error);
      toast({
        title: 'Error',
        description: 'Failed to load flights',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFlight = () => {
    setIsCreating(true);
    setEditingFlight({
      airline: '',
      flight_number: '',
      departure_city: '',
      arrival_city: '',
      departure_time: '',
      arrival_time: '',
      price: 0,
      available_seats: 0,
      is_direct: true,
    });
    setEditDialogOpen(true);
  };

  const handleEditFlight = (flight) => {
    setIsCreating(false);
    setEditingFlight(flight);
    setEditDialogOpen(true);
  };

  const handleSaveFlight = async () => {
    if (!editingFlight) return;

    try {
      if (isCreating) {
        await adminApi.createFlight(editingFlight);
        toast({
          title: 'Success',
          description: 'Flight created successfully',
        });
      } else {
        await adminApi.updateFlight(editingFlight.id, editingFlight);
        toast({
          title: 'Success',
          description: 'Flight updated successfully',
        });
      }
      
      setEditDialogOpen(false);
      loadFlights();
    } catch (error) {
      console.error('Failed to save flight:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isCreating ? 'create' : 'update'} flight`,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteFlight = async () => {
    if (!flightToDelete) return;

    try {
      await adminApi.deleteFlight(flightToDelete);
      toast({
        title: 'Success',
        description: 'Flight deleted successfully',
      });
      setDeleteDialogOpen(false);
      loadFlights();
    } catch (error) {
      console.error('Failed to delete flight:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete flight',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading flights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Flights Management</h1>
          <p className="text-muted-foreground">Manage flight inventory and schedules</p>
        </div>
        <Button onClick={handleCreateFlight}>
          <Plus className="h-4 w-4 mr-2" />
          Add Flight
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Flights</CardTitle>
          <CardDescription>View and manage flight listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by airline, flight number, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Airline</TableHead>
                  <TableHead>Flight #</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFlights.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No flights found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFlights.map((flight) => (
                    <TableRow key={flight.id}>
                      <TableCell className="font-medium">{flight.airline}</TableCell>
                      <TableCell>{flight.flight_number}</TableCell>
                      <TableCell>
                        {flight.departure_city} → {flight.arrival_city}
                      </TableCell>
                      <TableCell>
                        {new Date(flight.departure_time).toLocaleString('en-IN', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </TableCell>
                      <TableCell>₹{flight.price.toLocaleString('en-IN')}</TableCell>
                      <TableCell>{flight.available_seats}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditFlight(flight)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFlightToDelete(flight.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredFlights.length} of {flights.length} flights
          </div>
        </CardContent>
      </Card>

      {/* Edit/Create Flight Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Add New Flight' : 'Edit Flight'}</DialogTitle>
            <DialogDescription>
              {isCreating ? 'Create a new flight listing' : 'Update flight information'}
            </DialogDescription>
          </DialogHeader>
          
          {editingFlight && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="airline">Airline *</Label>
                  <Input
                    id="airline"
                    value={editingFlight.airline || ''}
                    onChange={(e) =>
                      setEditingFlight({ ...editingFlight, airline: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flight_number">Flight Number *</Label>
                  <Input
                    id="flight_number"
                    value={editingFlight.flight_number || ''}
                    onChange={(e) =>
                      setEditingFlight({ ...editingFlight, flight_number: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departure_city">Departure City *</Label>
                  <Input
                    id="departure_city"
                    value={editingFlight.departure_city || ''}
                    onChange={(e) =>
                      setEditingFlight({ ...editingFlight, departure_city: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arrival_city">Arrival City *</Label>
                  <Input
                    id="arrival_city"
                    value={editingFlight.arrival_city || ''}
                    onChange={(e) =>
                      setEditingFlight({ ...editingFlight, arrival_city: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departure_time">Departure Time *</Label>
                  <Input
                    id="departure_time"
                    type="datetime-local"
                    value={editingFlight.departure_time ? new Date(editingFlight.departure_time).toISOString().slice(0, 16) : ''}
                    onChange={(e) =>
                      setEditingFlight({ ...editingFlight, departure_time: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arrival_time">Arrival Time *</Label>
                  <Input
                    id="arrival_time"
                    type="datetime-local"
                    value={editingFlight.arrival_time ? new Date(editingFlight.arrival_time).toISOString().slice(0, 16) : ''}
                    onChange={(e) =>
                      setEditingFlight({ ...editingFlight, arrival_time: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editingFlight.price || 0}
                    onChange={(e) =>
                      setEditingFlight({ ...editingFlight, price: parseFloat(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="available_seats">Available Seats *</Label>
                  <Input
                    id="available_seats"
                    type="number"
                    value={editingFlight.available_seats || 0}
                    onChange={(e) =>
                      setEditingFlight({ ...editingFlight, available_seats: parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_direct"
                  checked={editingFlight.is_direct || false}
                  onCheckedChange={(checked) =>
                    setEditingFlight({ ...editingFlight, is_direct: checked })
                  }
                />
                <Label htmlFor="is_direct" className="cursor-pointer">
                  Direct Flight (No Stops)
                </Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFlight}>
              <Plane className="h-4 w-4 mr-2" />
              {isCreating ? 'Create Flight' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the flight.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFlight}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


