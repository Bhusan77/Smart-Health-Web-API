"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { handleDeleteUser } from "@/lib/actions/admin/user-action";
import DeleteModal from "./DeleteModal";

// import { handleDeleteUser } from "@/lib/actions/admin/user-action";
// import DeleteModal from "@/app/_components/DeleteModal";
const UserTable = (
    { users, pagination, search }: { users: any[], pagination: any, search?: string }
) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(search || '');
    const handleSearchChange = () => {
        router.push(`/admin/users?page=1&size=${pagination.size}` +
            (searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''));
    };
    const makePagination = (): React.ReactElement[] => {
        const pages = [];
        const currentPage = pagination.page;
        const totalPages = pagination.totalPages;
        const delta = 2; // Number of pages to show on each side of current page

        // Previous button
        const prevHref = `/admin/users?page=${currentPage - 1}&size=${pagination.size}` +
            (searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '');
        pages.push(
            <Link key="prev"
                className={`px-3 py-1 border rounded-md 
                    ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
                href={currentPage === 1 ? '#' : prevHref}>
                Previous
            </Link>
        );

        // Calculate range of pages to show
        let startPage = Math.max(1, currentPage - delta);
        let endPage = Math.min(totalPages, currentPage + delta);

        // Add first page if not in range
        if (startPage > 1) {
            const href = `/admin/users?page=1&size=${pagination.size}` +
                (searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '');
            pages.push(
                <Link key={1}
                    className="px-3 py-1 border rounded-md bg-white text-blue-500 hover:bg-blue-100"
                    href={href}>
                    1
                </Link>
            );
            if (startPage > 2) {
                pages.push(
                    <span key="ellipsis1" className="px-2 text-gray-500">...</span>
                );
            }
        }

        // Add page numbers in range
        for (let i = startPage; i <= endPage; i++) {
            const href = `/admin/users?page=${i}&size=${pagination.size}` +
                (search ? `&search=${encodeURIComponent(search)}` : '');
            pages.push(
                <Link key={i}
                    className={`px-3 py-1 border rounded-md 
                        ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
                    href={href}>
                    {i}
                </Link>
            );
        }

        // Add last page if not in range
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <span key="ellipsis2" className="px-2 text-gray-500">...</span>
                );
            }
            const href = `/admin/users?page=${totalPages}&size=${pagination.size}` +
                (search ? `&search=${encodeURIComponent(search)}` : '');
            pages.push(
                <Link key={totalPages}
                    className="px-3 py-1 border rounded-md bg-white text-blue-500 hover:bg-blue-100"
                    href={href}>
                    {totalPages}
                </Link>
            );
        }

        // Next button
        const nextHref = `/admin/users?page=${currentPage + 1}&size=${pagination.size}` +
            (search ? `&search=${encodeURIComponent(search)}` : '');
        pages.push(
            <Link key="next"
                className={`px-3 py-1 border rounded-md 
                    ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
                href={currentPage === totalPages ? '#' : nextHref}>
                Next
            </Link>
        );

        return pages;
    }
    const [deleteId, setDeleteId] = useState(null);

    const onDelete = async () => {
        console.log(deleteId);
        try {
            await handleDeleteUser(deleteId!);
            toast.success("User deleted successfully");
        } catch (err: Error | any) {
            toast.error(err.message || "Failed to delete user");
        } finally {
            setDeleteId(null);
        }
    }
    return (
        <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg">
            <DeleteModal
                isOpen={deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={onDelete}
                title="Delete Confirmation"
                description="Are you sure you want to delete this item? This action cannot be undone."
            />

            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearchChange();
                            }
                        }}
                        placeholder="Search users..."
                        className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                    />
                    <button onClick={handleSearchChange}
                        className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                        <span className="text-slate-500">Search</span>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-mono">{user._id}</td>
                                <td className="px-6 py-4">
                                    {user.imageUrl ? (
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${user.imageUrl}`}
                                            alt="User Image"
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700 shadow-sm"
                                            width={40}
                                            height={40}
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700 shadow-sm">
                                            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">N/A</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{user.fullname || " "}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{user.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex items-center gap-3">
                                        <Link href={`/admin/users/${user._id}`} className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline font-medium transition-colors duration-150">View</Link>
                                        <Link href={`/admin/users/${user._id}/edit`} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-medium transition-colors duration-150">Edit</Link>
                                        <button
                                            onClick={() => setDeleteId(user._id)}
                                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:underline font-medium transition-colors duration-150">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="p-5 flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 gap-4">
                <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    Page <span className="font-semibold text-blue-600 dark:text-blue-400">{pagination.page}</span> of <span className="font-semibold text-blue-600 dark:text-blue-400">{pagination.totalPages}</span>
                </div>
                <div className="space-x-2">
                    {makePagination()}
                </div>
            </div>
        </div>
    );
}

export default UserTable;