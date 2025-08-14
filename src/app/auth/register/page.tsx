"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account, databases, storage } from "@/lib/appwrite";
import { ID } from "appwrite";
import Link from "next/link";
import { FaUser, FaEnvelope, FaLock, FaFilm, FaImage, FaPhone } from "react-icons/fa";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Image from "next/image";

{/* Converts a canvas data URL to a File object */ }
function dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

{/* An animated background of scrolling movie posters */ }
const BackgroundScroller = () => {
    const posters = [
        '/1RICxzeoNCAO5NpcRMIgg1XT6fm.jpg',
        '/yUtaHkL2SDIAZhRApZAyQrAXygn.jpg',
        '/kD0TOH6EM1q7UfgugBXuMoZd3m5.jpg',
        '/q5pXRYTycaeW6dEgsCrd4mYPmxM.jpg',
        '/kr36awqmziEI5mfUElsHB0pj9zP.jpg',
        '/ljHw5eIMnki3HekwkKwCCHsRSbH.jpg',
        '/lQfuaXjANoTsdx5iS0gCXlK9D2L.jpg',
        '/9BAjt8nSSms62uOVYn1t3C3dVto.jpg',
        '/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg',
        '/cJRPOLEexI7qp2DKtFfCh7YaaUG.jpg',
        '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        '/kDp1vUBnMpe8ak4rjgl3c9L53HL.jpg',
        '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        '/sF1U4EUQS8YJANg5pW3de2pLVPq.jpg',
        '/rULWuutDcN5NvtiZi4FRPzRYWSh.jpg',
        '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        '/zfbjgQE1uSd925saic9O92lGDs8.jpg',
        '/f89SLAMbDUcvXJYsHkvgAhGkme.jpg',
    ];

    const allPosters = [...posters, ...posters];

    return (
        <div className="absolute inset-0 w-full h-full flex items-center overflow-hidden opacity-10">
            <div className="scroller flex w-max">
                {allPosters.map((poster, index) => (
                    <img
                        key={index}
                        src={`https://image.tmdb.org/t/p/w500${poster}`}
                        alt=""
                        className="w-48 h-auto object-cover mx-2 rounded-lg"
                        aria-hidden="true"
                        loading="lazy"
                    />
                ))}
            </div>
            <style jsx>{`
        .scroller {
          animation: marquee 60s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
        </div>
    );
};

{/* The user registration page component */ }
export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<Crop>();
    const [isCropModalOpen, setCropModalOpen] = useState(false);
    const [croppedImageFile, setCroppedImageFile] = useState<File | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [originalFileName, setOriginalFileName] = useState('');

    {/* Opens the cropping modal when a user selects a file */ }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setOriginalFileName(file.name);
            const reader = new FileReader();
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
            reader.readAsDataURL(file);
            setCropModalOpen(true);
        }
    };

    {/* Sets the initial crop area when the image loads in the modal */ }
    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const initialCrop = centerCrop(
            makeAspectCrop({ unit: '%', width: 90 }, 1, width, height),
            width,
            height
        );
        setCrop(initialCrop);
    };

    {/* Confirms the crop and creates a file from the cropped image data */ }
    const handleCropConfirm = () => {
        if (completedCrop?.width && completedCrop?.height && imgRef.current) {
            const canvas = document.createElement('canvas');
            const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
            const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
            canvas.width = completedCrop.width * scaleX;
            canvas.height = completedCrop.height * scaleY;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.drawImage(
                    imgRef.current,
                    completedCrop.x * scaleX,
                    completedCrop.y * scaleY,
                    completedCrop.width * scaleX,
                    completedCrop.height * scaleY,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                const dataUrl = canvas.toDataURL('image/jpeg');
                const file = dataURLtoFile(dataUrl, originalFileName);
                setCroppedImageFile(file);
            }
        }
        setCropModalOpen(false);
    };

    {/* Handles the user registration process */ }
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setLoading(true);
        try {
            const user = await account.create(ID.unique(), email, password, name);
            await account.createEmailPasswordSession(email, password);

            let profileImageId = "";
            let profileImageUrl = "";

            if (croppedImageFile) {
                const uploaded = await storage.createFile(
                    process.env.NEXT_PUBLIC_APPWRITE_PROFILE_BUCKET_ID!,
                    ID.unique(),
                    croppedImageFile
                );
                profileImageId = uploaded.$id;
                profileImageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_PROFILE_BUCKET_ID}/files/${uploaded.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
            }

            await databases.createDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.NEXT_PUBLIC_APPWRITE_USER_PROFILES_COLLECTION_ID!,
                ID.unique(),
                { userId: user.$id, profileImageId, profileImageUrl }
            );

            await databases.createDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.NEXT_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID!,
                ID.unique(),
                { userId: user.$id, fullName: name, phone: phone }
            );

            router.push("/");
            router.refresh();
        } catch (err: any) {
            console.error("❌ Registration failed:", err);
            setError(err.message || "An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {isCropModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-4 rounded-lg max-w-lg w-full">
                        <h2 className="text-white text-xl mb-4">Crop Your Profile Photo</h2>
                        {imgSrc && (
                            <ReactCrop
                                crop={crop}
                                onChange={c => setCrop(c)}
                                onComplete={c => setCompletedCrop(c)}
                                aspect={1}
                                circularCrop
                            >
                                <img ref={imgRef} src={imgSrc} onLoad={onImageLoad} alt="Crop preview" style={{ maxHeight: '70vh' }} />
                            </ReactCrop>
                        )}
                        <div className="mt-4 flex justify-end gap-4">
                            <button
                                onClick={() => setCropModalOpen(false)}
                                className="px-4 py-2 font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCropConfirm}
                                className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                Confirm Crop
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-gray-950 p-4 overflow-hidden gap-8">
                <BackgroundScroller />

                <div className="relative z-10 text-center">
                    <h1 className="text-3xl pb-2 font-extrabold text-white tracking-tight sm:text-5xl">
                        Enjoy 500+ movies in different languages
                    </h1>
                </div>

                <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700">
                    <div className="text-center">
                        <FaFilm className="mx-auto h-10 w-auto text-blue-500" />
                        <h2 className="mt-4 text-2xl font-bold text-white">Create Your Account</h2>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="relative">
                            <FaUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 pl-10 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="relative">
                            <FaPhone className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                placeholder="Phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-3 pl-10 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="relative">
                            <FaEnvelope className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 pl-10 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Password (min. 8 characters)"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 pl-10 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="photo-upload" className="block w-full p-3 pl-10 bg-gray-800 text-white border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700">
                                <FaImage className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                                <span className={croppedImageFile ? 'text-green-400' : 'text-gray-400'}>
                                    {croppedImageFile ? 'Photo Ready!' : 'Upload Profile Photo'}
                                </span>
                            </label>
                            <input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        {croppedImageFile && (
                            <div className="flex justify-center">
                                <img
                                    src={URL.createObjectURL(croppedImageFile)}
                                    alt="Cropped preview"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                                />
                            </div>
                        )}

                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="font-medium text-blue-400 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}