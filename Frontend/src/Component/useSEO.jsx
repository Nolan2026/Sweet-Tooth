import { useEffect } from 'react';

const useSEO = ({ title, description, url, metaType = 'website', image = 'https://sweettooth.com/frontend_img.png' }) => {
    useEffect(() => {
        // Basic Tags
        if (title) {
            document.title = title;
            document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
            document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
        }

        if (description) {
            document.querySelector('meta[name="description"]')?.setAttribute('content', description);
            document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
            document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
        }

        if (image) {
            document.querySelector('meta[property="og:image"]')?.setAttribute('content', image);
            document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', image);
        }

        if (url) {
            document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
            let canonical = document.querySelector('link[rel="canonical"]');
            if (canonical) {
                canonical.setAttribute('href', url);
            } else {
                canonical = document.createElement('link');
                canonical.setAttribute('rel', 'canonical');
                canonical.setAttribute('href', url);
                document.head.appendChild(canonical);
            }
        }

    }, [title, description, url, metaType, image]);
};

export default useSEO;
