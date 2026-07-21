import React from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

const ContactPage = () => {
    return (
        <div className="bg-white dark:bg-gray-900 py-24 sm:py-32 transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Contact Sales</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Have questions about VaisBucket? We're here to help.
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-10 sm:mt-20 lg:grid-cols-2">
                    {/* Contact Info */}
                    <div className="flex flex-col gap-8 animate-in slide-in-from-left duration-700 delay-200">
                        <div className="flex gap-4">
                            <div className="flex-none rounded-lg bg-indigo-100 dark:bg-indigo-900 p-2 h-10 w-10 flex items-center justify-center">
                                <EnvelopeIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">Email</h3>
                                <p className="mt-2 leading-7 text-gray-600 dark:text-gray-300">
                                    contact@vais.co.in
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-none rounded-lg bg-indigo-100 dark:bg-indigo-900 p-2 h-10 w-10 flex items-center justify-center">
                                <PhoneIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">Phone</h3>
                                <p className="mt-2 leading-7 text-gray-600 dark:text-gray-300">
                                    +91 123 456 7890
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-none rounded-lg bg-indigo-100 dark:bg-indigo-900 p-2 h-10 w-10 flex items-center justify-center">
                                <MapPinIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">Office</h3>
                                <p className="mt-2 leading-7 text-gray-600 dark:text-gray-300">
                                    Vais Engineering Pvt Ltd<br />
                                    Tech Park, Bangalore<br />
                                    India
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-sm animate-in slide-in-from-right duration-700 delay-200">
                        <div className="grid grid-cols-1 gap-y-6">
                            <div>
                                <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">First name</label>
                                <div className="mt-2.5">
                                    <input type="text" name="first-name" id="first-name" autoComplete="given-name" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">Email</label>
                                <div className="mt-2.5">
                                    <input type="email" name="email" id="email" autoComplete="email" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">Message</label>
                                <div className="mt-2.5">
                                    <textarea name="message" id="message" rows={4} className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600" defaultValue={''} />
                                </div>
                            </div>
                            <button type="submit" className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-[1.02]">
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
