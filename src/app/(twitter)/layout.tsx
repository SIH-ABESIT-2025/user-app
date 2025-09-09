"use client";

import Footer from "@/components/layout/Footer";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import { AuthContext } from "@/contexts/AuthContext";
import useAuth from "@/hooks/useAuth";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    const auth = useAuth();

    return (
        <AuthContext.Provider value={auth}>
            <div className="layout">
                <LeftSidebar />
                {children}
                <RightSidebar />
                <Footer />
            </div>
        </AuthContext.Provider>
    );
}

