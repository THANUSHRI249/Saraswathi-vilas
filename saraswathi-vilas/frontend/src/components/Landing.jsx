export default function Landing({ onGuest, onStaff }) {
  return (
    <div className="card center">
      <div className="hero-tam">வணக்கம்!</div>
      <div className="hero-en">Welcome to Saraswathi Vilas</div>
      <div className="hero-tag">பாரம்பரிய சுவை, நவீன வசதி — traditional taste, modern convenience</div>
      <div className="btn-row">
        <button className="stamp-btn primary" onClick={onGuest}>
          <span className="tam-lbl">🙏 விருந்தினராக நுழையவும்</span>
          <span className="en-lbl">Continue as Guest</span>
        </button>
        <button className="stamp-btn leaf" onClick={onStaff}>
          <span className="tam-lbl">👨‍🍳 பணியாளர் நுழைவு</span>
          <span className="en-lbl">Staff Login</span>
        </button>
      </div>
      <div className="hint">Email &amp; password login — no external services needed.</div>
    </div>
  );
}
