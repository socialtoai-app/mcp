"""Analyze public Xiaohongshu / Douyin / TikTok / X / YouTube post comments via SocialToAI.app."""
import os
import uuid
import requests

API_KEY = os.environ["SOCIALTOAI_API_KEY"]
BASE = "https://socialtoai.app"

def run_comment_insights(targets: list[str], focus: str = "", scale: str = "small"):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Idempotency-Key": str(uuid.uuid4()),
    }
    payload = {
        "targets": targets,
        "scale": scale,  # small (200), medium (1000), large (3000)
        "confirm": True,
    }
    if focus:
        payload["focus"] = focus
    res = requests.post(f"{BASE}/v1/tools/comment_insights", headers=headers, json=payload, timeout=60)
    res.raise_for_status()
    return res.json()

if __name__ == "__main__":
    data = run_comment_insights(
        targets=["https://www.xiaohongshu.com/explore/65a1b2c30000000012345678"],
        focus="price",
        scale="small",
    )
    print("Handle (24h free readback):", data.get("handle"))
    print("Sampled comments:", data.get("sampled_comments"))
    print("Themes:", data.get("themes"))
