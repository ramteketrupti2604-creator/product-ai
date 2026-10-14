# 🛒 AI Product Recommendation System - AI Engineer Assessment

**Duration:** 2-3 Hours | **Tech Stack:** React + OpenAI GPT-3.5 + Vercel

## 🎯 Objective
Test ability to integrate an AI-powered recommendation system with basic coding skills.

## ✨ Live Demo
**Vercel Link:** 

## 🚀 Features Implemented

1. **React Frontend**
   - Displays 12 products (Phone, Laptop, Audio, Watch, Camera)
   - Responsive grid, hover effects, modern UI
   - Product cards with image, category, price, description

2. **AI-Powered Recommendation (Hybrid)**
   - **Path A (OpenAI GPT):** If `VITE_OPENAI_API_KEY` is present, user query is sent to GPT-3.5-turbo with product list. GPT returns matching IDs like `[1,3,5]` and UI filters accordingly.
   - **Path B (Local Fallback):** If no API key, regex logic extracts price (`/(\d{2,4})/`) and keywords (above/under, phone/laptop) to filter locally. So project works even without API key.

3. **User Input Handling**
   - User can type: "I want a phone under $500", "laptop above 800", "Sony headphones"
   - On `Ask AI ✨`, AI responds with `✨ AI Recommendation for "query": Found X products`

4. **Extra - Cart Functionality**
   - Clickable Add to Cart with state management
   - Cart count in header: `Cart: 3`
   - Button animation: `Added ✓` for 1.2 sec

## 🧠 Logic Flow

User Input -> `useState(query)` -> `getAIRecommendation()` -> 
If OPENAI_KEY -> fetch OpenAI API -> Parse IDs -> setFiltered(products)
Else -> Extract price & category via regex/keywords -> filter PRODUCTS -> setFiltered

## 🛠️ Tech Stack

- React (Vite)
- OpenAI API (gpt-3.5-turbo)
- CSS-in-JS, Responsive Design
- useState for state management

## 📦 How to Run Locally

```bash
npm install
# Optional: Add .env file with VITE_OPENAI_API_KEY=sk-...
npm run dev