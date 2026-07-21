import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, AlertCircle } from 'lucide-react';

export default function AdminResources() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Resources Management</h1>
                <p className="text-muted-foreground">Manage travel guides and resources</p>
            </div>

            <Card className="border-teal-200 bg-teal-50/50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-teal-600" />
                        <CardTitle className="text-teal-900">Feature Coming Soon</CardTitle>
                    </div>
                    <CardDescription className="text-teal-700">
                        Resources management system is under development
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-teal-800">
                        The resources feature will help you provide valuable information to travelers including
                        travel guides, visa information, prayer times, and Hajj/Umrah guides.
                    </p>

                    <div className="bg-white rounded-lg p-4 border border-teal-200">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Planned Features
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                                Upload and manage travel guides (PDFs, documents)
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                                Visa information and requirements by country
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                                Prayer times and Qibla direction tools
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                                Hajj and Umrah comprehensive guides
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                                Travel tips and safety information
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                                Categorize resources by type and destination
                            </li>
                        </ul>
                    </div>

                    <Button disabled className="w-full md:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Resource
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

