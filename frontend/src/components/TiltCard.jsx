import { useRef } from 'react';

/**
 * 3D-tilt-on-hover wrapper — pure CSS/JS, no extra dependency.
 * Perspective is set on this wrapper; the inner .tilt-card does the rotation.
 */
export default function TiltCard({ children, className = '', maxTilt = 6 }) {
    const ref = useRef(null);

    const handleMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const inner = el.querySelector('.tilt-card');
        if (inner) {
            inner.style.transform = `rotateY(${px * maxTilt}deg) rotateX(${-py * maxTilt}deg) translateZ(6px)`;
        }
    };

    const handleLeave = () => {
        const el = ref.current;
        const inner = el && el.querySelector('.tilt-card');
        if (inner) inner.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className={className}
            style={{ perspective: '900px' }}
        >
            <div className="tilt-card h-full">{children}</div>
        </div>
    );
}
