"use client";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <html>
            <head>
                <title>Something went wrong</title>
            </head>
            <body style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '100vh',
                textAlign: 'center',
                padding: '2rem',
                fontFamily: 'Arial, sans-serif'
            }}>
                <h1>Something went wrong!</h1>
                <button 
                    onClick={() => reset()}
                    style={{
                        backgroundColor: '#0070f3',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        marginTop: '1rem'
                    }}
                >
                    Try again
                </button>
            </body>
        </html>
    );
}
