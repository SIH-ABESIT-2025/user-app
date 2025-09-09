import { Metadata } from "next";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
    title: "Public Complaints - Government of Jharkhand",
    description: "View civic complaints and issues reported by citizens in Jharkhand",
};

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <div className="public-layout">
                {children}
            </div>
        </ThemeProvider>
    );
}
