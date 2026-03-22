/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "www.google.com",
                pathname: "/s2/favicons", // Matches `/s2/favicons`
            },
            {
                protocol: "https",
                hostname: "t1.gstatic.com",
                pathname: "/faviconV2", // Matches `/faviconV2`
            },
            {
                protocol: "https",
                hostname: "flagsapi.com",
                pathname:"**"
            }
        ],
    },
};

export default nextConfig;
