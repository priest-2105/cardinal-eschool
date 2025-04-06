"use client"

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseTable } from "../coursetable/index";
import { getAdminClasses } from "@/lib/api/admin/managecourses/courselist";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/admin/ui/alert";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CourseList() {
    const [searchQuery, setSearchQuery] = useState("");
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = useSelector((state: RootState) => state.auth?.token);
    const router = useRouter();

    // Function to handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    useEffect(() => {
        const fetchCourses = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const response = await getAdminClasses(token, searchQuery, perPage, currentPage);
                setCourses(response.data.classes);
                setTotalPages(response.data.pagination.last_page);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch courses");
            } finally {
                setLoading(false);
            }
        };
        router.prefetch("createcourse");
        fetchCourses();
    }, [token, searchQuery, perPage, currentPage]);

    return (
        <div className="space-y-4">
            <div className="sm:flex max-sm:block max-sm:pb-3 items-center justify-between">
                <div className="space-y-1 max-sm:pb-3">
                    <h2 className="text-2xl font-semibold">View Course Lists</h2>
                    <p className="text-sm text-muted-foreground">Manage and track your enrolled courses</p>
                </div>
                <Button onClick={() => router.push("createcourse")}>
                    <Plus className="mr-2 h-4 w-4" /> Create Class
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Select value={perPage.toString()} onValueChange={(val) => setPerPage(parseInt(val))}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Results Per Page" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10 Results Per Page</SelectItem>
                        <SelectItem value="20">20 Results Per Page</SelectItem>
                        <SelectItem value="50">50 Results Per Page</SelectItem>
                    </SelectContent>
                </Select>

                <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search courses by name or code..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="pl-8 w-full"
                    />
                </div>
            </div>

            {error && (
                <Alert variant="danger">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {loading ? (
                <div className="py-12 text-center">
                    <p className="text-lg font-medium">Loading courses...</p>
                </div>
            ) : courses.length === 0 && searchQuery ? (
                <div className="py-12 text-center">
                    <p className="text-lg font-medium">No courses match your search "{searchQuery}"</p>
                    <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
                </div>
            ) : courses.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-lg font-medium">No courses available</p>
                </div>
            ) : (
                <CourseTable courses={courses} />
            )}

            {totalPages > 1 && courses.length > 0 && !loading && (
                <div className="flex w-fit justify-end items-center gap-4 py-4">
                    <Select value={currentPage.toString()} onValueChange={(val) => setCurrentPage(parseInt(val))}>
                        <SelectTrigger>
                            Page {currentPage} of {totalPages}
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                    Page {i + 1}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
}

