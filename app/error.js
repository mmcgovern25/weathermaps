'use client';

export default function Error({error}) {
    return <main className="error">
        <h1>An error occurred!</h1>
        <p>Failed to fetch weather data, please try again later.</p>
    </main>
}