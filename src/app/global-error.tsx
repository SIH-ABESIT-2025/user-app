"use client";

export const dynamic = 'force-dynamic';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh',
            textAlign: 'center',
            padding: '2rem'
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
        </div>
    );
}
