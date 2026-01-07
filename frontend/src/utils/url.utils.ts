export const getDomain = (url: string): string => {
    try {
        const domain = new URL(url).hostname.replace('www.', '');
        return domain;
    } catch (e) {
        return url;
    }
};

export const getPlatform = (url: string): string => {
    const domain = getDomain(url).toLowerCase();
    
    if (domain.includes('youtube.com') || domain.includes('youtu.be')) return 'youtube';
    if (domain.includes('instagram.com')) return 'instagram';
    if (domain.includes('twitter.com') || domain.includes('x.com')) return 'twitter';
    if (domain.includes('facebook.com') || domain.includes('fb.com')) return 'facebook';
    if (domain.includes('spotify.com')) return 'spotify';
    if (domain.includes('tiktok.com')) return 'tiktok';
    if (domain.includes('linkedin.com')) return 'linkedin';
    if (domain.includes('github.com')) return 'github';
    if (domain.includes('twitch.tv')) return 'twitch';
    if (domain.includes('discord.com') || domain.includes('discord.gg')) return 'discord';
    if (domain.includes('netflix.com')) return 'netflix';
    if (domain.includes('whatsapp.com')) return 'whatsapp';
    
    return 'generic';
};
