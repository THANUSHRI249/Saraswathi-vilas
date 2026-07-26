const STATUS_LABEL = { free: "காலி Free", reserved: "முன்பதிவு", occupied: "நிரம்பியது" };

export default function TableGrid({ tables, selectedId, onSelect, interactive }) {
  return (
    <div className="table-grid">
      {tables.map((t) => {
        const classes = ["table-card", t.status];
        if (selectedId === t._id) classes.push("selected");
        if (!interactive) classes.push("locked");
        const clickable = interactive && t.status === "free";
        return (
          <div
            key={t._id}
            className={classes.join(" ")}
            onClick={clickable ? () => onSelect(t) : undefined}
          >
            <div className="tnum">#{t.number}</div>
            <div className="cap">Seats {t.capacity}</div>
            <div className="st">{STATUS_LABEL[t.status]}</div>
          </div>
        );
      })}
    </div>
  );
}
