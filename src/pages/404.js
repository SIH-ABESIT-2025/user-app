export default function Custom404() {
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
      <h1>Sorry, that page doesn&apos;t exist!</h1>
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
