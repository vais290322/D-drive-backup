
import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle, Star, Shield, ArrowRight, X, Phone, User, Clock, CreditCard } from 'lucide-react';
import { Button } from '../../components/ui/button';

const HomePage = () => {
    const [location, setLocation] = useState({ lat: null, long: null, address: null });
    const [locationError, setLocationError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '' });

    // Get Location on Mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation(prev => ({ ...prev, lat: latitude, long: longitude }));

                    // Optional: Reverse Geocoding (Free Nominatim Service)
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await response.json();
                        setLocation(prev => ({ ...prev, address: data.display_name }));
                    } catch (err) {
                        console.error("Failed to fetch address", err);
                    }
                },
                (error) => {
                    let errorMessage = "Location access denied.";
                    if (error.code === 1) errorMessage = "Please allow location access to use our services.";
                    if (error.code === 2) errorMessage = "Position unavailable.";
                    if (error.code === 3) errorMessage = "Timeout getting location.";
                    setLocationError(errorMessage);
                }
            );
        } else {
            setLocationError("Geolocation is not supported by this browser.");
        }
    }, []);

    const handleApplyClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        alert(`Application Submitted!\nName: ${formData.name}\nPhone: ${formData.phone}\nLocation: ${location.lat}, ${location.long}`);
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white py-24 px-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 right-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
                    <div className="absolute bottom-10 left-10 w-64 h-64 bg-indigo-500 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-purple-200">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span>#1 Trusted Loan Provider</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                            Instant Loans, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                Right Where You Are
                            </span>
                        </h1>
                        <p className="text-lg text-indigo-100 max-w-lg">
                            Get approved in minutes based on your secure location data. No paperwork, just instant processing.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={handleApplyClick}
                                className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                Apply for Loan <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Location Status Card */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 animate-pulse"></div>
                        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 bg-blue-500/20 rounded-lg">
                                    <MapPin className="w-8 h-8 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Location Status</h3>
                                    <p className="text-indigo-200 text-sm">Required for verification</p>
                                </div>
                            </div>

                            {locationError ? (
                                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-200 text-sm">
                                    {locationError}
                                </div>
                            ) : location.lat ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-emerald-300">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-semibold">Location Detected Successfully</span>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-4 font-mono text-xs text-indigo-300 break-all">
                                        <p>LAT: {location.lat}</p>
                                        <p>LNG: {location.long}</p>
                                        {location.address && (
                                            <p className="mt-2 text-white border-t border-white/10 pt-2">{location.address}</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-indigo-200 animate-pulse">
                                    <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                                    <span>Detecting your secure location...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust & Features Section */}
            <section className="py-20 px-6 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">We combine advanced technology with human trust to provide the fastest loan experience.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, title: "100% Secure", desc: "Your data is encrypted with military-grade security protocols." },
                            { icon: Clock, title: "Fast Approval", desc: "Get your loan approved in under 15 minutes." },
                            { icon: CreditCard, title: "Instant Transfer", desc: "Money sent directly to your bank account immediately." }
                        ].map((item, idx) => (
                            <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:shadow-xl transition-shadow duration-300 border border-slate-100 dark:border-slate-700">
                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center mb-6">
                                    <item.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-6 bg-indigo-50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16">Trusted by Thousands</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm relative">
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
                            </div>
                            <p className="text-lg text-slate-700 dark:text-slate-300 italic mb-6">"I requested a loan from my living room and the money was in my account before I finished my coffee. The location verification was seamless!"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center font-bold text-purple-700">JS</div>
                                <div>
                                    <h4 className="font-bold">John Smith</h4>
                                    <p className="text-sm text-slate-500">Small Business Owner</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm relative">
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
                            </div>
                            <p className="text-lg text-slate-700 dark:text-slate-300 italic mb-6">"Finally a loan service that doesn't make me run around town. They verified my home location instantly and I got the funds for my emergency."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center font-bold text-pink-700">EM</div>
                                <div>
                                    <h4 className="font-bold">Emily Martinez</h4>
                                    <p className="text-sm text-slate-500">Freelance Designer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Loan Application Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold cursor-pointer">Apply for Loan</h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter your full name"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="tel"
                                            required
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200">Location attached</p>
                                        <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                                            {location.address || (location.lat ? `${location.lat}, ${location.long}` : "Waiting for location...")}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!location.lat && !locationError}
                                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Submit Application
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
