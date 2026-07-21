import React from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon, CloudArrowUpIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
    return (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Hero Section */}
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>

                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:text-gray-300 dark:ring-gray-100/10 dark:hover:ring-gray-100/20">
                            Announcing our next generation cloud storage. <Link to="/blog" className="font-semibold text-indigo-600 dark:text-indigo-400"><span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span></Link>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                        Store data securely with VaisBucket
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Secure, fast, and reliable cloud storage solutions powered by Vais Engineering Private Limited.
                        Experience the future of digital asset management.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link to="/signup" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105">Get started</Link>
                        <Link to="/about" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white flex items-center gap-1 group">
                            Learn more <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
                    <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>
            </div>

            {/* Feature Section */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24 sm:pb-32">
                <div className="mx-auto max-w-2xl lg:text-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 fill-mode-both">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">Deploy faster</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Everything you need to manage your files</p>
                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        VaisBucket provides enterprise-grade security and blazing fast performance for all your storage needs.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        <div className="relative pl-16 animate-in slide-in-from-left duration-700 delay-500 fill-mode-both">
                            <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <CloudArrowUpIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                Unlimited Storage
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                                Scale your storage as you grow. We offer flexible plans that adapt to your needs.
                            </dd>
                        </div>
                        <div className="relative pl-16 animate-in slide-in-from-right duration-700 delay-500 fill-mode-both">
                            <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <LockClosedIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                Advanced Security
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                                Your data is encrypted at rest and in transit. We prioritize your privacy above all else.
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
