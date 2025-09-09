import { useState } from "react";
import { useRouter } from "next/navigation";

import { BsSearch } from "react-icons/bs";

export default function Search() {
    const [searchQuery, setSearchQuery] = useState("");

    const router = useRouter();

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const encodedSearchQuery = encodeURI(searchQuery.trim());
            router.push(`/search?q=${encodedSearchQuery}`);
        }
    };

    return (
        <form className="search" onSubmit={onSearch}>
            <input
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search complaints, issues, locations..."
                required
            />
            <BsSearch />
        </form>
    );
}
