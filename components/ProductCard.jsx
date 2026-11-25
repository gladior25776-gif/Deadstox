"use client";
import { useState } from "react";
import Reveal from "./Reveal";
import ZoomImage from "./ZoomImage";
import { useCart } from "./CartProvider";
import { SIZES, formatPrice } from "@/lib/products";

export default function ProductCard({ product, index }) {
  const { add } = useCart();
  const [size, setSize] = useState("M");
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    add(product.id, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <Reveal as="article" className="card" delay={(index % 3) * 100}>
      <div className="card-media" data-cursor="Zoom">
        <ZoomImage src={product.image} alt={product.name} />
        {product.badge && <span className="badge">{product.badge}</span>}
      </div>
      <div className="card-info">
        <div className="card-row">
          <h3 className="card-name">{product.name}</h3>
          <span className="price">{formatPrice(product.price)}</span>
        </div>
        <p className="card-meta">{product.meta}</p>
        <div className="card-actions">
          <div className="sizes" role="radiogroup" aria-label="Size">
            {SIZES.map((s) => (
              <button
                key={s}
                role="radio"
                aria-checked={size === s}
                className={`size ${size === s ? "on" : ""}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <button className={`btn btn-primary add ${added ? "added" : ""}`} onClick={onAdd}>
            <span>{added ? "Added ✓" : "Add to cart"}</span>
          </button>
        </div>
      </div>
    </Reveal>
  );
}
