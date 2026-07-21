import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, AlertCircle } from 'lucide-react';

export default function AdminBlogPosts() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Blog Posts Management</h1>
                <p className="text-muted-foreground">Create and manage blog content</p>
            </div>

            <Card className="border-purple-200 bg-purple-50/50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-purple-600" />
                        <CardTitle className="text-purple-900">Feature Coming Soon</CardTitle>
                    </div>
                    <CardDescription className="text-purple-700">
                        Blog management system is under development
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-purple-800">
                        The blog management feature will allow you to create, edit, and publish blog posts to engage
                        with your customers and share travel tips, guides, and news.
                    </p>

                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Planned Features
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                                Create and edit blog posts with rich text editor
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                                Publish, unpublish, and schedule posts
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                                Organize posts with categories and tags
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                                Upload and manage featured images
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                                SEO optimization (meta titles, descriptions)
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                                View analytics (views, engagement)
                            </li>
                        </ul>
                    </div>

                    <Button disabled className="w-full md:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Post
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
