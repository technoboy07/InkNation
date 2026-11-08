// Stand-in for the real pairing QR, which will encode a short-lived token from the API.
export function QrPlaceholder({ size = 152, label = "Pairing QR code" }: { size?: number; label?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 21 21" shapeRendering="crispEdges" role="img" aria-label={label}>
      <rect width="21" height="21" fill="#ffffff" />
      <g fill="#0e0e0e">
        <path d="M0 0h7v7H0zM14 0h7v7h-7zM0 14h7v7H0z" />
        <path d="M1 1h5v5H1zM15 1h5v5h-5zM1 15h5v5H1z" fill="#ffffff" />
        <path d="M2 2h3v3H2zM16 2h3v3h-3zM2 16h3v3H2z" />
        <path d="M8 0h1v2H8zM10 1h2v1h-2zM9 3h2v2H9zM12 4h1v3h-1zM8 6h2v1H8zM8 8h3v1H8zM13 8h2v2h-2zM16 8h1v1h-1zM18 8h3v1h-3zM0 8h2v1H0zM3 9h3v1H3zM1 11h2v2H1zM5 11h2v1H5zM9 10h1v3H9zM11 11h2v1h-2zM14 11h3v1h-3zM19 10h1v3h-1zM8 14h2v1H8zM11 13h1v2h-1zM13 14h3v1h-3zM17 14h1v2h-1zM9 16h3v1H9zM14 16h2v2h-2zM19 15h2v1h-2zM8 18h1v3H8zM10 19h3v1h-3zM15 19h1v2h-1zM17 18h2v1h-2zM20 19h1v2h-1z" />
      </g>
    </svg>
  );
}
