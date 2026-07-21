import React, { useState } from "react";
import {
    CommandLineIcon,
    KeyIcon,
    CloudArrowUpIcon,
    DocumentDuplicateIcon,
    CheckIcon,
    CodeBracketIcon,
    TrashIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/outline";

const DeveloperDocsPage = () => {
    const [copiedSection, setCopiedSection] = useState(null);
    const [activeLang, setActiveLang] = useState("javascript");

    const copyToClipboard = (text, section) => {
        navigator.clipboard.writeText(text);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 2000);
    };

    const uploadResponse = {
        "statusCode": 201,
        "data": {
            "fileId": "695ce180d810b1e51cc91237",
            "fileName": "Screenshot (20).png",
            "fileUrl": "http://localhost:5000/uploads/1767694720194-95438fbf-559f-4660-a7c2-085398ac837a-Screenshot__20_.png",
            "fileType": "image",
            "mimeType": "image/png",
            "size": 265655,
            "formattedSize": "259.43 KB",
            "visibility": "public",
            "uploadedAt": "2026-01-06T10:18:40.206Z",
            "metadata": {
                "width": 1920,
                "height": 1080,
                "format": "png"
            }
        },
        "message": "File uploaded successfully",
        "success": true
    };

    const codeExamples = {
        curl: {
            title: "cURL (Upload)",
            code: `curl -X POST http://localhost:5000/api/v1/files/upload \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -F "file=@/path/to/image.png" \\
  -F "visibility=public" \\
  -F "folderId=695ce180d810b1e51cc9" # Optional folder ID`,
        },
        deleteCurl: {
            title: "cURL (Delete)",
            code: `curl -X DELETE http://localhost:5000/api/v1/files/695ce180d810b1e51cc91237 \\
  -H "X-API-Key: YOUR_API_KEY"`,
        },
        javascript: {
            title: "JavaScript (Axios)",
            code: `import axios from 'axios';
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('visibility', 'public');
formData.append('folderId', '695ce180d810b1e51cc9'); // Optional

const response = await axios.post('http://localhost:5000/api/v1/files/upload', formData, {
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    'Content-Type': 'multipart/form-data'
  }
});

console.log('File URL:', response.data.data.fileUrl);`,
        },
        python: {
            title: "Python (Requests)",
            code: `import requests

url = "http://localhost:5000/api/v1/files/upload"
payload = {'visibility': 'public', 'folderId': '695ce180d810b1e51cc9'}
files = [
  ('file', ('image.png', open('/path/to/image.png','rb'), 'image/png'))
]
headers = {
  'X-API-Key': 'YOUR_API_KEY'
}

response = requests.request("POST", url, headers=headers, data=payload, files=files)
print(response.text)`,
        },
        php: {
            title: "PHP (cURL)",
            code: `<?php
$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_URL => 'http://localhost:5000/api/v1/files/upload',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => array(
    'file'=> new CURLFILE('/path/to/file'),
    'visibility' => 'public',
    'folderId' => '695ce180d810b1e51cc9'
  ),
  CURLOPT_HTTPHEADER => array(
    'X-API-Key: YOUR_API_KEY'
  ),
));
$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
        },
        java: {
            title: "Java (OkHttp)",
            code: `OkHttpClient client = new OkHttpClient().newBuilder().build();
RequestBody body = new MultipartBody.Builder().setType(MultipartBody.FORM)
  .addFormDataPart("file","/path/to/file",
    RequestBody.create(MediaType.parse("application/octet-stream"),
    new File("/path/to/file")))
  .addFormDataPart("visibility","public")
  .addFormDataPart("folderId","695ce180d810b1e51cc9")
  .build();
Request request = new Request.Builder()
  .url("http://localhost:5000/api/v1/files/upload")
  .method("POST", body)
  .addHeader("X-API-Key", "YOUR_API_KEY")
  .build();
Response response = client.newCall(request).execute();`,
        },
        csharp: {
            title: "C# (HttpClient)",
            code: `var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Post, "http://localhost:5000/api/v1/files/upload");
request.Headers.Add("X-API-Key", "YOUR_API_KEY");
var content = new MultipartFormDataContent();
content.Add(new StreamContent(File.OpenRead("/path/to/file")), "file", "filename");
content.Add(new StringContent("public"), "visibility");
content.Add(new StringContent("695ce180d810b1e51cc9"), "folderId");
request.Content = content;
var response = await client.SendAsync(request);
response.EnsureSuccessStatusCode();
Console.WriteLine(await response.Content.ReadAsStringAsync());`,
        },
    };

    const CodeBlock = ({ code, section, title, lang = "text" }) => (
        <div className="relative group mt-4">
            <div className="flex justify-between items-center bg-gray-800 text-gray-300 px-4 py-2 rounded-t-lg border-b border-gray-700">
                <span className="text-xs font-mono uppercase tracking-wider">{title}</span>
                <button
                    onClick={() => copyToClipboard(code, section)}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                    {copiedSection === section ? (
                        <CheckIcon className="w-5 h-5 text-green-500" />
                    ) : (
                        <DocumentDuplicateIcon className="w-5 h-5" />
                    )}
                </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto font-mono text-sm leading-relaxed">
                <code>{code}</code>
            </pre>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Developer API Documentation
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Integrate our high-performance media management system into your own applications with ease.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Sidebar Navigation */}
                    <nav className="hidden lg:block space-y-2 sticky top-24 h-fit">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Documentation</p>
                        {["Introduction", "Authentication", "Base URL", "Endpoints", "Response Format", "Implementation"].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(" ", "-")}`}
                                className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all font-medium border-l-2 border-transparent hover:border-blue-600"
                            >
                                {item}
                            </a>
                        ))}
                    </nav>

                    {/* Content */}
                    <div className="lg:col-span-3 space-y-16">
                        {/* Introduction */}
                        <section id="introduction">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <CodeBracketIcon className="w-8 h-8 text-blue-600" />
                                Introduction
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                The MediaCloud REST API allows you to programmatically manage your files,
                                generate signed URLs for private access, and track storage usage. All API requests
                                should be made over HTTPS.
                            </p>
                        </section>

                        {/* Authentication */}
                        <section id="authentication">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <KeyIcon className="w-8 h-8 text-blue-600" />
                                Authentication
                            </h2>
                            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl">
                                <p className="text-blue-900 leading-relaxed">
                                    Authenticate your requests by including your API key in the <strong>X-API-Key</strong> HTTP header.
                                    You can generate keys in the <a href="/api-keys" className="font-bold underline">API Keys</a> section.
                                </p>
                            </div>
                            <CodeBlock
                                title="Header Example"
                                section="auth-header"
                                code={`X-API-Key: fup_7a4b9c1d_...`}
                            />
                        </section>

                        {/* Base URL */}
                        <section id="base-url">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <CommandLineIcon className="w-8 h-8 text-blue-600" />
                                Base URL
                            </h2>
                            <div className="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm inline-block">
                                http://localhost:5000/api/v1
                            </div>
                        </section>

                        {/* Endpoints */}
                        <section id="endpoints">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <CloudArrowUpIcon className="w-8 h-8 text-blue-600" />
                                API Endpoints
                            </h2>

                            <div className="space-y-12">
                                {/* Upload */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-bold">POST</span>
                                        <span className="font-mono text-lg text-gray-700">/files/upload</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">Upload a file using multipart/form-data.</p>
                                    <table className="min-w-full text-left text-sm mb-4">
                                        <thead className="bg-gray-50 uppercase text-gray-500 font-bold">
                                            <tr>
                                                <th className="px-4 py-2">Param</th>
                                                <th className="px-4 py-2">Type</th>
                                                <th className="px-4 py-2">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            <tr>
                                                <td className="px-4 py-3 font-mono text-xs">file</td>
                                                <td className="px-4 py-3 text-xs">File</td>
                                                <td className="px-4 py-3 text-xs">The binary file to upload</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-mono text-xs">visibility</td>
                                                <td className="px-4 py-3 text-xs">string</td>
                                                <td className="px-4 py-3 text-xs">"public" or "private"</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-mono text-xs">folderId</td>
                                                <td className="px-4 py-3 text-xs">string</td>
                                                <td className="px-4 py-3 text-xs">Optional. ID of the destination folder</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Delete */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm font-bold">DELETE</span>
                                        <span className="font-mono text-lg text-gray-700">/files/:fileId</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">Delete a specific file using its unique file ID.</p>
                                    <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3">
                                        <TrashIcon className="w-5 h-5 text-red-600 mt-0.5" />
                                        <p className="text-sm text-red-800">
                                            <strong>Warning:</strong> This action is permanent and cannot be undone.
                                            The physical file will be removed from storage immediately.
                                        </p>
                                    </div>
                                </div>

                                {/* List Files */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-bold">GET</span>
                                        <span className="font-mono text-lg text-gray-700">/files</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">Retrieve a list of your uploaded files.</p>
                                    <p className="text-xs text-gray-400 uppercase font-bold mb-2 tracking-widest">Query Parameters</p>
                                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                                        <li><code className="bg-gray-100 px-1 rounded">fileType</code>: "image", "video", "document"</li>
                                        <li><code className="bg-gray-100 px-1 rounded">search</code>: Search by original name</li>
                                        <li><code className="bg-gray-100 px-1 rounded">folderId</code>: Filter by folder ID (use "null" for root)</li>
                                        <li><code className="bg-gray-100 px-1 rounded">page</code>: Paginated results</li>
                                    </ul>
                                </div>

                                {/* Folder Management */}
                                <div className="mt-12 bg-gray-50 p-8 rounded-3xl border border-gray-200">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <CommandLineIcon className="w-6 h-6 text-blue-600" />
                                        Folder Management & Discovery
                                    </h3>

                                    <div className="space-y-6">
                                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                            <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                <InformationCircleIcon className="w-4 h-4 text-blue-500" />
                                                How to get Folder IDs?
                                            </p>
                                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                                To upload files to a specific directory, you first need its <code>folderId</code>.
                                                You can fetch all your folders via the API using <code>all=true</code>, or simply <strong>copy the ID from the Media Explorer</strong> by hovering over any folder in the dashboard.
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <span className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded text-xs font-black uppercase tracking-tighter">GET</span>
                                                <code className="text-xs bg-gray-900 text-blue-400 px-3 py-1.5 rounded-lg flex-1">/folders?all=true</code>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white p-5 rounded-xl border border-gray-100 italic cursor-pointer">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">POST</span>
                                                    <code className="text-xs font-bold">/folders</code>
                                                </div>
                                                <p className="text-xs text-gray-500">Create folders & subfolders.</p>
                                            </div>

                                            <div className="bg-white p-5 rounded-xl border border-gray-100 italic">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">GET</span>
                                                    <code className="text-xs font-bold">/folders/:id</code>
                                                </div>
                                                <p className="text-xs text-gray-500">List contents of a specific folder.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Response Format */}
                        <section id="response-format">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <InformationCircleIcon className="w-8 h-8 text-blue-600" />
                                Response Format Of Upload
                            </h2>
                            <p className="text-gray-700 mb-6">
                                All successful responses return a JSON object with the following structure.
                                Below is a sample response for a successful file upload:
                            </p>
                            <CodeBlock
                                title="JSON Response (201 Created)"
                                section="json-response"
                                code={JSON.stringify(uploadResponse, null, 4)}
                            />
                        </section>

                        {/* Code Examples */}
                        <section id="code-examples">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <CommandLineIcon className="w-8 h-8 text-blue-600" />
                                Implementation Examples
                            </h2>

                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                                {/* Language Tabs */}
                                <div className="flex bg-gray-50 border-b border-gray-100 overflow-x-auto scrollbar-hide">
                                    {Object.keys(codeExamples).map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => setActiveLang(lang)}
                                            className={`px-6 cursor-pointer py-4 text-sm font-bold transition-all whitespace-nowrap ${activeLang === lang
                                                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                                }`}
                                        >
                                            {codeExamples[lang].title}
                                        </button>
                                    ))}
                                </div>

                                {/* Code Display */}
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {codeExamples[activeLang].title}
                                        </h3>
                                        <button
                                            onClick={() => copyToClipboard(codeExamples[activeLang].code, `example-${activeLang}`)}
                                            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                        >
                                            {copiedSection === `example-${activeLang}` ? (
                                                <>
                                                    <CheckIcon className="w-4 h-4" />
                                                    <span>Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <DocumentDuplicateIcon className="w-4 h-4" />
                                                    <span>Copy Snippet</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
                                        <pre className="p-6 text-sm font-mono text-gray-100 overflow-x-auto leading-relaxed scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                                            <code>{codeExamples[activeLang].code}</code>
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 bg-amber-50 rounded-xl p-6 border border-amber-100">
                                <h4 className="text-amber-900 font-bold mb-2 flex items-center gap-2">
                                    <span className="text-xl">💡</span> Pro Tip
                                </h4>
                                <p className="text-amber-800 text-sm leading-relaxed">
                                    Use the <code>fileId</code> returned in the response to manage your files programmatically via the DELETE and GET endpoints.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeveloperDocsPage;
