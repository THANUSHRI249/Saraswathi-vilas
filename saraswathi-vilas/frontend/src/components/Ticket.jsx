export default function Ticket({ token, meta, children, stampText, leafStamp }) {
  return (
    <div className="ticket">
      {stampText && <div className={`stamp ${leafStamp ? "leafstamp" : ""}`}>{stampText}</div>}
      <div className="tk-head">
        <div>
          <div className="tk-token">Token #{token}</div>
          <div className="tk-meta">{meta}</div>
        </div>
      </div>
      {children}
    </div>
  );
}
