import { useState } from "react";

const PRODUCTS = [
  { id: 1, name: "iPhone 14", category: "Phone", price: 699, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcQ2MwmY_gS59uCisAkf1r2IGtJ4seftOBLyosMR-vLg&s=10", desc: "Best camera phone" },
  { id: 2, name: "Samsung Galaxy M32", category: "Phone", price: 299, image: "https://fonezone.com/cdn/shop/files/Untitled_22_ca7efb5c-ce1c-4389-97eb-f1c18b0f1c6e_1000x.jpg?v=1764229253", desc: "Budget phone under $500" },
  { id: 3, name: "Redmi Note 12", category: "Phone", price: 199, image: "https://m.media-amazon.com/images/I/51ZCk7jqdTL.jpg", desc: "Value for money under $500" },
  { id: 4, name: "OnePlus 11R", category: "Phone", price: 450, image: "https://m.media-amazon.com/images/I/51PwtkkaV2L._SX679_.jpg", desc: "Flagship killer under $500" },
  { id: 5, name: "MacBook Air M2", category: "Laptop", price: 999, image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQhprMEPpuM1di-iWGa_1_Jq6rIQoPqG3tDRuEKmOgSzKnF9WSs-rx02YtNDOkTXxFcNl20A7i9k4HAHXfTirbh_AI4MDdGD2ls8V6sNF-AcBgtHdTRUREVrZA&usqp=CAc", desc: "Super fast laptop" },
  { id: 6, name: "HP Pavilion 14", category: "Laptop", price: 550, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400", desc: "Best for students" },
  { id: 7, name: "Dell XPS 13", category: "Laptop", price: 850, image: "https://static0.pocketlintimages.com/wordpress/wp-content/uploads/wm/2025/01/dell-xps-13-intel-core-ultra-series-2-header-image.jpg?w=1600&h=1600&fit=crop", desc: "Premium ultrabook" },
  { id: 8, name: "Lenovo IdeaPad", category: "Laptop", price: 400, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV285E-OnCxsDFkry0CPv0-qitMoMOt6k5cLA8CpMOIQ&s", desc: "Budget laptop under $500" },
  { id: 9, name: "Sony WH-1000XM4", category: "Audio", price: 99, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400", desc: "Noise cancelling headphones" },
  { id: 10, name: "AirPods Pro", category: "Audio", price: 249, image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400", desc: "Best wireless earbuds" },
  { id: 11, name: "Apple Watch SE", category: "Watch", price: 279, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCdYCXalR_FrMTCzQH9V8oxUGX7rgyluDf26Uad1C5zQ&s=10", desc: "Smartwatch under $300" },
  { id: 12, name: "Canon EOS M50", category: "Camera", price: 600, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTWLPYpS-Nt6Wh9qblepZGrNY4SnrgOxFBK6_nzSm2eg&s", desc: "Best vlogging camera" },
];

function App() {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(PRODUCTS);
  const [aiReply, setAiReply] = useState("");
  const [loading, setLoading] = useState(false);

  const getAIRecommendation = async () => {
    if (!query) return alert("Please type your preference!");
    setLoading(true);
    setAiReply("");

    const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

    if (OPENAI_KEY) {
      try {
        const prompt = `You are a product recommendation AI. User says: "${query}". From product list: ${JSON.stringify(PRODUCTS.map(p=>({id:p.id, name:p.name, category:p.category, price:p.price})))}. Return only matching product IDs as JSON array like [1,3,5]. Consider price conditions like above, under, below.`;
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OPENAI_KEY}` },
          body: JSON.stringify({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }] })
        });
        const data = await res.json();
        const ids = JSON.parse(data.choices[0].message.content.match(/\[.*?\]/)[0]);
        const result = PRODUCTS.filter(p => ids.includes(p.id));
        setFiltered(result.length? result : PRODUCTS.slice(0,3));
        setAiReply(`✨ AI (GPT) Recommendation for "${query}": Found ${result.length} products.`);
      } catch (e) {
        console.error(e);
        setAiReply("AI API Error, showing local results.");
      } finally {
        setLoading(false);
      }
      return;
    }

    setTimeout(() => {
      const q = query.toLowerCase();
      let result = [...PRODUCTS];
      const priceMatch = q.match(/(\d{2,4})/);
      const priceValue = priceMatch? parseInt(priceMatch[1]) : null;

      if (priceValue) {
        if (q.includes("above") || q.includes("over") || q.includes(">") || q.includes("more than") || q.includes("greater")) {
          result = result.filter(p => p.price >= priceValue);
        } else if (q.includes("under") || q.includes("below") || q.includes("<") || q.includes("less")) {
          result = result.filter(p => p.price <= priceValue);
        }
      }

      if (q.includes("phone")) result = result.filter(p => p.category === "Phone");
      if (q.includes("laptop")) result = result.filter(p => p.category === "Laptop");
      if (q.includes("audio") || q.includes("headphone") || q.includes("earbuds") || q.includes("sony") || q.includes("airpods")) result = result.filter(p => p.category === "Audio");
      if (q.includes("watch")) result = result.filter(p => p.category === "Watch");
      if (q.includes("camera") || q.includes("canon")) result = result.filter(p => p.category === "Camera");

      setFiltered(result);
      setAiReply(result.length? `✨ AI Recommendation for "${query}": Found ${result.length} best products.` : `No products found for "${query}".`);
      setLoading(false);
    }, 600);
  };

  const resetAll = () => { setFiltered(PRODUCTS); setQuery(""); setAiReply(""); }

  return (
    <div style={{ fontFamily: "'Inter', Arial", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", minHeight: "100vh", padding: "20px", overflowX: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; overflow-x: hidden; }
    .card:hover { transform: translateY(-8px); box-shadow: 0 20px 30px rgba(0,0,0,0.2)!important; }
    .card { transition: all 0.3s ease; }
    .search-box { display: flex; gap: 10px; justify-content: center; background: white; padding: 14px; border-radius: 16px; max-width: 800px; width: 100%; margin: 0 auto 25px auto; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
    .search-box input { min-width: 0; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
        @media (max-width: 600px) {
      .search-box { flex-direction: column; padding: 12px; width: 100%; max-width: 100%; margin-left: auto; margin-right: auto; }
      .search-box input { width: 100%!important; flex: none; }
      .search-box button { width: 100%!important; }
      .grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
      .title { font-size: 22px!important; padding: 0 10px; }
        }
      `}</style>

      <div style={{ maxWidth: "1250px", margin: "auto", width: "100%" }}>
        <h1 className="title" style={{ textAlign: "center", marginBottom: "25px", fontWeight: "900", color: "#fff", fontSize: "36px", lineHeight: "1.3", textShadow: "0 2px 10px rgba(0,0,0,0.2)", wordWrap: "break-word" }}>
          🛒 AI Product Recommendation System
        </h1>

        <div className="search-box">
          <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && getAIRecommendation()} placeholder="🔍 e.g. laptop above 800, phone under 500" style={{ padding: "14px 16px", flex: 1, borderRadius: "12px", border: "2px solid #eee", outline: "none", fontSize: "15px", background: "#f9f9ff" }} />
          <button onClick={getAIRecommendation} style={{ padding: "14px 26px", background: "linear-gradient(90deg, #6a11cb, #2575fc)", color: "#fff", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: "800", boxShadow: "0 4px 12px rgba(37,117,252,0.3)", whiteSpace: "nowrap" }}>
            {loading? "Thinking..." : "Ask AI ✨"}
          </button>
          <button onClick={resetAll} style={{ padding: "14px 22px", background: "linear-gradient(90deg, #ff6a00, #ee0979)", color: "#fff", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: "800", boxShadow: "0 4px 12px rgba(238,9,121,0.3)", whiteSpace: "nowrap" }}>
            🔄 Show All
          </button>
        </div>

        {aiReply && <div style={{ background: "rgba(255,255,255,0.95)", padding: "14px", borderRadius: "12px", marginBottom: "22px", textAlign: "center", fontWeight: "700", color: "#2e7d32", border: "2px solid #a5d6a7", backdropFilter: "blur(10px)" }}>{aiReply}</div>}

        <div className="grid">
          {filtered.map((p) => (
            <div key={p.id} className="card" style={{ border: "none", borderRadius: "20px", padding: "14px", background: "white", boxShadow: "0 10px 25px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column", height: "400px" }}>
              <div style={{ background: "linear-gradient(135deg, #f5f7fa, #f0f2f5)", borderRadius: "14px", height: "220px", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px", position: "relative" }}>
                <span style={{ position: "absolute", top: "10px", left: "10px", background: "linear-gradient(90deg, #6a11cb, #2575fc)", color: "#fff", fontSize: "11px", padding: "4px 10px", borderRadius: "20px", fontWeight: "700" }}>{p.category}</span>
                <img src={p.image} alt={p.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "8px" }} />
              </div>
              <div style={{ textAlign: "center", marginTop: "12px", display: "flex", flexDirection: "column", flex: 1 }}>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "800", color: "#222" }}>{p.name}</h3>
                <p style={{ fontSize: "13px", color: "#777", margin: "0" }}>{p.desc}</p>
                <p style={{ margin: "8px 0", fontWeight: "bold" }}><span style={{ fontSize: "20px", color: "#2575fc" }}>${p.price}</span></p>
                <button style={{ background: "linear-gradient(90deg, #111, #333)", color: "#fff", border: "none", padding: "11px 12px", borderRadius: "12px", cursor: "pointer", width: "100%", marginTop: "auto", fontWeight: "800", letterSpacing: "0.5px" }}>🛒 Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;