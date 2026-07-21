import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, AlertCircle } from 'lucide-react';

export default function AdminContacts() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Contact Submissions</h1>
                <p className="text-muted-foreground">View and manage customer inquiries</p>
            </div>

            <Card className="border-indigo-200 bg-indigo-50/50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-indigo-600" />
                        <CardTitle className="text-indigo-900">Feature Coming Soon</CardTitle>
                    </div>
                    <CardDescription className="text-indigo-700">
                        Contact submissions management is under development
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-indigo-800">
                        The contact submissions feature will allow you to view, manage, and respond to customer
                        inquiries submitted through the contact form on your website.
                    </p>

                    <div className="bg-white rounded-lg p-4 border border-indigo-200">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Planned Features
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                                View all contact form submissions
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                                Mark submissions/unread
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                                Reply to customer inquiries via email
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                                Archive or delete submissions
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                                Filter by status, date, or inquiry type
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                                Export submissions for reporting
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

