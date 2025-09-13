export default function Custom500() {
  return (
    <div style={{ 
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
      <p>We&apos;re working on fixing this issue. Please try again later.</p>
      <a href="/" style={{ 
        color: '#0070f3', 
        textDecoration: 'none',
        fontSize: '1.2rem',
        marginTop: '1rem'
      }}>
        Return to the homepage
      </a>
    </div>
  );
}
