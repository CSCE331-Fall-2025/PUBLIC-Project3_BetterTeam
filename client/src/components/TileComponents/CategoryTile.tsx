import "./CategoryTile.css";

interface TileProps {
  title: string;
  subtitle?: string;
  image?: string;
  onClick: () => void;
  highlight?: boolean;
}

export default function CategoryTile({
  title,
  subtitle,
  image,
  onClick,
  highlight
}: TileProps) {
  return (
    <div
      className={`category-tile ${highlight ? "tile-highlight" : ""}`}
      onClick={onClick}
    >
      {image && <img src={image} className="tile-img" alt={title} />}
      <h2 className="tile-title">{title}</h2>
      {subtitle && <p className="tile-sub">{subtitle}</p>}
    </div>
  );
}
