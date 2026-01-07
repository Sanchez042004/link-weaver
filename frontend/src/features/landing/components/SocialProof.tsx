import React, { useEffect, useRef } from 'react';
import { env } from '../../../config/env';

const SocialProof: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // --- STATE ---
        let animationFrameId: number;
        let urls: UrlEntity[] = [];
        let width = container.clientWidth;
        let height = container.clientHeight;
        let frameCount = 0;

        // --- CONFIG ---
        const spawnRate = 100;

        const longUrls = [
            "https://amazon.com/products/ref=long_id_123",
            "https://docs.google.com/spreadsheets/d/xpSq",
            "https://nytimes.com/2024/tech/ai-future-now",
            "https://github.com/facebook/react/issues/89",
            "https://spotify.com/track/4cOdK2wGLETKBW",
            "https://airbnb.com/rooms/12345678",
        ];

        const shortSlugs = ["demo", "shop", "blog", "meet", "app", "wiki", "2026", "link", "go", "sale"];

        const isDark = document.documentElement.classList.contains('dark');

        const colors = {
            long: {
                bg: isDark ? '#1e293b' : '#e2e8f0',
                text: isDark ? '#94a3b8' : '#64748b',
                border: isDark ? '#334155' : '#cbd5e1'
            },
            short: {
                bg: isDark ? '#3b82f6' : '#2563eb',
                text: '#ffffff',
                border: isDark ? '#60a5fa' : '#3b82f6'
            }
        };

        // --- ENTITY CLASS ---
        class UrlEntity {
            noseX: number;
            y: number;
            textLong: string;
            textShort: string;
            widthCurrent: number;
            widthLong: number;
            widthShort: number;
            speed: number;

            constructor(startX?: number) {
                const randomLong = longUrls[Math.floor(Math.random() * longUrls.length)];
                const randomSlug = shortSlugs[Math.floor(Math.random() * shortSlugs.length)];

                this.textLong = randomLong;
                this.textShort = `${env.getShortUrlBaseDisplay()}/${randomSlug}`;
                this.widthLong = Math.min(320, randomLong.length * 9);
                this.widthShort = 130;
                this.widthCurrent = this.widthLong;

                const initialLeft = startX !== undefined ? startX : -400;
                this.noseX = initialLeft + this.widthLong;

                const pillHeight = 40;
                const safePadding = 40;
                const topZoneLimit = height * 0.20;
                const bottomZoneStart = height * 0.80;

                const isTop = Math.random() > 0.5;

                if (isTop) {
                    const maxY = Math.max(topZoneLimit - pillHeight, safePadding + 10);
                    this.y = Math.random() * (maxY - safePadding) + safePadding;
                } else {
                    const maxY = height - pillHeight - safePadding;
                    const minY = bottomZoneStart + 10;
                    if (maxY > minY) {
                        this.y = Math.random() * (maxY - minY) + minY;
                    } else {
                        this.y = height - pillHeight - safePadding;
                    }
                }

                this.speed = Math.random() * 1.5 + 2.0;
            }

            get leftX() {
                return this.noseX - this.widthCurrent;
            }

            update() {
                if (this.widthCurrent <= this.widthShort + 1) {
                    this.speed += 0.05;
                }
                this.noseX += this.speed;

                const center = width / 2;
                if (this.noseX > center) {
                    if (this.widthCurrent > this.widthShort) {
                        const shrinkRate = 5.0;
                        this.widthCurrent = Math.max(this.widthShort, this.widthCurrent - shrinkRate);
                    }
                }
            }

            drawPill(ctx: CanvasRenderingContext2D, center: number, clipSide: 'left' | 'right') {
                const x = this.leftX;
                const w = this.widthCurrent;
                const style = clipSide === 'left' ? colors.long : colors.short;
                const txt = clipSide === 'left' ? this.textLong : this.textShort;

                ctx.save();
                ctx.beginPath();
                if (clipSide === 'left') {
                    ctx.rect(0, 0, center, height);
                } else {
                    ctx.rect(center, 0, width, height);
                }
                ctx.clip();

                ctx.beginPath();
                const r = 8;
                ctx.roundRect(x, this.y, w, 32, r);
                ctx.fillStyle = style.bg;
                ctx.fill();
                ctx.strokeStyle = style.border;
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.font = "bold 14px 'Courier New', monospace";
                ctx.fillStyle = style.text;

                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, this.y, w, 32, r);
                ctx.clip();
                ctx.fillText(txt, x + 12, this.y + 20);
                ctx.restore();

                ctx.restore();
            }

            draw() {
                if (!ctx) return;
                const center = width / 2;
                if (this.leftX < center) this.drawPill(ctx, center, 'left');
                if (this.noseX > center) this.drawPill(ctx, center, 'right');
            }

            isOffScreen() {
                return this.leftX > width + 100;
            }
        }

        // --- RESIZE ---
        const resize = () => {
            if (!container || !canvas) return;
            width = container.clientWidth;
            height = container.clientHeight;
            // Use logical resolution for sharpness, matching CSS size
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            // Re-assign logical width/height to internal vars for calcs
            // Actually, ctx.scale handles the zoom. We can keep using logical width/height for physics.
        };

        // --- ANIMATION LOOP ---
        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            const center = width / 2;

            // Background Elements (Lines, Glows)
            ctx.beginPath();
            ctx.moveTo(center, 0);
            ctx.lineTo(center, height);
            ctx.strokeStyle = isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();

            const gradient = ctx.createLinearGradient(center - 10, 0, center + 10, 0);
            gradient.addColorStop(0, "transparent");
            gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.3)");
            gradient.addColorStop(1, "transparent");
            ctx.fillStyle = gradient;
            ctx.fillRect(center - 60, 0, 120, height);


            // Spawn logic
            frameCount++;
            if (frameCount % spawnRate === 0) {
                let attempts = 0;
                let added = false;
                while (attempts < 5 && !added) {
                    const testEntity = new UrlEntity();
                    const hasOverlap = urls.some(u => Math.abs(u.y - testEntity.y) < 50);
                    if (!hasOverlap) {
                        urls.push(testEntity);
                        added = true;
                    }
                    attempts++;
                }
            }

            // Update & Draw
            for (let i = urls.length - 1; i >= 0; i--) {
                const u = urls[i];
                u.update();
                u.draw();
                if (u.isOffScreen()) urls.splice(i, 1);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        // --- INIT ---
        resize();
        window.addEventListener('resize', resize);

        // Populate initially
        for (let i = 0; i < 5; i++) {
            urls.push(new UrlEntity(Math.random() * width - 400));
        }

        animate();

        // --- CLEANUP ---
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="w-full py-24 min-h-[500px] flex flex-col justify-center bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 relative overflow-hidden" ref={containerRef}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Very faint overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/60 dark:from-background-dark/60 dark:to-background-dark/60 pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                <div className="mb-20">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">Streamline Your Links</h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        In goes the clutter, out comes clarity. Watch how our platform transforms your digital presence in real-time.
                    </p>
                </div>

                <div className="p-8 bg-white/60 dark:bg-surface-dark/60 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl dark:shadow-none transition-transform hover:scale-[1.01] duration-500">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-left">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ready to shorten the distance?</h3>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">Start creating powerful, trackable short links today.</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <a href="/features" className="flex-1 md:flex-none py-3 px-6 bg-transparent border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors text-center">
                                Features
                            </a>
                            <a href="/signup" className="flex-1 md:flex-none py-3 px-6 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-primary/20 transition-all text-center">
                                Get Started Free
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialProof;
