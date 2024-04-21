import React from 'react';

const ErrorPage = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>

            <a href="/">Go to Home</a>
        </div>
    );
};

export default ErrorPage;