import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus, AlertCircle } from 'lucide-react';

export default function AdminPackages() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Packages Management</h1>
                <p className="text-muted-foreground">Manage travel packages and tours</p>
            </div>

            <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <CardTitle className="text-orange-900">Feature Coming Soon</CardTitle>
                    </div>
                    <CardDescription className="text-orange-700">
                        Package management requires backend implementation
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-orange-800">
                        The packages feature is currently under development. This will allow you to create and manage
                        comprehensive travel packages including flights, hotels, and activities.
                    </p>

                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Planned Features
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                                Create custom travel packages (Hajj, Umrah, Tours)
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                                Bundle flights, hotels, and activities
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                                Set package pricing and availability
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                                Manage package categories and featured packages
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                                Track package bookings and revenue
                            </li>
                        </ul>
                    </div>

                    <Button disabled className="w-full md:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Package
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
