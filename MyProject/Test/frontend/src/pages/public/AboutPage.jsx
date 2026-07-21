import React from 'react';
import { SparklesIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const AboutPage = () => {
    return (
        <div className="bg-white dark:bg-gray-900 py-24 sm:py-32 transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">About Us</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Driving Innovation at Vais Engineering
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Vais Engineering Private Limited is a pioneering technology company dedicated to building robust, scalable, and secure cloud solutions. Our flagship product, VaisBucket, represents our commitment to excellence in digital asset management.
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        <div className="flex flex-col items-center text-center animate-in zoom-in duration-700 delay-100">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                                <SparklesIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
                            </div>
                            <dt className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">Innovation First</dt>
                            <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                                <p className="flex-auto">We constantly push the boundaries of what's possible in cloud technology.</p>
                            </dd>
                        </div>
                        <div className="flex flex-col items-center text-center animate-in zoom-in duration-700 delay-200">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                                <GlobeAltIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
                            </div>
                            <dt className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">Global Reach</dt>
                            <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                                <p className="flex-auto">Serving clients worldwide with reliability and speed.</p>
                            </dd>
                        </div>
                        <div className="flex flex-col items-center text-center animate-in zoom-in duration-700 delay-300">
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                                <UserGroupIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
                            </div>
                            <dt className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">Customer Centric</dt>
                            <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                                <p className="flex-auto">We build with our users in mind, ensuring a seamless experience.</p>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
