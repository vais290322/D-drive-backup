import libraryUrlApi from '@/common/library';
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeContext';
import axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { BookOpen, Loader2, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ReturnBookPage = () => {
    const { theme } = useTheme();
    const schoolId = useSelector((state) => state?.auth?.schoolId);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [input, setInput] = useState({
        bookNumber: "",
        studentId: "",
    });

    const returnBook = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const response = await axios.post(
                `${libraryUrlApi.returnBook.url}/${schoolId}`,
                input,
                { headers: { "Content-Type": "application/json" } }
            );
       
            if (response) {
                setInput({
                    bookNumber: "",
                    studentId: "",
                });
                toast.success(response?.data?.message || "Book returned successfully");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error returning book");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className={`min-h-screen ${theme === "light" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
            <div className="container mx-auto py-8 px-4">
                {/* Page Header with Gradient */}
                <div className={`mb-6 ${theme === "light" ? "text-white" : "text-gray-800"}`}>
                    <h1 className="text-2xl md:text-3xl font-bold relative inline-block">
                        Return Book
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
                    </h1>
                    <p className="mt-2 text-sm md:text-base opacity-80">
                        Process book returns from students
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="max-w-md mx-auto">
                    <div className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                        theme === "light" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                    }`}>
                        {/* Card Header */}
                        <div className={`p-4 sm:p-6 border-b ${
                            theme === "light" ? "border-gray-700" : "border-gray-200"
                        }`}>
                            <div className="flex items-center justify-center">
                                <RotateCcw className={`h-6 w-6 mr-2 ${theme === "light" ? "text-purple-400" : "text-purple-600"}`} />
                                <h2 className={`text-xl font-bold ${theme === "light" ? "text-white" : "text-gray-800"}`}>
                                    Book Return Form
                                </h2>
                            </div>
                        </div>

                        {/* Form Content */}
                        <form onSubmit={returnBook}>
                            <div className="p-4 sm:p-6 space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="bookNumber" className={`text-base ${theme === "light" ? "text-gray-200" : "text-gray-700"}`}>
                                        Book Number <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input 
                                            required 
                                            type="text" 
                                            id="bookNumber" 
                                            placeholder="Enter book number" 
                                            value={input.bookNumber} 
                                            onChange={(e) => setInput({ ...input, bookNumber: e.target.value })}
                                            className={`pl-10 ${theme === "light" ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "bg-white border-gray-300 placeholder:text-gray-400"}`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="studentId" className={`text-base ${theme === "light" ? "text-gray-200" : "text-gray-700"}`}>
                                        Student ID <span className="text-red-500">*</span>
                                    </Label>
                                    <Input 
                                        required 
                                        type="text" 
                                        id="studentId" 
                                        placeholder="Enter student ID" 
                                        value={input.studentId} 
                                        onChange={(e) => setInput({ ...input, studentId: e.target.value })}
                                        className={`${theme === "light" ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "bg-white border-gray-300 placeholder:text-gray-400"}`}
                                    />
                                </div>
                            </div>

                            <div className={`p-4 sm:p-6 border-t ${theme === "light" ? "border-gray-700" : "border-gray-200"}`}>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Return Book
                                            <RotateCcw className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Additional Information Card */}
                    <div className={`mt-6 rounded-xl p-4 shadow-md ${
                        theme === "light" ? "bg-gray-800 border border-gray-700 text-gray-300" : "bg-white border border-gray-200 text-gray-600"
                    }`}>
                        <h3 className={`text-sm font-medium mb-2 ${theme === "light" ? "text-gray-200" : "text-gray-700"}`}>
                            Important Information
                        </h3>
                        <ul className="text-sm space-y-1 list-disc pl-5">
                            <li>Enter the book number exactly as it appears on the book</li>
                            <li>Student ID must match the ID used when the book was issued</li>
                            <li>Check for any damages before processing the return</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReturnBookPage;