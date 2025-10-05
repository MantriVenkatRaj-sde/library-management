from fastapi import FastAPI, Query
from pydantic import BaseModel
import joblib
import pandas as pd
import json
import os
from sklearn.metrics.pairwise import cosine_similarity

ARTIFACT_DIR = os.getenv("ARTIFACT_DIR", "./artifacts")
VECTORIZER_PATH = os.path.join(ARTIFACT_DIR, "vectorizer.joblib")
X_PATH = os.path.join(ARTIFACT_DIR, "X_csr.joblib")
ITEMS_PATH = os.path.join(ARTIFACT_DIR, "items.parquet")
IDMAP_PATH = os.path.join(ARTIFACT_DIR, "id_maps.json")

# Load artifacts
vectorizer = joblib.load(VECTORIZER_PATH)
X = joblib.load(X_PATH)
items = pd.read_parquet(ITEMS_PATH)
with open(IDMAP_PATH, "r", encoding="utf-8") as f:
    id_maps = json.load(f)

isbn_to_idx = id_maps.get("isbn_to_idx", {})
idx_to_isbn = {int(v): k for k, v in isbn_to_idx.items()}

app = FastAPI()

class SimilarItem(BaseModel):
    isbn: str
    score: float
    title: str | None = None
    imageLink: str | None = None

class SimilarResponse(BaseModel):
    items: list[SimilarItem]

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/similar", response_model=SimilarResponse)
async def similar(isbn: str, k: int = 10):
    if isbn not in isbn_to_idx:
        return {"items": []}
    idx = isbn_to_idx[isbn]
    vec = X[idx]
    sims = cosine_similarity(vec, X).ravel()
    topk_idx = sims.argsort()[::-1][1:k+1]
    
    recs = []
    for i in topk_idx:
        item_row = items.iloc[i]
        recs.append({
            "isbn": str(item_row["isbn"]) if pd.notna(item_row.get("isbn")) else "",
            "score": float(sims[i]),
            "title": str(item_row["title"]) if "title" in items.columns and pd.notna(item_row.get("title")) else None,
            "imageLink": str(item_row["coverImg"]) if "coverImg" in items.columns and pd.notna(item_row.get("coverImg")) else None
        })
    return {"items": recs}

@app.get("/similarByTitle", response_model=SimilarResponse)
async def similar_by_title(q: str, k: int = 10):
    mask = items["title"].str.contains(q, case=False, na=False)
    if not mask.any():
        return {"items": []}
    
    matched_positions = items[mask].index.tolist()
    matched_df_idx = matched_positions[0]
    pos_idx = items.index.get_loc(matched_df_idx)
    
    vec = X[pos_idx]
    sims = cosine_similarity(vec, X).ravel()
    topk_idx = sims.argsort()[::-1][1:k+1]
    
    recs = []
    for i in topk_idx:
        item_row = items.iloc[i]
        recs.append({
            "isbn": str(item_row["isbn"]) if pd.notna(item_row.get("isbn")) else "",
            "score": float(sims[i]),
            "title": str(item_row["title"]) if pd.notna(item_row.get("title")) else None,
            "imageLink": str(item_row["coverImg"]) if "coverImg" in items.columns and pd.notna(item_row.get("coverImg")) else None
        })
    return {"items": recs}