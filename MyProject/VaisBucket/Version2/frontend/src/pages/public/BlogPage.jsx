import React from 'react';

const posts = [
    {
        id: 1,
        title: 'Introducing VaisBucket: The Future of Storage',
        href: '#',
        description:
            'We are thrilled to announce the launch of VaisBucket, our next-generation cloud storage solution designed for security and speed.',
        date: 'Jan 20, 2026',
        datetime: '2026-01-20',
        category: { title: 'Product', href: '#' },
        author: {
            name: 'Vais Engineering',
            role: 'Product Team',
            href: '#',
            imageUrl:
                'https://ui-avatars.com/api/?name=Vais+Engineering&background=4f46e5&color=fff',
        },
    },
    {
        id: 2,
        title: 'Why data security matters more than ever',
        href: '#',
        description:
            'In an age of increasing cyber threats, ensuring your digital assets are encrypted and secure is paramount. Learn how we handle your data.',
        date: 'Jan 15, 2026',
        datetime: '2026-01-15',
        category: { title: 'Security', href: '#' },
        author: {
            name: 'Security Team',
            role: 'Cybersecurity',
            href: '#',
            imageUrl:
                'https://ui-avatars.com/api/?name=Security+Team&background=0ea5e9&color=fff',
        },
    },
    {
        id: 3,
        title: 'Scaling your infrastructure with VaisBucket',
        href: '#',
        description:
            'Discover how our architecture allows you to scale indefinitely without worrying about hardware limitations or downtime.',
        date: 'Jan 10, 2026',
        datetime: '2026-01-10',
        category: { title: 'Engineering', href: '#' },
        author: {
            name: 'DevOps Lead',
            role: 'Infrastructure',
            href: '#',
            imageUrl:
                'https://ui-avatars.com/api/?name=Dev+Ops&background=8b5cf6&color=fff',
        },
    },
]

const BlogPage = () => {
    return (
        <div className="bg-white dark:bg-gray-900 py-24 sm:py-32 transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">From the blog</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Latest news and updates from Vais Engineering.
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {posts.map((post, index) => (
                        <article key={post.id} className="flex max-w-xl flex-col items-start justify-between animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both" style={{ animationDelay: `${index * 150}ms` }}>
                            <div className="flex items-center gap-x-4 text-xs">
                                <time dateTime={post.datetime} className="text-gray-500 dark:text-gray-400">
                                    {post.date}
                                </time>
                                <a
                                    href={post.category.href}
                                    className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    {post.category.title}
                                </a>
                            </div>
                            <div className="group relative">
                                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
                                    <a href={post.href}>
                                        <span className="absolute inset-0" />
                                        {post.title}
                                    </a>
                                </h3>
                                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">{post.description}</p>
                            </div>
                            <div className="relative mt-8 flex items-center gap-x-4">
                                <img src={post.author.imageUrl} alt="" className="h-10 w-10 rounded-full bg-gray-50" />
                                <div className="text-sm leading-6">
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        <a href={post.author.href}>
                                            <span className="absolute inset-0" />
                                            {post.author.name}
                                        </a>
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">{post.author.role}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
